"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { LeafIcon, PercentIcon, TruckIcon, TelegramIcon, ArrowRight } from "./icons"

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <section ref={ref} id="top" className="relative pt-20 lg:pt-24 pb-16 lg:pb-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Image — 60% on desktop */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative aspect-[4/5] lg:aspect-[5/6] overflow-hidden rounded-sm">
              <motion.img
                src="/images/hero-interior.jpg"
                alt="Уютный интерьер с абажуром макраме ручной работы"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ y: imageY, scale: imageScale }}
              />
              {/* corner mark */}
              <div className="absolute top-4 left-4 label-caps text-parchment/90 mix-blend-difference">
                № 001 — лето 2026
              </div>
              <div className="absolute bottom-4 right-4 label-caps text-parchment/90 mix-blend-difference">
                Москва
              </div>
            </div>
          </div>

          {/* Typography — 40% on desktop */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative lg:-ml-16 xl:-ml-24 lg:pb-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 lg:bg-parchment lg:pl-10 lg:pt-10 lg:pr-2"
            >
              <div className="label-caps text-terracotta mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-terracotta" />
                Ручное плетение с 2018
              </div>

              <h1 className="font-serif text-espresso text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.02] tracking-tight text-balance">
                Свет,
                <br />
                сплетённый{" "}
                <span className="italic font-normal text-terracotta">вручную</span>
              </h1>

              <p className="mt-8 text-base md:text-lg text-espresso/75 leading-relaxed max-w-md text-pretty">
                Эксклюзивные абажуры из макраме ручной работы. Создаём уют в вашем доме с 2018 года —
                из натурального хлопка, льна и тёплого света.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#collection"
                  className="group inline-flex items-center gap-3 px-7 py-4 rounded-full border border-espresso text-espresso label-caps-md hover:bg-terracotta hover:border-terracotta hover:text-parchment transition-all"
                >
                  Смотреть коллекцию
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="https://t.me/stariva"
                  className="inline-flex items-center gap-2 label-caps-md text-espresso underline underline-offset-[6px] decoration-espresso/30 hover:decoration-terracotta hover:text-terracotta transition-colors"
                >
                  <TelegramIcon className="w-4 h-4" />
                  Написать мастеру
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-10 pt-8 border-t border-espresso/10 grid grid-cols-3 gap-4">
                {[
                  { icon: TruckIcon, label: "Доставка по России" },
                  { icon: PercentIcon, label: "Рассрочка 0%" },
                  { icon: LeafIcon, label: "Натуральные материалы" },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col items-start gap-2">
                    <b.icon className="w-5 h-5 text-terracotta" />
                    <span className="text-[11px] uppercase tracking-[0.08em] text-taupe leading-snug">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
