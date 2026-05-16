"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { OzonIcon } from "@/components/stariva/icons";
import { ColorSwatches } from "@/components/stariva/color-indicator";
import { trackOzonClick } from "@/lib/analytics";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { parseMultipleColors } from "@/lib/colors";
import type { Category, Product } from "@/lib/ozon-types";
import { formatPrice } from "@/lib/products";

interface ProductDetailsProps {
  product: Product;
  category: Category;
  categorySlug: string;
  relatedProducts: Product[];
}

export function ProductDetails({
  product,
  category,
  categorySlug,
  relatedProducts,
}: ProductDetailsProps) {
  const [activeImage, setActiveImage] = useState(0);
  const productColors = parseMultipleColors(product.color);

  return (
    <main className="min-h-screen bg-parchment">
      {/* Breadcrumb */}
      <section className="pt-28 pb-4 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb>
            <BreadcrumbList className="text-sm text-taupe">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/catalog"
                    className="hover:text-espresso transition-colors"
                  >
                    Каталог
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/catalog/${categorySlug}`}
                    className="hover:text-espresso transition-colors"
                  >
                    {category.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-espresso">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-sand mb-4">
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={product.images[activeImage].startsWith("http")}
                />
                {product.oldPrice && (
                  <span className="absolute top-6 left-6 bg-terracotta text-white label-caps px-4 py-2 rounded-full">
                    Скидка{" "}
                    {Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-parchment/60 flex items-center justify-center">
                    <span className="bg-parchment/90 text-espresso label-caps px-6 py-3 rounded-full text-lg">
                      Нет в наличии
                    </span>
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <Button
                      // biome-ignore lint/suspicious/noArrayIndexKey: image thumbnails are positional, index is the correct key
                      key={i}
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 p-0 transition-all ${
                        activeImage === i
                          ? "ring-2 ring-terracotta"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - фото ${i + 1}`}
                        fill
                        className="object-contain"
                        sizes="80px"
                        unoptimized={img.startsWith("http")}
                      />
                    </Button>
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
                {
                  category.subcategories.find(
                    (s) => s.slug === product.subcategory,
                  )?.name
                }
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

              <p className="text-dark-grey leading-relaxed mb-8">
                {product.shortDescription}
              </p>

              {/* Features */}
              <div
                className={`grid gap-3 mb-8 ${[product.material, product.color, product.sizes?.length, product.careInstructions].filter(Boolean).length > 2 ? "grid-cols-2" : "grid-cols-2"}`}
              >
                {/* Цвет */}
                {product.color && productColors.length > 0 && (
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-sand rounded-xl border border-espresso/6 col-span-2">
                    <span className="label-caps text-[9px] text-taupe/60 mb-3">
                      Цвет
                    </span>
                    <div className="flex flex-col items-center gap-2">
                      <ColorSwatches colors={productColors} size="lg" />
                      <span className="label-caps text-[11px] text-espresso leading-snug mt-1">
                        {product.color}
                      </span>
                    </div>
                  </div>
                )}
                {/* Размеры */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-col items-center text-center p-4 bg-sand rounded-xl border border-espresso/6 col-span-2">
                    <span className="label-caps text-[9px] text-taupe/60 mb-2">
                      Размеры
                    </span>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {product.sizes.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-full bg-espresso/8 text-espresso label-caps text-[10px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Размеры и характеристики */}
              {product.dimensions && (
                <div className="space-y-3 mb-8 p-5 bg-sand rounded-xl border border-espresso/6">
                  <div className="flex justify-between text-sm">
                    <span className="text-taupe">Размеры</span>
                    <span className="text-espresso">{product.dimensions}</span>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3 mt-auto">
                {product.ozonUrl && (
                  <Button
                    asChild
                    className="flex items-center justify-center gap-3 w-full bg-[#005BFF] hover:bg-[#0047CC] text-white py-4 h-auto rounded-full transition-colors label-caps"
                  >
                    <a
                      href={product.ozonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackOzonClick(
                          "product",
                          product.name,
                          product.ozonUrl!,
                        )
                      }
                    >
                      <OzonIcon className="w-5 h-5" />
                      Купить на Ozon
                    </a>
                  </Button>
                )}

                <Button
                  asChild
                  className="flex items-center justify-center gap-2 w-full bg-espresso hover:bg-espresso/90 text-white py-4 h-auto rounded-full transition-colors label-caps"
                >
                  <a href={`tel:+79778722546`}>Позвонить</a>
                </Button>
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
            <div
              className="prose prose-lg text-dark-grey"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: product description comes from Ozon API (trusted source) and is sanitized server-side
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
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
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-sand">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={p.images[0].startsWith("http")}
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
  );
} );
}
