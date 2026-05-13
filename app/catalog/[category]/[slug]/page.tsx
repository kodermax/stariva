"use client"

import { useState } from "react"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { use } from "react"
import {
  getProductBySlug,
  getCategoryBySlug,
  getProductsByCategory,
  formatPrice,
} from "@/lib/products"
import { Header } from "@/components/stariva/header"
import { Footer } from "@/components/stariva/footer"
import { OzonIcon, TelegramIcon, WhatsappIcon, CottonIcon, HandmadeIcon, ShippingIcon } from "@/components/stariva/icons"

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { category: categorySlug, slug } = use(params)
  const product = getProductBySlug(slug)
  const category = getCategoryBySlug(categorySlug)

  if (!product || !category || product.category !== categorySlug) {
    notFound()
  }

  const relatedProducts = getProductsByCategory(categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  const [activeImage, setActiveImage] = useState(0)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-parchment">
        {/* Breadcrumb */}
        <section className="pt-28 pb-4 px-4">
          <div className="max-w-6xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-taupe">
              <Link href="/catalog" className="hover:text-espresso transition-colors">
                Каталог
              </Link>
              <span>/</span>
              <Link
                href={`/catalog/${categorySlug}`}
                className="hover:text-espresso transition-colors"
              >
                {category.name}
              </Link>
              <span>/</span>
              <span className="text-espresso">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Section */}
        <section className="pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream mb-4">
                  <Image
                    src={product.images[activeImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {product.oldPrice && (
                    <span className="absolute top-6 left-6 bg-terracotta text-white label-caps px-4 py-2 rounded-full">
                      Скидка {Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </span>
                  )}
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-3">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all ${
                          activeImage === i
                            ? "ring-2 ring-terracotta"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} - фото ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col"
              >
                <span className="label-caps text-terracotta mb-2">
                  {category.subcategories.find((s) => s.slug === product.subcategory)?.name}
                </span>

                <h1 className="font-serif text-3xl md:text-4xl text-espresso mb-4">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-serif text-3xl text-espresso">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-taupe line-through text-xl">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </div>

                <p className="text-taupe leading-relaxed mb-8">
                  {product.shortDescription}
                </p>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center text-center p-4 bg-cream rounded-xl">
                    <CottonIcon className="w-8 h-8 text-espresso mb-2" />
                    <span className="text-xs text-taupe">{product.material}</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-cream rounded-xl">
                    <HandmadeIcon className="w-8 h-8 text-espresso mb-2" />
                    <span className="text-xs text-taupe">Ручная работа</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-cream rounded-xl">
                    <ShippingIcon className="w-8 h-8 text-espresso mb-2" />
                    <span className="text-xs text-taupe">7-21 дней</span>
                  </div>
                </div>

                {/* Dimensions & Care */}
                {(product.dimensions || product.careInstructions) && (
                  <div className="space-y-3 mb-8 p-4 bg-cream rounded-xl">
                    {product.dimensions && (
                      <div className="flex justify-between text-sm">
                        <span className="text-taupe">Размеры</span>
                        <span className="text-espresso">{product.dimensions}</span>
                      </div>
                    )}
                    {product.careInstructions && (
                      <div className="flex justify-between text-sm">
                        <span className="text-taupe">Уход</span>
                        <span className="text-espresso">{product.careInstructions}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="space-y-3 mt-auto">
                  {product.ozonUrl && (
                    <a
                      href={product.ozonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full bg-[#005BFF] hover:bg-[#0047CC] text-white py-4 rounded-full transition-colors label-caps"
                    >
                      <OzonIcon className="w-5 h-5" />
                      Купить на Ozon
                    </a>
                  )}

                  <div className="flex gap-3">
                    <a
                      href={`https://t.me/stariva_shop?text=Здравствуйте! Интересует ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-espresso hover:bg-espresso/90 text-white py-4 rounded-full transition-colors label-caps"
                    >
                      <TelegramIcon className="w-5 h-5" />
                      Telegram
                    </a>
                    <a
                      href={`https://wa.me/79001234567?text=Здравствуйте! Интересует ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white py-4 rounded-full transition-colors label-caps"
                    >
                      <WhatsappIcon className="w-5 h-5" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <h2 className="font-serif text-2xl text-espresso mb-6">Описание</h2>
              <div className="prose prose-lg text-taupe">
                {product.description.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pb-24 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-8">
                <h2 className="font-serif text-2xl text-espresso">
                  Похожие товары
                </h2>
                <Link
                  href={`/catalog/${categorySlug}`}
                  className="label-caps text-terracotta hover:text-espresso transition-colors"
                >
                  Все товары →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * i }}
                  >
                    <Link
                      href={`/catalog/${p.category}/${p.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-cream">
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <h3 className="font-serif text-xl text-espresso mb-1 group-hover:text-terracotta transition-colors">
                        {p.name}
                      </h3>
                      <span className="font-medium text-espresso">
                        {formatPrice(p.price)}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
