import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/lib/env";
import * as schema from "./schema";

/**
 * Пул соединений PostgreSQL.
 *
 * В dev-режиме Next.js пересоздаёт модули при HMR, поэтому держим единый пул
 * на глобальном объекте, чтобы не плодить соединения.
 */
const globalForDb = globalThis as unknown as {
  __starivaPool?: Pool;
};

function createPool(): Pool {
  if (!env.DATABASE_URL && env.NODE_ENV === "production") {
    // В production строка подключения обязательна
    console.error("DATABASE_URL не задан в production-окружении");
  }
  // Pool создаётся лениво и не открывает соединение до первого запроса,
  // поэтому импорт модуля без БД (например, во время сборки) безопасен.
  return new Pool({ connectionString: env.DATABASE_URL });
}

export const pool = globalForDb.__starivaPool ?? createPool();

if (env.NODE_ENV !== "production") {
  globalForDb.__starivaPool = pool;
}

export const db = drizzle(pool, { schema });

export { schema };
