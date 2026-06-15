import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Серверные переменные окружения (доступны только на сервере)
   */
  server: {
    OZON_API_KEY: z.string().min(1).optional(),
    OZON_CLIENT_ID: z.string().min(1).optional(),

    // Groq AI (ai-sdk) — для AI-помощника по индивидуальным заказам
    GROQ_API_KEY: z.string().min(1).optional(),
    GROQ_MODEL: z.string().min(1).default("llama-3.3-70b-versatile"),

    // Telegram Bot API — для отправки заявок на индивидуальный заказ
    TELEGRAM_BOT_TOKEN: z.string().min(1).optional(),
    TELEGRAM_CHAT_ID: z.string().min(1).optional(),

    // Resend (HTTP API) — необязательный канал доставки заявок на email
    RESEND_API_KEY: z.string().min(1).optional(),
    ORDER_EMAIL_TO: z.string().email().optional(),
    ORDER_EMAIL_FROM: z.string().min(1).optional(),

    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Клиентские переменные окружения (доступны в браузере)
   * Должны начинаться с NEXT_PUBLIC_
   */
  client: {
    // NEXT_PUBLIC_APP_URL: z.string().url().optional(),
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
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ORDER_EMAIL_TO: process.env.ORDER_EMAIL_TO,
    ORDER_EMAIL_FROM: process.env.ORDER_EMAIL_FROM,
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
