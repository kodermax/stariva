"use client"

import { motion } from "motion/react"
import { TelegramIcon } from "./icons"

const reviews = [
  {
    name: "Анна",
    city: "Санкт-Петербург",
    product: "Абажур «Полынь»",
    image: "/images/review-1.jpg",
    quote:
      "Получила абажур и заплакала — настолько он живой. Свет рассыпается по стенам узором, и спальня превратилась в волшебное место. Спасибо мастеру за душу, вложенную в работу.",
  },
  {
    name: "Мария",
    city: "Москва",
    product: "Панно «Лён»",
    image: "/images/review-2.jpg",
    quote:
      "Долго искала что-то с характером, и Stariva стали находкой. Заказывала индивидуальный размер — обсуждали детали в Telegram, всё прислали аккуратно упакованным. Уют появился сразу.",
  },
  {
    name: "Екатерина",
    city: "Казань",
    product: "Абажур «Берёза»",
    image: "/images/review-3.jpg",
    quote:
      "Уже второй заказ у девочек. Первый был на свадебный подарок подруге — она до сих пор пишет «лучший подарок в жизни». Этот взяла на свою кухню. Тепло, по-домашнему, по-настоящему.",
  },
]

function Star({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2Z" />
    </svg>
  )
}

export function Reviews() {
  return (
    <section id="reviews" className="py-20 lg:py-32 bg-sand">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 lg:mb-20">
          <div>
            <div className="label-caps text-terracotta mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-terracotta" />
              Отзывы
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-espresso leading-[1.05] tracking-tight text-balance max-w-3xl">
              Что говорят <span className="italic">наши покупатели</span>
            </h2>
          </div>
          <a
            href="https://t.me/stariva_otzyvy"
            className="inline-flex items-center gap-2 label-caps-md text-espresso underline underline-offset-[6px] decoration-espresso/25 hover:decoration-terracotta hover:text-terracotta transition-colors"
          >
            <TelegramIcon className="w-4 h-4" />
            Все отзывы — в нашем Telegram-канале
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((r, i) => (
            <motion.article
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`bg-parchment border border-linen/60 rounded-sm p-5 flex flex-col ${
                i === 1 ? "md:mt-10" : ""
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-5">
                <img
                  src={r.image || "/placeholder.svg"}
                  alt={`Отзыв — ${r.name}, ${r.city}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-1 text-terracotta mb-3">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} />
                ))}
              </div>

              <p className="font-serif italic text-lg lg:text-xl text-espresso leading-[1.45] mb-5 text-pretty">
                «{r.quote}»
              </p>

              <div className="mt-auto pt-4 border-t border-espresso/10 flex items-center justify-between">
                <div>
                  <div className="font-sans text-sm text-espresso font-medium">
                    {r.name}, {r.city}
                  </div>
                  <div className="label-caps text-taupe mt-1">{r.product}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
