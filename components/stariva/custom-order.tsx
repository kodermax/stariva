"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "motion/react"
import { ArrowRight } from "./icons"

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^7/, "").slice(0, 10)
  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ]
  let out = "+7"
  if (parts[0]) out += ` (${parts[0]}`
  if (parts[0]?.length === 3) out += ")"
  if (parts[1]) out += ` ${parts[1]}`
  if (parts[2]) out += `-${parts[2]}`
  if (parts[3]) out += `-${parts[3]}`
  return out
}

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  textarea = false,
}: {
  label: string
  id: string
  type?: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
}) {
  const filled = value.length > 0
  const baseClass =
    "peer w-full bg-transparent border-b border-espresso/25 focus:border-terracotta outline-none pt-7 pb-2 text-espresso placeholder-transparent transition-colors"

  return (
    <div className="relative">
      {textarea ? (
        <textarea
          id={id}
          rows={3}
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      )}
      <label
        htmlFor={id}
        className={`absolute left-0 transition-all duration-200 pointer-events-none label-caps text-taupe ${
          filled ? "top-1 text-[10px] text-terracotta" : "top-7 text-xs"
        } peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-terracotta`}
      >
        {label}
      </label>
    </div>
  )
}

export function CustomOrder() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [desc, setDesc] = useState("")
  const [sent, setSent] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
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
              Расскажите о вашей задумке — мы предложим дизайн и рассчитаем стоимость. Ответим в течение часа в рабочее время.
            </p>

            <div className="mt-10 pt-8 border-t border-espresso/15 text-sm text-espresso/70 leading-relaxed">
              <span className="block mb-1 label-caps text-taupe">Рабочее время</span>
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
                  Мы получили вашу заявку и свяжемся с вами в течение часа. Чай уже завариваем.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-2">
                  <Field label="Имя" id="name" value={name} onChange={setName} />
                </div>
                <div className="space-y-2 mb-2 mt-2">
                  <Field
                    label="Телефон"
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(v) => setPhone(maskPhone(v))}
                  />
                </div>
                <div className="space-y-2 mb-8 mt-2">
                  <Field
                    label="Опишите ваш заказ — размер, оттенок, идея"
                    id="desc"
                    value={desc}
                    onChange={setDesc}
                    textarea
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-terracotta text-parchment label-caps-md hover:bg-espresso transition-colors"
                >
                  Отправить заявку
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <p className="mt-5 text-[11px] leading-relaxed text-taupe">
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <a href="#" className="underline underline-offset-2 hover:text-terracotta">
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
  )
}
