import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { db, schema } from "@/lib/db";
import { env } from "@/lib/env";
import {
  sendChangeEmailVerificationEmail,
  sendMagicLinkEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "./email";

/**
 * Серверный экземпляр better-auth.
 *
 * - Хранилище: PostgreSQL через Drizzle-адаптер.
 * - Email + пароль с обязательным подтверждением email.
 * - Вход по магической ссылке (passwordless).
 * - nextCookies() должен идти последним плагином — он включает установку
 *   cookies из серверных экшенов Next.js.
 */
export const auth = betterAuth({
  appName: "Stariva",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url);
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        await sendChangeEmailVerificationEmail(newEmail, url);
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 дней
    updateAge: 60 * 60 * 24, // обновлять сессию раз в сутки
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail(email, url);
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
