"use client"

import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { categories, getFeaturedProducts, formatPrice } from "@/lib/products"
import { Header } from "@/components/stariva/header"
import { Footer } from "@/components/stariva/footer"

export default function CatalogPage() {
  const featuredProducts = getFeaturedProducts()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-parchment">
        {/* Hero */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="label-caps text-terracotta mb-4 block"
            >
              Каталог
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-espresso mb-6 text-balance"
            >
              Изделия ручной работы
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-taupe text-lg max-w-2xl mx-auto"
            >
              Каждое изделие создаётся вручную из натурального хлопка. 
              Срок изготовления — от 7 до 21 дня в зависимости от сложности.
            </motion.p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {categories.map((category, i) => (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                >
                  <Link
                    href={`/catalog/${category.slug}`}
                    className="group block relative aspect-[4/5] rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <h2 className="font-serif text-2xl md:text-3xl mb-2">
                        {category.name}
                      </h2>
                      <p className="text-white/80 text-sm line-clamp-2">
                        {category.description}
                      </p>
                      <span className="mt-4 label-caps text-white/60 group-hover:text-white transition-colors">
                        Смотреть →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="pb-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="label-caps text-terracotta mb-2 block">
                  Популярное
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-espresso">
                  Хиты продаж
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                >
                  <Link
                    href={`/catalog/${product.category}/${product.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-cream">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {product.oldPrice && (
                        <span className="absolute top-4 left-4 bg-terracotta text-white label-caps px-3 py-1 rounded-full">
                          Скидка
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-espresso mb-1 group-hover:text-terracotta transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-taupe text-sm mb-2 line-clamp-1">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-espresso">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-taupe line-through text-sm">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="pb-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden bg-espresso text-white p-8 md:p-12">
              <div className="relative z-10 max-w-xl">
                <span className="label-caps text-cream/60 mb-4 block">
                  Индивидуальный заказ
                </span>
                <h2 className="font-serif text-3xl md:text-4xl mb-4">
                  Не нашли то, что искали?
                </h2>
                <p className="text-cream/80 mb-6">
                  Мы создаём изделия по индивидуальным размерам и дизайну. 
                  Расскажите о вашей идее, и мы воплотим её в жизнь.
                </p>
                <Link
                  href="/#order"
                  className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 rounded-full transition-colors label-caps"
                >
                  Оставить заявку
                </Link>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
