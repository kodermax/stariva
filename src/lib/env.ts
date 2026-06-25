import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Серверные переменные окружения (доступны только на сервере)
   */
  server: {
    OZON_API_KEY: z.string().min(1).optional(),
    OZON_CLIENT_ID: z.string().min(1).optional(),

    // Groq AI (ai-sdk) — основной провайдер AI-помощника
    GROQ_API_KEY: z.string().min(1).optional(),
    GROQ_MODEL: z
      .string()
      .min(1)
      .default("llama3-groq-70b-8192-tool-use-preview"),

    // Cerebras AI (резервный провайдер, если Groq недоступен или вернул ошибку)
    CEREBRAS_API_KEY: z.string().min(1).optional(),
    CEREBRAS_MODEL: z.string().min(1).default("gpt-oss-120b"),

    // OpenRouter (последний резервный провайдер, если Groq и Cerebras недоступны)
    OPENROUTER_API_KEY: z.string().min(1).optional(),
    OPENROUTER_MODEL: z.string().min(1).default("openai/gpt-oss-120b:free"),

    // Langfuse — трассировка и логирование запросов к AI (опционально)
    // Ключи: https://cloud.langfuse.com → Settings → API Keys
    LANGFUSE_PUBLIC_KEY: z.string().min(1).optional(),
    LANGFUSE_SECRET_KEY: z.string().min(1).optional(),
    LANGFUSE_BASE_URL: z
      .string()
      .url()
      .default("https://cloud.langfuse.com")
      .optional(),

    // Telegram Bot API — для отправки заявок на индивидуальный заказ
    TELEGRAM_BOT_TOKEN: z.string().min(1).optional(),
    TELEGRAM_CHAT_ID: z.string().min(1).optional(),

    // Resend (HTTP API) — необязательный канал доставки заявок на email
    RESEND_API_KEY: z.string().min(1).optional(),
    ORDER_EMAIL_TO: z.string().email().optional(),
    ORDER_EMAIL_FROM: z.string().min(1).optional(),

    // PostgreSQL — строка подключения для Drizzle ORM и better-auth
    // Формат: postgres://user:password@host:port/database
    DATABASE_URL: z.string().url().optional(),

    // better-auth — секрет для подписи сессий и базовый URL приложения
    // Сгенерировать секрет: `openssl rand -base64 32`
    BETTER_AUTH_SECRET: z.string().min(1).optional(),
    BETTER_AUTH_URL: z.string().url().optional(),

    // YooKassa — приём онлайн-платежей за мастер-классы
    // shopId и секретный ключ из личного кабинета ЮKassa
    YOOKASSA_SHOP_ID: z.string().min(1).optional(),
    YOOKASSA_SECRET_KEY: z.string().min(1).optional(),

    // Yandex Cloud S3 — хранилище видеоуроков и материалов (pre-signed URL)
    YANDEX_S3_ENDPOINT: z
      .string()
      .url()
      .default("https://storage.yandexcloud.net"),
    YANDEX_S3_REGION: z.string().min(1).default("ru-central1"),
    YANDEX_S3_ACCESS_KEY_ID: z.string().min(1).optional(),
    YANDEX_S3_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    YANDEX_S3_BUCKET: z.string().min(1).optional(),

    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Клиентские переменные окружения (доступны в браузере)
   * Должны начинаться с NEXT_PUBLIC_
   */
  client: {
    // Базовый публичный URL сайта (для ссылок и редиректов после оплаты)
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  },

  /**
   * Переменные, которые используются во время сборки
   * Можно использовать как серверные, так и клиентские переменные
   */
  runtimeEnv: {
    OZON_API_KEY: process.env.OZON_API_KEY,
    OZON_CLIENT_ID: process.env.OZON_CLIENT_ID,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_MODEL: process.env.GROQ_MODEL,
    CEREBRAS_API_KEY: process.env.CEREBRAS_API_KEY,
    CEREBRAS_MODEL: process.env.CEREBRAS_MODEL,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
    LANGFUSE_PUBLIC_KEY: process.env.LANGFUSE_PUBLIC_KEY,
    LANGFUSE_SECRET_KEY: process.env.LANGFUSE_SECRET_KEY,
    LANGFUSE_BASE_URL: process.env.LANGFUSE_BASE_URL,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ORDER_EMAIL_TO: process.env.ORDER_EMAIL_TO,
    ORDER_EMAIL_FROM: process.env.ORDER_EMAIL_FROM,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    YOOKASSA_SHOP_ID: process.env.YOOKASSA_SHOP_ID,
    YOOKASSA_SECRET_KEY: process.env.YOOKASSA_SECRET_KEY,
    YANDEX_S3_ENDPOINT: process.env.YANDEX_S3_ENDPOINT,
    YANDEX_S3_REGION: process.env.YANDEX_S3_REGION,
    YANDEX_S3_ACCESS_KEY_ID: process.env.YANDEX_S3_ACCESS_KEY_ID,
    YANDEX_S3_SECRET_ACCESS_KEY: process.env.YANDEX_S3_SECRET_ACCESS_KEY,
    YANDEX_S3_BUCKET: process.env.YANDEX_S3_BUCKET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },

  /**
   * Пропускать валидацию во время сборки в CI/CD
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Делает так, что пустые строки считаются undefined
   */
  emptyStringAsUndefined: true,
});
