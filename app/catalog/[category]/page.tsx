"use client"

import { useState } from "react"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { use } from "react"
import {
  categories,
  getProductsByCategory,
  getProductsBySubcategory,
  getCategoryBySlug,
  formatPrice,
} from "@/lib/products"
import type { Product, ProductSubcategory } from "@/lib/ozon-types"
import { Header } from "@/components/stariva/header"
import { Footer } from "@/components/stariva/footer"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = use(params)
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  const allProducts = getProductsByCategory(categorySlug)
  const [activeSubcategory, setActiveSubcategory] = useState<ProductSubcategory | "all">("all")
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default")

  const filteredProducts =
    activeSubcategory === "all"
      ? allProducts
      : getProductsBySubcategory(activeSubcategory)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price
    if (sortBy === "price-desc") return b.price - a.price
    return 0
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-parchment">
        {/* Hero */}
        <section className="relative pt-32 pb-16">
          <div className="absolute inset-0 h-80">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-espresso/60 via-espresso/40 to-parchment" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 pt-8">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link href="/catalog" className="hover:text-white transition-colors">
                Каталог
              </Link>
              <span>/</span>
              <span className="text-white">{category.name}</span>
            </nav>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl md:text-5xl text-white mb-4"
            >
              {category.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white/80 max-w-xl"
            >
              {category.description}
            </motion.p>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-20 z-30 bg-parchment/95 backdrop-blur-sm border-b border-sand py-4 px-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveSubcategory("all")}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeSubcategory === "all"
                    ? "bg-espresso text-white"
                    : "bg-cream text-espresso hover:bg-sand"
                }`}
              >
                Все ({allProducts.length})
              </button>
              {category.subcategories.map((sub) => {
                const count = getProductsBySubcategory(sub.slug).length
                return (
                  <button
                    key={sub.slug}
                    onClick={() => setActiveSubcategory(sub.slug)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      activeSubcategory === sub.slug
                        ? "bg-espresso text-white"
                        : "bg-cream text-espresso hover:bg-sand"
                    }`}
                  >
                    {sub.name} ({count})
                  </button>
                )
              })}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 rounded-full text-sm bg-cream text-espresso border-0 cursor-pointer"
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Сначала дешёвые</option>
              <option value="price-desc">Сначала дорогие</option>
            </select>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-taupe text-lg">
                  В этой категории пока нет товаров
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Other Categories */}
        <section className="pb-24 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-2xl text-espresso mb-8">
              Другие категории
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {categories
                .filter((c) => c.slug !== categorySlug)
                .map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/catalog/${cat.slug}`}
                    className="group flex items-center gap-6 bg-cream rounded-xl p-4 hover:bg-sand transition-colors"
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-espresso group-hover:text-terracotta transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-taupe text-sm line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 * index }}
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {product.oldPrice && (
            <span className="absolute top-4 left-4 bg-terracotta text-white label-caps px-3 py-1 rounded-full">
              Скидка
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-espresso/40 flex items-center justify-center">
              <span className="bg-white text-espresso label-caps px-4 py-2 rounded-full">
                Нет в наличии
              </span>
            </div>
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
  )
}
