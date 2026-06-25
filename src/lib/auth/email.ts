import { env } from "@/lib/env";

const BRAND = "Stariva";

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

/**
 * Низкоуровневая отправка письма через Resend HTTP API.
 *
 * Если Resend не настроен (нет ключа или отправителя), в dev-режиме ссылка
 * выводится в консоль, чтобы можно было продолжить локальную разработку.
 * В production отсутствие конфигурации считается ошибкой.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: SendArgs): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  const from = env.ORDER_EMAIL_FROM;

  if (!apiKey || !from) {
    if (env.NODE_ENV === "production") {
      throw new Error("email_not_configured");
    }
    console.warn(
      `[auth/email] Resend не настроен. Письмо для ${to} не отправлено.\nТема: ${subject}\n${html}`,
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`resend_failed_${res.status}: ${detail}`);
  }
}

/** Базовый HTML-шаблон письма в фирменном стиле. */
function layout(opts: {
  heading: string;
  intro: string;
  buttonLabel: string;
  buttonUrl: string;
  footnote: string;
}): string {
  return `
  <div style="margin:0;padding:32px 0;background:#f7f3ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2c241b;">
    <div style="max-width:480px;margin:0 auto;background:#fffdf9;border:1px solid #e8e0d4;border-radius:16px;overflow:hidden;">
      <div style="padding:28px 32px;border-bottom:1px solid #efe8dc;">
        <span style="font-size:20px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;color:#2c241b;">${BRAND}</span>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#2c241b;">${opts.heading}</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#6f6253;">${opts.intro}</p>
        <a href="${opts.buttonUrl}" style="display:inline-block;background:#b85c38;color:#fffdf9;text-decoration:none;padding:13px 28px;border-radius:999px;font-size:14px;font-weight:600;">${opts.buttonLabel}</a>
        <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#9c8e7d;">${opts.footnote}</p>
        <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#9c8e7d;word-break:break-all;">Если кнопка не работает, скопируйте ссылку:<br><a href="${opts.buttonUrl}" style="color:#b85c38;">${opts.buttonUrl}</a></p>
      </div>
    </div>
  </div>`;
}

/** Письмо подтверждения email после регистрации. */
export function sendVerificationEmail(to: string, url: string): Promise<void> {
  return sendEmail({
    to,
    subject: `Подтвердите email — ${BRAND}`,
    html: layout({
      heading: "Подтвердите ваш email",
      intro:
        "Спасибо за регистрацию! Подтвердите адрес электронной почты, чтобы получить доступ к личному кабинету и купленным мастер-классам.",
      buttonLabel: "Подтвердить email",
      buttonUrl: url,
      footnote:
        "Если вы не регистрировались на Stariva, просто проигнорируйте это письмо.",
    }),
  });
}

/** Письмо со ссылкой для входа без пароля (magic link). */
export function sendMagicLinkEmail(to: string, url: string): Promise<void> {
  return sendEmail({
    to,
    subject: `Ссылка для входа — ${BRAND}`,
    html: layout({
      heading: "Вход в личный кабинет",
      intro:
        "Нажмите кнопку ниже, чтобы войти в кабинет Stariva. Ссылка действует ограниченное время и работает один раз.",
      buttonLabel: "Войти",
      buttonUrl: url,
      footnote:
        "Если вы не запрашивали вход, просто проигнорируйте это письмо — ваш аккаунт в безопасности.",
    }),
  });
}

/** Письмо для сброса пароля. */
export function sendResetPasswordEmail(to: string, url: string): Promise<void> {
  return sendEmail({
    to,
    subject: `Сброс пароля — ${BRAND}`,
    html: layout({
      heading: "Сброс пароля",
      intro:
        "Вы запросили смену пароля. Нажмите кнопку, чтобы задать новый пароль для входа в кабинет.",
      buttonLabel: "Сбросить пароль",
      buttonUrl: url,
      footnote:
        "Если вы не запрашивали сброс пароля, проигнорируйте это письмо.",
    }),
  });
}

/** Письмо подтверждения смены email (отправляется на новый адрес). */
export function sendChangeEmailVerificationEmail(
  to: string,
  url: string,
): Promise<void> {
  return sendEmail({
    to,
    subject: `Подтвердите смену email — ${BRAND}`,
    html: layout({
      heading: "Подтвердите новый email",
      intro:
        "Вы запросили смену адреса электронной почты в аккаунте Stariva. Подтвердите новый адрес, нажав на кнопку.",
      buttonLabel: "Подтвердить email",
      buttonUrl: url,
      footnote:
        "Если вы не запрашивали смену email, проигнорируйте это письмо.",
    }),
  });
}
