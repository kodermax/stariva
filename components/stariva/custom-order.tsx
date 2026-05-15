"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "./icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^7/, "").slice(0, 10);
  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ];
  let out = "+7";
  if (parts[0]) out += ` (${parts[0]}`;
  if (parts[0]?.length === 3) out += ")";
  if (parts[1]) out += ` ${parts[1]}`;
  if (parts[2]) out += `-${parts[2]}`;
  if (parts[3]) out += `-${parts[3]}`;
  return out;
}

export function CustomOrder() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="order" className="py-20 lg:py-32 bg-sand">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
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

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 bg-parchment border border-espresso/10 p-8 lg:p-10 rounded-sm"
          >
            {sent ? (
              <div className="py-16 text-center">
                <div className="font-serif italic text-3xl text-terracotta mb-4">
                  Спасибо, {name || "друг"}.
                </div>
                <p className="text-espresso/75 leading-relaxed max-w-sm mx-auto">
                  Мы получили вашу заявку и свяжемся с вами в течение часа. Чай
                  уже завариваем.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <Label
                    htmlFor="name"
                    className="label-caps text-taupe mb-1.5 block"
                  >
                    Имя
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-espresso/25 focus-visible:border-terracotta text-espresso placeholder:text-taupe/50 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <Label
                    htmlFor="phone"
                    className="label-caps text-taupe mb-1.5 block"
                  >
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(maskPhone(e.target.value))}
                    className="bg-transparent border-espresso/25 focus-visible:border-terracotta text-espresso placeholder:text-taupe/50 rounded-md"
                  />
                </div>
                <div className="mb-8">
                  <Label
                    htmlFor="desc"
                    className="label-caps text-taupe mb-1.5 block"
                  >
                    Описание заказа
                  </Label>
                  <Textarea
                    id="desc"
                    placeholder="Опишите ваш заказ — размер, оттенок, идея"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
                    className="bg-transparent border-espresso/25 focus-visible:border-terracotta text-espresso placeholder:text-taupe/50 rounded-md resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="group w-full gap-3 px-7 py-4 h-auto rounded-full bg-terracotta text-parchment label-caps-md hover:bg-espresso transition-colors"
                >
                  Отправить заявку
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <p className="mt-5 text-[11px] leading-relaxed text-taupe">
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <a
                    href="#"
                    className="underline underline-offset-2 hover:text-terracotta"
                  >
                    политикой конфиденциальности
                  </a>{" "}
                  и обработкой персональных данных в соответствии с 152-ФЗ.
                </p>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
