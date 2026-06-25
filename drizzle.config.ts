import { defineConfig } from "drizzle-kit";

/**
 * Конфигурация drizzle-kit для генерации и применения миграций.
 *
 * DATABASE_URL подхватывается автоматически из .env / .env.local
 * при запуске через `bun run`.
 *
 * Команды:
 *   bun run db:generate  — сгенерировать SQL-миграцию из схемы
 *   bun run db:migrate   — применить миграции к базе (запускаете вы вручную)
 *   bun run db:studio    — открыть Drizzle Studio
 */
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  casing: "snake_case",
  verbose: true,
  strict: true,
});
