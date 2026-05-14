"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import Image from "next/image"

const directions = [
  {
    id: "clothes",
    index: "01",
    label: "Одежда",
    sublabel: "Платья · Топы · Накидки",
    href: "/catalog/clothes",
    image: "/images/home/hero-clothes.jpg",
    accent: "#b85c38",
    tag: "Летняя коллекция 2026",
    headline: ["Одежда,", "сотканная", "вручную"],
    desc: "Платья и топы из натурального хлопка — каждое изделие уникально и создаётся под вас.",
  },
  {
    id: "interior",
    index: "02",
    label: "Интерьер",
    sublabel: "Абажуры · Вигвамы · Мобили",
    href: "/catalog/interior",
    image: "/images/home/hero-interior.jpg",
    accent: "#7a6e5f",
    tag: "Для вашего дома",
    headline: ["Свет и тепло", "в каждом", "углу"],
    desc: "Абажуры ручного плетения — превращают свет в тёплую атмосферу, а пространство — в уют.",
  },
  {
    id: "decor",
    index: "03",
    label: "Декор",
    sublabel: "Панно · Плейсменты · Кашпо",
    href: "/catalog/decor",
    image: "/images/home/hero-decor.jpg",
    accent: "#8c7b6b",
    tag: "Детали, которые важны",
    headline: ["Декор, который", "расскажет", "вашу историю"],
    desc: "Панно, плейсменты и кашпо из хлопка — детали, которые завершают образ любого интерьера.",
  },
]

export function Hero() {
  const [active, setActive] = useState(0)
  const current = directions[active]

  return (
    <section className="relative h-[100dvh] min-h-[600px] max-h-[960px] overflow-hidden bg-espresso pt-[60px] lg:pt-[68px]">
      {/* Background image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={current.image}
            alt={current.label}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-espresso/55" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between max-w-[1440px] mx-auto px-5 lg:px-12 pb-8 lg:pb-12">

        {/* Tag */}
        <div className="pt-8 lg:pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.tag}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2"
            >
              <span className="w-5 h-px bg-white/50" />
              <span className="label-caps text-white/60">{current.tag}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Headline + CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.h1
                key={current.id + "-h"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-white text-[clamp(2.8rem,8vw,6.5rem)] leading-[1.0] tracking-tight text-balance"
              >
                {current.headline.map((line, i) => (
                  <span key={i} className="block">
                    {i === 2 ? <em className="not-italic" style={{ color: current.accent }}>{line}</em> : line}
                  </span>
                ))}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={current.id + "-p"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 text-white/70 text-base lg:text-lg max-w-md leading-relaxed"
              >
                {current.desc}
              </motion.p>
            </AnimatePresence>

            <motion.div className="mt-8 flex items-center gap-4">
              <Link
                href={current.href}
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/40 text-white label-caps-md hover:bg-white hover:text-espresso transition-all duration-300"
              >
                Смотреть коллекцию
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-1">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Direction switcher */}
          <div className="flex lg:flex-col gap-2 lg:gap-3 pb-1">
            {directions.map((dir, i) => (
              <button
                key={dir.id}
                onClick={() => setActive(i)}
                className={`group flex items-center gap-3 text-left transition-all duration-200 ${
                  i === active ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-px h-6 transition-all duration-300 ${i === active ? "h-8" : ""}`}
                  style={{ backgroundColor: i === active ? dir.accent : "rgba(255,255,255,0.4)" }}
                />
                <div>
                  <div className="label-caps text-white text-[10px] leading-none mb-0.5">{dir.index}</div>
                  <div className="text-white font-serif text-[15px] leading-tight">{dir.label}</div>
                  {i === active && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-white/50 text-[11px] mt-0.5"
                    >
                      {dir.sublabel}
                    </motion.div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-40">
        <span className="label-caps text-white text-[9px]">Скролл</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 4l5 5 5-5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
