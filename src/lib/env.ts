import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Серверные переменные окружения (доступны только на сервере)
   */
  server: {
    OZON_API_KEY: z.string().min(1),
    OZON_CLIENT_ID: z.string().min(1),
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
