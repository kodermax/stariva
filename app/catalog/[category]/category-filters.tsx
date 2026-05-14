"use client"

import { useState, useMemo } from "react"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import type { Product, ProductSubcategory, Category } from "@/lib/ozon-types"
import { formatPrice } from "@/lib/products"

interface CategoryFiltersProps {
  products: Product[]
  category: Category
  categorySlug: string
}

export default function CategoryFilters({ products, category, categorySlug }: CategoryFiltersProps) {
  const [activeSubcategory, setActiveSubcategory] = useState<ProductSubcategory | "all">("all")
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default")

  const filteredProducts = useMemo(() => {
    let result = activeSubcategory === "all"
      ? products
      : products.filter((p) => p.subcategory === activeSubcategory)

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, activeSubcategory, sortBy])

  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const sub of category.subcategories) {
      counts[sub.slug] = products.filter((p) => p.subcategory === sub.slug).length
    }
    return counts
  }, [products, category.subcategories])

  return (
    <>
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
              Все ({products.length})
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => setActiveSubcategory(sub.slug)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeSubcategory === sub.slug
                    ? "bg-espresso text-white"
                    : "bg-cream text-espresso hover:bg-sand"
                }`}
              >
                {sub.name} ({subcategoryCounts[sub.slug] || 0})
              </button>
            ))}
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
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-taupe text-lg">
                В этой категории пока нет товаров
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} categorySlug={categorySlug} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function ProductCard({ product, index, categorySlug }: { product: Product; index: number; categorySlug: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 * Math.min(index, 6) }}
    >
      <Link
        href={`/catalog/${categorySlug}/${product.slug}`}
        className="group block"
      >
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-cream">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={product.images[0].startsWith("http")}
          />
          {product.oldPrice && (
            <span className="absolute top-4 left-4 bg-terracotta text-white label-caps px-3 py-1 rounded-full">
              Скидка
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-parchment/60 flex items-center justify-center">
              <span className="bg-parchment/90 text-espresso label-caps px-4 py-2 rounded-full">
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
