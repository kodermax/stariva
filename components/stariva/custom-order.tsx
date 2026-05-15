"use client";

import { motion } from "motion/react";
import { TelegramIcon, PhoneIcon } from "./icons";

export function CustomOrder() {
  return (
    <section id="order" className="py-20 lg:py-32 bg-sand">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left: text */}
          <div className="lg:col-span-6">
            <div className="label-caps text-terracotta mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-terracotta" />
              Индивидуальный заказ
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-espresso leading-[1.05] tracking-tight text-balance mb-6">
              Создадим ваш <span className="italic">идеальный</span> светильник
            </h2>
            <p className="text-espresso/75 leading-[1.75] text-lg max-w-xl text-pretty mb-10">
              Расскажите о вашей задумке — мы предложим дизайн и рассчитаем
              стоимость. Ответим в течение часа в рабочее время.
            </p>

            <div className="mt-10 pt-8 border-t border-espresso/15 text-sm text-espresso/70 leading-relaxed">
              <span className="block mb-1 label-caps text-taupe">
                Рабочее время
              </span>
              Пн–Сб, с 10:00 до 20:00 по Москве. Воскресенье — выходной.
            </div>
          </div>

          {/* Right: contact block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 bg-parchment border border-espresso/10 p-8 lg:p-10 rounded-sm flex flex-col justify-center gap-5"
          >
            <p className="text-espresso/70 leading-[1.75] text-base">
              Напишите нам в Telegram или позвоните — обсудим детали и подберём
              решение под ваш интерьер.
            </p>

            <a
              href="https://t.me/Olga_Stariva"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-7 py-5 rounded-full bg-terracotta text-parchment hover:bg-espresso transition-colors duration-300"
            >
              <TelegramIcon className="w-5 h-5 shrink-0" />
              <span className="label-caps-md">Написать в Telegram</span>
            </a>

            <a
              href="tel:+79778722546"
              className="group flex items-center gap-4 px-7 py-5 rounded-full border border-espresso/20 text-espresso hover:border-terracotta hover:text-terracotta transition-colors duration-300"
            >
              <PhoneIcon className="w-5 h-5 shrink-0" />
              <span className="font-serif text-xl">+7 977 872 25 46</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
