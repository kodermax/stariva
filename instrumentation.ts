// ─── OpenTelemetry + Langfuse instrumentation ────────────────────────────────
// Этот файл запускается Next.js автоматически при старте сервера.
// Инициализирует трассировку: все вызовы streamText с experimental_telemetry
// автоматически попадают в Langfuse (трейсы, tool-вызовы, стоимость, latency).
//
// Документация: https://langfuse.com/integrations/frameworks/vercel-ai-sdk
//
// ВАЖНО: используем NodeTracerProvider напрямую, а не registerOTel из @vercel/otel,
// так как @vercel/otel не поддерживает OpenTelemetry JS SDK v2, на котором
// основаны @langfuse/otel и @langfuse/tracing.
// https://github.com/vercel/otel/issues/154

import { LangfuseSpanProcessor } from "@langfuse/otel";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

// Создаём процессор на уровне модуля — он живёт всё время работы сервера.
// Экспортируем для вызова forceFlush() из route-handler после стриминга.
export const langfuseSpanProcessor = new LangfuseSpanProcessor();

const tracerProvider = new NodeTracerProvider({
  spanProcessors: [langfuseSpanProcessor],
});

tracerProvider.register();

// register() требуется Next.js как экспорт из instrumentation.ts,
// но реальная инициализация уже произошла выше при загрузке модуля.
export async function register() {}
