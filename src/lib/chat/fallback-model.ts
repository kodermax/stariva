import type {
  LanguageModelV4,
  LanguageModelV4CallOptions,
  LanguageModelV4GenerateResult,
  LanguageModelV4StreamPart,
  LanguageModelV4StreamResult,
} from "@ai-sdk/provider";

/**
 * Описание провайдера в цепочке fallback.
 */
export type FallbackEntry = {
  /** Человекочитаемое имя провайдера для логов (groq, cerebras, ...) */
  name: string;
  /** Модель, реализующая интерфейс LanguageModelV4 */
  model: LanguageModelV4;
};

/**
 * Типы частей стрима, которые означают «модель уже начала отдавать ответ».
 * После любой из них переключаться на другого провайдера уже нельзя —
 * клиент мог получить часть данных. До них переключение безопасно.
 */
const CONTENT_PART_TYPES = new Set<LanguageModelV4StreamPart["type"]>([
  "text-delta",
  "reasoning-delta",
  "tool-call",
  "tool-input-start",
  "tool-input-delta",
  "tool-result",
  "tool-approval-request",
  "file",
  "source",
]);

// ─── Определение ошибок, при которых стоит пробовать следующий провайдер ────

/**
 * Возвращает true, если ошибку имеет смысл «пережить» переключением
 * на резервного провайдера (rate limit, перегрузка, сетевые сбои,
 * неудачный вызов функции и т.п.).
 */
export function isFallbackError(error: unknown): boolean {
  // AI SDK: APICallError имеет числовой statusCode
  if (
    error != null &&
    typeof error === "object" &&
    "statusCode" in error &&
    typeof (error as { statusCode: unknown }).statusCode === "number"
  ) {
    const status = (error as { statusCode: number }).statusCode;
    if (status === 408 || status === 409 || status === 429 || status >= 500) {
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
      dataStr.includes("failed_generation") ||
      dataStr.includes("rate_limit")
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

// ─── Стриминг с переключением провайдеров ───────────────────────────────────

/**
 * Запускает doStream у первого провайдера, который успел отдать контент.
 *
 * Логика устойчивости:
 *  - если doStream упал ошибкой ДО возврата стрима (например 429 на запросе) —
 *    пробуем следующего провайдера;
 *  - если стрим начался, но первая значимая часть — это `error` (или стрим
 *    закончился вообще без контента) — тоже пробуем следующего провайдера;
 *  - как только пришла первая значимая часть (текст / tool call), мы
 *    «фиксируемся» на этом провайдере и проксируем стрим как есть.
 *
 * Благодаря тому, что эта логика живёт на уровне модели, переключение
 * срабатывает на КАЖДОМ шаге агентного цикла streamText (multi-step),
 * а не только на самом первом запросе.
 */
async function streamWithFallback(
  entries: FallbackEntry[],
  options: LanguageModelV4CallOptions,
  onFallback: (from: string, to: string, error: unknown) => void,
): Promise<LanguageModelV4StreamResult> {
  let lastError: unknown;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const isLast = i === entries.length - 1;
    let reader: ReadableStreamDefaultReader<LanguageModelV4StreamPart> | null =
      null;

    try {
      const result = await entry.model.doStream(options);
      reader = result.stream.getReader();

      const buffered: LanguageModelV4StreamPart[] = [];
      let hasContent = false;
      let upstreamDone = false;

      // Читаем стрим до первой значимой части, ошибки или конца стрима.
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          upstreamDone = true;
          break;
        }

        // Ошибка до начала контента — повод переключиться на резерв.
        if (value.type === "error" && !hasContent) {
          throw value.error ?? new Error("stream_error");
        }

        buffered.push(value);

        if (CONTENT_PART_TYPES.has(value.type)) {
          hasContent = true;
          break;
        }
      }

      // Стрим закончился без единой значимой части — это пустой ответ.
      if (!hasContent && upstreamDone) {
        throw new Error(
          "empty_response: provider returned no text and no tool calls",
        );
      }

      // Фиксируемся на этом провайдере: проигрываем буфер + остаток стрима.
      const committedReader = reader;
      reader = null; // не отменяем в finally/catch — стрим уходит наружу
      const stream = new ReadableStream<LanguageModelV4StreamPart>({
        async start(controller) {
          for (const chunk of buffered) {
            controller.enqueue(chunk);
          }
          if (upstreamDone) {
            controller.close();
            return;
          }
          try {
            while (true) {
              const { value, done } = await committedReader.read();
              if (done) break;
              controller.enqueue(value);
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
        cancel(reason) {
          committedReader.cancel(reason).catch(() => {});
        },
      });

      return { stream, request: result.request, response: result.response };
    } catch (error) {
      lastError = error;
      // Освобождаем неудачный стрим, если он был открыт.
      if (reader) {
        reader.cancel(error).catch(() => {});
      }

      if (!isLast && isFallbackError(error)) {
        onFallback(entry.name, entries[i + 1].name, error);
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("no_available_providers");
}

// ─── Генерация (non-streaming) с переключением провайдеров ───────────────────

async function generateWithFallback(
  entries: FallbackEntry[],
  options: LanguageModelV4CallOptions,
  onFallback: (from: string, to: string, error: unknown) => void,
): Promise<LanguageModelV4GenerateResult> {
  let lastError: unknown;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const isLast = i === entries.length - 1;
    try {
      return await entry.model.doGenerate(options);
    } catch (error) {
      lastError = error;
      if (!isLast && isFallbackError(error)) {
        onFallback(entry.name, entries[i + 1].name, error);
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("no_available_providers");
}

// ─── Фабрика fallback-модели ─────────────────────────────────────────────────

export type FallbackModelOptions = {
  /** Колбэк вызывается при каждом переключении на резервного провайдера. */
  onFallback?: (from: string, to: string, error: unknown) => void;
};

/**
 * Оборачивает список моделей в одну модель LanguageModelV4 с автоматическим
 * переключением на резерв при ошибках. Переключение прозрачно для streamText
 * и срабатывает на каждом шаге агентного цикла.
 */
export function createFallbackModel(
  entries: FallbackEntry[],
  options: FallbackModelOptions = {},
): LanguageModelV4 {
  if (entries.length === 0) {
    throw new Error("createFallbackModel: требуется хотя бы одна модель");
  }

  const primary = entries[0].model;
  const onFallback =
    options.onFallback ??
    ((from, to, error) => {
      const reason = error instanceof Error ? error.message : String(error);
      console.warn(`[ai/chat] fallback ${from} → ${to}: ${reason}`);
    });

  return {
    specificationVersion: "v4",
    provider: `fallback(${entries.map((e) => e.name).join(",")})`,
    modelId: primary.modelId,
    supportedUrls: primary.supportedUrls,
    doStream: (callOptions) =>
      streamWithFallback(entries, callOptions, onFallback),
    doGenerate: (callOptions) =>
      generateWithFallback(entries, callOptions, onFallback),
  };
}
