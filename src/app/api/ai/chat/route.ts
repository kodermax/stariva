import { createGroq } from "@ai-sdk/groq";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { observe, propagateAttributes } from "@langfuse/tracing";
import { trace } from "@opentelemetry/api";
import {
  convertToModelMessages,
  type LanguageModel,
  type ModelMessage,
  stepCountIs,
  streamText,
  type ToolSet,
  type UIMessage,
  validateUIMessages,
} from "ai";
import type { NextRequest } from "next/server";
import { after, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat/knowledge";
import { chatTools } from "@/lib/chat/tools";
import { env } from "@/lib/env";
import { langfuseSpanProcessor } from "../../../../../instrumentation";

export const runtime = "nodejs";
export const maxDuration = 30;

// Ограничение нагрузки: не пропускаем гигантские истории в модель
const MAX_MESSAGES = 24;
const MAX_CHARS_PER_MESSAGE = 4000;

// ─── Провайдеры ──────────────────────────────────────────────────────────────

/**
 * Возвращает список доступных моделей в порядке приоритета.
 * Groq — основной, Cerebras — резервный, OpenRouter — последний запасной.
 */
function getAvailableModels(): Array<{ name: string; model: LanguageModel }> {
  const models: Array<{ name: string; model: LanguageModel }> = [];

  if (env.GROQ_API_KEY) {
    const groq = createGroq({ apiKey: env.GROQ_API_KEY });
    models.push({ name: "groq", model: groq(env.GROQ_MODEL) });
  }

  if (env.CEREBRAS_API_KEY) {
    const cerebras = createOpenAICompatible({
      name: "cerebras",
      apiKey: env.CEREBRAS_API_KEY,
      baseURL: "https://api.cerebras.ai/v1",
      headers: { "X-Cerebras-3rd-Party-Integration": "vercel-ai-sdk" },
    });
    models.push({ name: "cerebras", model: cerebras(env.CEREBRAS_MODEL) });
  }

  if (env.OPENROUTER_API_KEY) {
    const openrouter = createOpenAICompatible({
      name: "openrouter",
      apiKey: env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
    models.push({
      name: "openrouter",
      model: openrouter(env.OPENROUTER_MODEL),
    });
  }

  return models;
}

// ─── Определение ошибок, при которых стоит пробовать следующий провайдер ────

function isFallbackError(error: unknown): boolean {
  // AI SDK: AIAPICallError имеет числовой statusCode
  if (
    error != null &&
    typeof error === "object" &&
    "statusCode" in error &&
    typeof (error as { statusCode: unknown }).statusCode === "number"
  ) {
    const status = (error as { statusCode: number }).statusCode;
    if (status === 429 || status === 502 || status === 503 || status === 529) {
      return true;
    }
  }

  // Проверяем вложенный responseBody / data — Groq возвращает {error: {message, type}}
  const data =
    (error as { data?: unknown })?.data ??
    (error as { responseBody?: unknown })?.responseBody;
  if (data != null) {
    const dataStr =
      typeof data === "string" ? data : JSON.stringify(data ?? "");
    if (
      dataStr.includes("Failed to call a function") ||
      dataStr.includes("failed_generation")
    ) {
      return true;
    }
  }

  const msg = error instanceof Error ? error.message : String(error ?? "");
  return (
    // Groq: модель не смогла вызвать tool — пробуем другой провайдер
    msg.includes("Failed to call a function") ||
    msg.includes("failed_generation") ||
    // Groq: вернул пустой ответ без текста и без tool calls
    msg.includes("empty_response") ||
    // Groq: в истории есть reasoning parts, которые модель не поддерживает
    msg.includes("reasoning is not supported") ||
    msg.includes("rate_limit") ||
    msg.includes("Rate limit") ||
    msg.includes("overloaded") ||
    msg.includes("Service Unavailable") ||
    msg.includes("Bad Gateway") ||
    msg.includes("timeout") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ECONNRESET") ||
    msg.includes("ECONNREFUSED")
  );
}

// ─── Попытка стриминга через конкретную модель ───────────────────────────────

/**
 * Запускает streamText и ждёт первых данных или ошибки.
 * Возвращает result если поток начался успешно.
 * Бросает ошибку если провайдер ответил ошибкой ДО начала стриминга
 * (например "Failed to call a function" от Groq).
 */
async function tryStreamText(
  model: LanguageModel,
  params: {
    system: string;
    messages: Awaited<ReturnType<typeof convertToModelMessages>>;
    tools: ToolSet;
    sessionId: string;
    providerName: string;
  },
) {
  const telemetryEnabled =
    !!env.LANGFUSE_PUBLIC_KEY && !!env.LANGFUSE_SECRET_KEY;

  // Промис, который реджектится если streamText поймал ошибку провайдера.
  // Резолвится как только первый chunk пришёл (поток начался нормально).
  let resolveStreamStarted: () => void;
  let rejectStreamStarted: (e: unknown) => void;
  const streamStarted = new Promise<void>((res, rej) => {
    resolveStreamStarted = res;
    rejectStreamStarted = rej;
  });

  let gotChunk = false;

  const result = streamText({
    model,
    system: params.system,
    messages: params.messages,
    tools: params.tools,
    stopWhen: stepCountIs(5),
    temperature: 0.6,
    maxRetries: 0,
    experimental_telemetry: {
      isEnabled: telemetryEnabled,
      functionId: `stariva-chat:${params.providerName}:${params.sessionId}`,
    },
    onChunk: ({ chunk }) => {
      // Tool calls тоже считаются валидным ответом
      if (
        chunk.type === "text-delta" ||
        chunk.type === "tool-call" ||
        chunk.type === "tool-input-start"
      ) {
        gotChunk = true;
        resolveStreamStarted();
      }
    },
    onError: ({ error }) => rejectStreamStarted(error),
    onFinish: () => {
      if (!gotChunk) {
        rejectStreamStarted(
          new Error(
            "empty_response: provider returned no text and no tool calls",
          ),
        );
      } else {
        resolveStreamStarted();
      }
    },
  });

  // Ждём либо первый chunk, либо ошибку провайдера
  await streamStarted;

  return result;
}

// ─── Основной обработчик ─────────────────────────────────────────────────────

async function handler(request: NextRequest) {
  const models = getAvailableModels();

  if (models.length === 0) {
    return NextResponse.json(
      { error: "AI-консультант не настроен", code: "not_configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(rawMessages)) {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  // sessionId для группировки трейсов одного чата в Langfuse
  const sessionId =
    (body as { sessionId?: string })?.sessionId ??
    `anon-${Date.now().toString(36)}`;

  let messages: UIMessage[];
  try {
    messages = await validateUIMessages({ messages: rawMessages });
  } catch {
    return NextResponse.json(
      { error: "Некорректный формат сообщений" },
      { status: 400 },
    );
  }

  // Берём только последние сообщения и подрезаем слишком длинные тексты
  const trimmed = messages.slice(-MAX_MESSAGES).map((message) => ({
    ...message,
    parts: message.parts.map((part) =>
      part.type === "text"
        ? { ...part, text: part.text.slice(0, MAX_CHARS_PER_MESSAGE) }
        : part,
    ),
  }));

  const modelMessages = await convertToModelMessages(trimmed);

  // Groq не поддерживает reasoning parts в истории сообщений —
  // удаляем их чтобы не получить 400 при fallback с reasoning-модели
  const safeModelMessages: ModelMessage[] = modelMessages.map((msg) => {
    if (!("content" in msg) || !Array.isArray(msg.content)) return msg;
    return {
      ...msg,
      content: msg.content.filter(
        (part: { type?: string }) => part.type !== "reasoning",
      ),
    } as ModelMessage;
  });
  const system = buildSystemPrompt();

  // Извлекаем текст последнего сообщения пользователя для input трейса
  const lastUserMessage = [...trimmed].reverse().find((m) => m.role === "user");
  const inputText = lastUserMessage?.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join(" ");

  // Устанавливаем input на root span через атрибуты OTel
  const activeSpan = trace.getActiveSpan();
  if (activeSpan && inputText) {
    activeSpan.setAttribute("langfuse.input", inputText);
  }

  // ─── Перебираем провайдеры по очереди ──────────────────────────────────────
  let lastError: unknown;

  return await propagateAttributes({ sessionId }, async () => {
    for (const { name, model } of models) {
      try {
        const result = await tryStreamText(model, {
          system,
          messages: safeModelMessages,
          tools: chatTools as ToolSet,
          sessionId,
          providerName: name,
        });

        const streamResponse = result.toUIMessageStreamResponse({
          onError: (error) => {
            console.error(`[ai/chat] stream error (${name}):`, error);
            return "Не удалось получить ответ. Попробуйте ещё раз.";
          },
        });

        // Обновляем output root span и закрываем его после завершения стрима
        Promise.resolve(result.text).then(
          (text) => {
            activeSpan?.setAttribute("langfuse.output", text);
            activeSpan?.end();
          },
          () => {
            activeSpan?.end();
          },
        );

        // Гарантируем flush трейса в Langfuse после завершения стрима
        // (важно для serverless: функция может завершиться до отправки трейса)
        after(async () => await langfuseSpanProcessor?.forceFlush());

        return streamResponse;
      } catch (error) {
        lastError = error;
        console.error(`[ai/chat] provider "${name}" failed:`, error);

        if (isFallbackError(error)) {
          const isLast = name === models[models.length - 1].name;
          if (!isLast) {
            console.warn(
              `[ai/chat] falling back from "${name}" to next provider`,
            );
            continue;
          }
          // Последний провайдер тоже упал — выходим из цикла
          break;
        }

        break;
      }
    }

    console.error("[ai/chat] all providers failed, last error:", lastError);
    return NextResponse.json(
      { error: "Не удалось получить ответ. Попробуйте позже." },
      { status: 502 },
    );
  });
}

// Оборачиваем handler в observe() — создаёт корневой трейс в Langfuse.
// endOnExit: false — span не закрывается сразу, ждёт завершения стрима
export const POST = observe(handler, {
  name: "stariva-chat",
  endOnExit: false,
});
