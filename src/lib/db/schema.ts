import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

/**
 * Схема БД Stariva.
 *
 * Таблицы аутентификации (`user`, `session`, `account`, `verification`)
 * соответствуют модели better-auth. Ключи свойств совпадают с именами полей
 * better-auth — адаптер Drizzle сопоставляет их автоматически.
 *
 * Доменные таблицы (заказы, доступы, прогресс, сертификаты) добавляются ниже.
 */

// ─────────────────────────────────────────────────────────────────────────
// better-auth
// ─────────────────────────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────────────────
// Домен: заказы, доступы, прогресс, сертификаты
//
// Каталог мастер-классов хранится статически в workshops-data.ts.
// В БД хранятся только привязки пользователя к курсам (по workshopSlug)
// и его прогресс. Сами уроки идентифицируются по lessonId из статических
// данных.
// ─────────────────────────────────────────────────────────────────────────

/** Статусы заказа/платежа. */
export const orderStatus = pgEnum("order_status", [
  "pending", // создан, ожидает оплаты
  "paid", // оплачен, доступ выдан
  "canceled", // отменён/истёк
  "refunded", // возврат
]);

/** Заказ на покупку мастер-класса. */
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  workshopSlug: text("workshop_slug").notNull(),
  // Сумма в копейках, чтобы избежать ошибок с плавающей точкой
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("RUB"),
  status: orderStatus("status").notNull().default("pending"),
  // Идентификатор платежа в YooKassa
  paymentId: text("payment_id"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  paidAt: timestamp("paid_at"),
});

/** Доступ пользователя к мастер-классу. */
export const courseAccess = pgTable(
  "course_access",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    workshopSlug: text("workshop_slug").notNull(),
    // Заказ, по которому выдан доступ (null — ручная выдача админом)
    orderId: text("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    grantedAt: timestamp("granted_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (t) => [
    unique("course_access_user_workshop_uq").on(t.userId, t.workshopSlug),
  ],
);

/** Прогресс просмотра конкретного урока. */
export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    workshopSlug: text("workshop_slug").notNull(),
    lessonId: text("lesson_id").notNull(),
    // Текущая позиция и длительность в секундах — для «продолжить с места»
    positionSeconds: integer("position_seconds").notNull().default(0),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    completed: boolean("completed").notNull().default(false),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (t) => [unique("lesson_progress_user_lesson_uq").on(t.userId, t.lessonId)],
);

/** Сертификат о прохождении мастер-класса. */
export const certificates = pgTable(
  "certificates",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    workshopSlug: text("workshop_slug").notNull(),
    // Человекочитаемый номер сертификата
    number: text("number").notNull().unique(),
    issuedAt: timestamp("issued_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (t) => [unique("certificates_user_workshop_uq").on(t.userId, t.workshopSlug)],
);
