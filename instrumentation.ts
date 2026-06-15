// ─── OpenTelemetry + Langfuse instrumentation ────────────────────────────────
// Этот файл запускается Next.js автоматически при старте сервера.
// Инициализирует трассировку: все вызовы streamText с experimental_telemetry
// автоматически попадают в Langfuse (трейсы, tool-вызовы, стоимость, latency).
//
// Документация: https://langfuse.com/integrations/frameworks/vercel-ai-sdk

export async function register() {
  // Запускаем только на сервере — не в Edge и не в браузере
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // Если ключи не заданы — трассировка отключена, не падаем
  if (!process.env.LANGFUSE_PUBLIC_KEY || !process.env.LANGFUSE_SECRET_KEY) {
    return;
  }

  const { LangfuseSpanProcessor } = await import("@langfuse/otel");
  const { NodeTracerProvider } = await import("@opentelemetry/sdk-trace-node");

  const provider = new NodeTracerProvider({
    spanProcessors: [new LangfuseSpanProcessor()],
  });

  provider.register();
}
