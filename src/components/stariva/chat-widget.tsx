"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "motion/react";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { CHAT_GREETING, CHAT_SUGGESTIONS } from "@/lib/chat/knowledge";
import { cn } from "@/lib/utils";

// ─── Иконки (в стиле проекта — тонкие линии 1.3) ────────────────────────────

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 5.5C4 4.7 4.7 4 5.5 4h13c.8 0 1.5.7 1.5 1.5v9c0 .8-.7 1.5-1.5 1.5H9l-4 3.5V15H5.5C4.7 15 4 14.3 4 13.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.5h8M8 11h5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 2l12 12M14 2L2 14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M21.5 4.5 2.5 11.5l5.8 2.2 2.4 6.3 3.4-3.4 4.8 3.5 2.6-15.6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="m8.3 13.7 9-6.7-6.6 8.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="7"
        y="7"
        width="10"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

// ─── Вспомогательное ────────────────────────────────────────────────────────

interface ChatPart {
  type: string;
  text?: string;
}

function textOf(message: { parts: ChatPart[] }): string {
  return message.parts
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("");
}

function TypingDots() {
  return (
    <span
      className="inline-flex items-center gap-1"
      role="status"
      aria-label="Печатает"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block w-1.5 h-1.5 rounded-full bg-espresso/40"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.15,
          }}
        />
      ))}
    </span>
  );
}

// ─── Виджет ───────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
  });

  const isBusy = status === "submitted" || status === "streaming";
  const hasConversation = messages.length > 0;

  // Автопрокрутка к последнему сообщению
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages and status changes
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status, open]);

  // Фокус на поле ввода при открытии
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => textareaRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Автоувеличение высоты textarea
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute height on input change
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input]);

  function submit(text: string) {
    const value = text.trim();
    if (!value || isBusy) return;
    sendMessage({ text: value });
    setInput("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  }

  // Показываем индикатор печати, пока ассистент ещё не начал отвечать
  const lastMessage = messages[messages.length - 1];
  const showTyping =
    status === "submitted" ||
    (status === "streaming" &&
      lastMessage?.role === "assistant" &&
      textOf(lastMessage as { parts: ChatPart[] }).length === 0);

  return (
    <>
      {/* ── Кнопка запуска ── */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрыть чат" : "Открыть чат с консультантом"}
        aria-expanded={open}
        initial={false}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "fixed bottom-5 right-5 lg:bottom-7 lg:right-7 z-60",
          "flex items-center justify-center w-14 h-14 rounded-full",
          "bg-espresso text-parchment shadow-[0_12px_40px_rgba(22,21,19,0.28)]",
          "transition-colors duration-300 hover:bg-terracotta",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <CloseIcon className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <ChatIcon className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* индикатор «онлайн» */}
        {!open && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border-2 border-espresso" />
          </span>
        )}
      </motion.button>

      {/* ── Панель чата ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Чат с консультантом Stariva"
            className={cn(
              "fixed z-60 flex flex-col overflow-hidden bg-parchment",
              "shadow-[0_24px_70px_rgba(22,21,19,0.22)] border border-espresso/10",
              "inset-x-3 bottom-24 rounded-2xl",
              "sm:inset-x-auto sm:right-7 sm:bottom-24 sm:w-[400px]",
              "h-[min(620px,calc(100dvh-9rem))]",
            )}
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 px-5 py-4 bg-espresso text-parchment">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-parchment/12 shrink-0">
                <span className="font-serif text-lg leading-none">С</span>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-espresso" />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-[17px] leading-tight">Ника</p>
                <p className="text-parchment/65 text-[11px] leading-tight">
                  Цифровой помощник мастерской · онлайн
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть чат"
                className="ml-auto flex items-center justify-center w-8 h-8 rounded-full text-parchment/70 hover:text-parchment hover:bg-parchment/10 transition-colors"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth"
            >
              {/* Приветствие */}
              <div className="flex">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-sand px-4 py-3 text-espresso/90 text-[14px] leading-relaxed">
                  {CHAT_GREETING}
                </div>
              </div>

              {/* Сообщения диалога */}
              {messages.map((message) => {
                const text = textOf(message as { parts: ChatPart[] });
                if (!text) return null;
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={cn("flex", isUser ? "justify-end" : "")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap wrap-break-word",
                        isUser
                          ? "rounded-2xl rounded-br-sm bg-espresso text-parchment"
                          : "rounded-2xl rounded-tl-sm bg-sand text-espresso/90",
                      )}
                    >
                      {text}
                    </div>
                  </div>
                );
              })}

              {/* Индикатор печати */}
              {showTyping && (
                <div className="flex">
                  <div className="rounded-2xl rounded-tl-sm bg-sand px-4 py-3.5">
                    <TypingDots />
                  </div>
                </div>
              )}

              {/* Ошибка */}
              {error && (
                <div className="flex">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-destructive/10 px-4 py-3 text-destructive text-[13px] leading-relaxed">
                    Не удалось получить ответ. Попробуйте ещё раз или напишите
                    нам в Telegram @Olga_Stariva.
                  </div>
                </div>
              )}

              {/* Быстрые подсказки (в начале) */}
              {!hasConversation && (
                <div className="pt-1 flex flex-wrap gap-2">
                  {CHAT_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="rounded-full border border-espresso/15 bg-parchment px-3.5 py-2 text-[12.5px] text-espresso/75 hover:border-espresso/40 hover:text-espresso transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-espresso/10 bg-parchment px-3 py-3"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-espresso/15 bg-white px-3 py-2 focus-within:border-espresso/40 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Спросите о макраме, заказе или мастер-классах…"
                  className="flex-1 resize-none bg-transparent text-[14px] text-espresso placeholder:text-taupe leading-relaxed outline-none max-h-[120px] py-1"
                />
                {isBusy ? (
                  <button
                    type="button"
                    onClick={() => stop()}
                    aria-label="Остановить"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-espresso/10 text-espresso hover:bg-espresso/20 transition-colors shrink-0"
                  >
                    <StopIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Отправить"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-espresso text-parchment hover:bg-terracotta transition-colors shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <SendIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-taupe text-[10.5px] text-center mt-2 leading-tight">
                Консультирую только по изделиям и услугам Stariva
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
