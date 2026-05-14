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
    let result =
      activeSubcategory === "all"
        ? products
        : products.filter((p) => p.subcategory === activeSubcategory)

    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price)

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
      {/* ── Filters bar ── */}
      <section className="sticky top-[60px] lg:top-[68px] z-30 bg-parchment/96 backdrop-blur-sm border-b border-espresso/8">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12 py-4 flex items-center justify-between gap-4 flex-wrap">

          {/* Subcategory pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveSubcategory("all")}
              className={`px-4 py-2 rounded-full label-caps text-[11px] transition-all duration-200 ${
                activeSubcategory === "all"
                  ? "bg-espresso text-parchment"
                  : "bg-sand text-espresso hover:bg-espresso/10"
              }`}
            >
              Все ({products.length})
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => setActiveSubcategory(sub.slug)}
                className={`px-4 py-2 rounded-full label-caps text-[11px] transition-all duration-200 ${
                  activeSubcategory === sub.slug
                    ? "bg-espresso text-parchment"
                    : "bg-sand text-espresso hover:bg-espresso/10"
                }`}
              >
                {sub.name}
                {subcategoryCounts[sub.slug] > 0 && (
                  <span className="ml-1.5 opacity-50">({subcategoryCounts[sub.slug]})</span>
                )}
              </button>
            ))}
          </div>

          {/* Sort — custom-styled */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none pl-4 pr-9 py-2 rounded-full bg-sand text-espresso label-caps text-[11px] border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-espresso/20"
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
            <svg
              width="10" height="10" viewBox="0 0 10 10" fill="none"
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-espresso/40"
            >
              <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Products grid ── */}
      <section className="py-10 lg:py-14">
        <div className="max-w-[1440px] mx-auto px-5 lg:px-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-28">
              <p className="font-serif text-2xl text-espresso/40">В этой категории пока нет товаров</p>
              <p className="text-taupe text-sm mt-2">Попробуйте другой фильтр или загляните позже</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  categorySlug={categorySlug}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function ProductCard({
  product,
  index,
  categorySlug,
}: {
  product: Product
  index: number
  categorySlug: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.04 * Math.min(index, 8) }}
    >
      <Link href={`/catalog/${categorySlug}/${product.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-sand">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            unoptimized={product.images[0].startsWith("http")}
          />
          {/* Badges */}
          {product.oldPrice && (
            <span className="absolute top-3 left-3 bg-terracotta text-parchment label-caps px-2.5 py-1 rounded-full text-[10px]">
              −{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-parchment/50 flex items-end justify-center pb-5">
              <span className="bg-parchment/90 text-espresso label-caps px-4 py-2 rounded-full text-[11px]">
                Нет в наличии
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="font-serif text-[17px] text-espresso leading-snug group-hover:text-terracotta transition-colors line-clamp-2">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-taupe text-[12px] mt-1 line-clamp-1">{product.shortDescription}</p>
        )}
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-espresso font-medium text-[15px]">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-taupe/60 line-through text-[12px]">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
