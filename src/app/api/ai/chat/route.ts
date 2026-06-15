import { createGroq } from "@ai-sdk/groq";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import {
  convertToModelMessages,
  type LanguageModel,
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

export const runtime = "nodejs";
export const maxDuration = 30;

// Ограничение нагрузки: не пропускаем гигантские истории в модель
const MAX_MESSAGES = 24;
const MAX_CHARS_PER_MESSAGE = 4000;

// ─── Провайдеры ──────────────────────────────────────────────────────────────

/**
 * Возвращает список доступных моделей в порядке приоритета.
 * Groq — основной, Cerebras — резервный.
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

  return models;
}

// ─── Langfuse: forceFlush после стриминга ────────────────────────────────────

async function flushLangfuse() {
  try {
    // Импортируем динамически — если Langfuse не настроен, модуль всё равно
    // загружен через instrumentation.ts, но flush безопасен при пустом processor.
    const { LangfuseSpanProcessor } = await import("@langfuse/otel");
    await new LangfuseSpanProcessor().forceFlush();
  } catch {
    // Langfuse недоступен — не критично, просто пропускаем
  }
}

// ─── Определение ошибок, при которых стоит пробовать следующий провайдер ────

function isFallbackError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  return (
    msg.includes("Failed to call a function") ||
    msg.includes("503") ||
    msg.includes("502") ||
    msg.includes("529") ||
    msg.includes("rate_limit") ||
    msg.includes("overloaded") ||
    msg.includes("Service Unavailable") ||
    msg.includes("Bad Gateway")
  );
}

// ─── Попытка стриминга через конкретную модель ───────────────────────────────

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
      // Имя трейса в Langfuse
      functionId: "stariva-chat",
      metadata: {
        provider: params.providerName,
        sessionId: params.sessionId,
      },
    },
  });

  // consumeStream() выбрасывает ошибку синхронно если провайдер вернул её
  // до начала стриминга (например "Failed to call a function").
  await result.consumeStream();

  return result;
}

// ─── Основной обработчик ─────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
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
  const system = buildSystemPrompt();

  // ─── Перебираем провайдеры по очереди ──────────────────────────────────────
  let lastError: unknown;

  for (const { name, model } of models) {
    try {
      const result = await tryStreamText(model, {
        system,
        messages: modelMessages,
        tools: chatTools as ToolSet,
        sessionId,
        providerName: name,
      });

      // Гарантируем flush трейса в Langfuse после завершения стрима
      // (важно для serverless: функция может завершиться до отправки трейса)
      after(flushLangfuse);

      return result.toUIMessageStreamResponse({
        onError: (error) => {
          console.error(`[ai/chat] stream error (${name}):`, error);
          return "Не удалось получить ответ. Попробуйте ещё раз.";
        },
      });
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
      }

      break;
    }
  }

  console.error("[ai/chat] all providers failed, last error:", lastError);
  return NextResponse.json(
    { error: "Не удалось получить ответ. Попробуйте позже." },
    { status: 502 },
  );
}
