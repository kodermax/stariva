"use client"

import { motion } from "motion/react"
import { ArrowRight } from "./icons"

function formatPrice(value: number) {
  return value.toLocaleString("ru-RU").replace(/,/g, " ")
}

type Product = {
  name: string
  category: string
  price: number
  image: string
  bestseller?: boolean
}

const stacked: Product[] = [
  {
    name: "Абажур «Полынь»",
    category: "Подвесной светильник",
    price: 13900,
    image: "/images/product-1.jpg",
    bestseller: true,
  },
  {
    name: "Панно «Лён»",
    category: "Настенное украшение",
    price: 8900,
    image: "/images/product-2.jpg",
  },
]

const featured: Product = {
  name: "Абажур «Берёза»",
  category: "Большая модель, ⌀60 см",
  price: 18500,
  image: "/images/product-lifestyle.jpg",
  bestseller: true,
}

function ProductCard({ p, large = false }: { p: Product; large?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-sand film-grain ${
          large ? "aspect-[4/5]" : "aspect-[4/5]"
        }`}
      >
        <img
          src={p.image || "/placeholder.svg"}
          alt={p.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {p.bestseller && (
          <span className="absolute top-4 left-4 label-caps px-3 py-1.5 rounded-full bg-terracotta text-parchment">
            Хит продаж
          </span>
        )}
        <span className="absolute bottom-4 right-4 label-caps text-parchment/95 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-difference">
          Быстрый просмотр →
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <div className="label-caps text-taupe mb-2">{p.category}</div>
          <h3 className="font-serif text-2xl lg:text-[1.6rem] text-espresso leading-tight">
            {p.name}
          </h3>
        </div>
        <div className="text-right shrink-0">
          <div className="label-caps text-taupe mb-1">от</div>
          <div className="font-sans text-lg text-espresso tabular-nums">
            {formatPrice(p.price)} ₽
          </div>
        </div>
      </div>

      <a
        href="#"
        className="mt-4 inline-flex items-center gap-2 label-caps-md text-espresso underline underline-offset-[6px] decoration-espresso/25 hover:decoration-terracotta hover:text-terracotta transition-colors"
      >
        Подробнее
        <ArrowRight className="w-4 h-4" />
      </a>
    </motion.article>
  )
}

export function FeaturedCollection() {
  return (
    <section id="collection" className="py-20 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 lg:mb-20">
          <div>
            <div className="label-caps text-terracotta mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-terracotta" />
              Избранные работы
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-espresso leading-[1.05] tracking-tight text-balance max-w-2xl">
              Каждое изделие — <span className="italic">единственное</span> в своём роде
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 label-caps-md text-espresso underline underline-offset-[6px] decoration-espresso/25 hover:decoration-terracotta hover:text-terracotta transition-colors"
          >
            Вся коллекция
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 flex flex-col gap-12 lg:pt-12">
            {stacked.map((p) => (
              <ProductCard key={p.name} p={p} />
            ))}
          </div>
          <div className="lg:col-span-7">
            <ProductCard p={featured} large />
          </div>
        </div>
      </div>
    </section>
  )
}
