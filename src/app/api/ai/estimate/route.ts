import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import {
  calculatePrice,
  describeSelection,
  formatRub,
} from "@/lib/custom-order/pricing";

export const runtime = "nodejs";

const requestSchema = z.object({
  description: z.string().min(3).max(2000),
  productType: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  complexity: z.string().optional(),
  budget: z.string().max(100).optional(),
});

// Структура ответа AI
const estimateSchema = z.object({
  designSummary: z
    .string()
    .describe("Краткое тёплое описание предлагаемого изделия, 1–2 предложения"),
  suggestions: z
    .array(z.string())
    .min(2)
    .max(4)
    .describe("2–4 конкретные дизайн-идеи или рекомендации по материалам"),
  estimatedMin: z.number().describe("Нижняя граница стоимости в рублях"),
  estimatedMax: z.number().describe("Верхняя граница стоимости в рублях"),
  productionDays: z
    .string()
    .describe("Примерный срок изготовления, например «10–14 дней»"),
  note: z
    .string()
    .describe("Короткая заметка о том, что итоговую цену подтвердит мастер"),
});

export async function POST(request: NextRequest) {
  if (!env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "AI-помощник не настроен", code: "not_configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Заполните описание заказа" },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Базовая оценка по правилам — передаём AI как ориентир
  const ruleEstimate = calculatePrice(data);
  const selectionText = describeSelection(data);

  const groq = createGroq({ apiKey: env.GROQ_API_KEY });

  try {
    const { object } = await generateObject({
      model: groq(env.GROQ_MODEL),
      schema: estimateSchema,
      system:
        "Ты — консультант мастерской макраме Stariva. Изделия плетутся вручную из натурального хлопкового шнура. " +
        "Помогаешь клиенту с индивидуальным заказом: предлагаешь идеи дизайна и ориентировочную стоимость. " +
        "Отвечай только на русском языке, дружелюбно и по делу. " +
        "Не обещай точную цену — это ориентир, итог подтверждает мастер.",
      prompt: [
        `Запрос клиента: "${data.description}"`,
        selectionText ? `Выбранные параметры: ${selectionText}.` : "",
        data.budget ? `Бюджет клиента: ${data.budget}.` : "",
        ruleEstimate
          ? `Базовый расчёт по прайсу мастерской: ${formatRub(ruleEstimate.min)}–${formatRub(ruleEstimate.max)}. Используй его как ориентир, можешь скорректировать с учётом сложности из описания.`
          : "Параметры не выбраны — оцени по описанию, типичный диапазон для макраме 1500–8000 ₽.",
        "Дай структурированный ответ строго по схеме.",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("[ai/estimate] Groq error:", error);
    return NextResponse.json(
      { error: "Не удалось получить ответ AI. Попробуйте позже." },
      { status: 502 },
    );
  }
}
