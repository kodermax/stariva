import { createGroq } from "@ai-sdk/groq";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type ToolSet,
  type UIMessage,
  validateUIMessages,
} from "ai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat/knowledge";
import { chatTools } from "@/lib/chat/tools";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 30;

// Ограничение нагрузки: не пропускаем гигантские истории в модель
const MAX_MESSAGES = 24;
const MAX_CHARS_PER_MESSAGE = 4000;

export async function POST(request: NextRequest) {
  if (!env.GROQ_API_KEY) {
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

  let messages: UIMessage[];
  try {
    messages = await validateUIMessages({
      messages: rawMessages,
      tools: chatTools,
    });
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

  const groq = createGroq({ apiKey: env.GROQ_API_KEY });

  try {
    const result = streamText({
      model: groq(env.GROQ_MODEL),
      system: buildSystemPrompt(),
      messages: await convertToModelMessages(trimmed),
      tools: chatTools as ToolSet,
      // Разрешаем несколько шагов: вызвать инструмент → получить данные →
      // сформулировать осмысленный ответ клиенту.
      stopWhen: stepCountIs(5),
      temperature: 0.6,
    });

    return result.toUIMessageStreamResponse({
      // Отдаём осмысленный текст ошибки клиенту вместо «An error occurred».
      onError: (error) => {
        console.error("[ai/chat] stream error:", error);
        return "Не удалось получить ответ. Попробуйте ещё раз.";
      },
    });
  } catch (error) {
    console.error("[ai/chat] Groq error:", error);
    return NextResponse.json(
      { error: "Не удалось получить ответ. Попробуйте позже." },
      { status: 502 },
    );
  }
}
