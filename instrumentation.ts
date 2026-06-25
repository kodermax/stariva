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

// register() вызывается Next.js при старте Node.js-сервера.
// Используем динамический import() чтобы Turbopack не пытался резолвить
// @langfuse/otel во время сборки (он поставляется как CJS-only пакет и
// недоступен в edge/browser окружениях).
export let langfuseSpanProcessor: { forceFlush(): Promise<void> } | undefined;

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { LangfuseSpanProcessor } = await import("@langfuse/otel");
    const { NodeTracerProvider } =
      await import("@opentelemetry/sdk-trace-node");

    langfuseSpanProcessor = new LangfuseSpanProcessor();

    const tracerProvider = new NodeTracerProvider({
      spanProcessors: [langfuseSpanProcessor],
    });

    tracerProvider.register();
  }
}
