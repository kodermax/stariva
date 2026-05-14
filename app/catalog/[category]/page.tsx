import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  categories,
  getProductsByCategory,
} from "@/lib/ozon-service"
import { formatPrice, getCategoryBySlug } from "@/lib/products"
import type { Product, ProductSubcategory } from "@/lib/ozon-types"
import { Header } from "@/components/stariva/header"
import { Footer } from "@/components/stariva/footer"
import CategoryFilters from "./category-filters"

export const dynamic = "force-dynamic"
export const revalidate = 3600

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(categorySlug)

  return (
    <>
      <Header variant="solid" />
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

            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
              {category.name}
            </h1>
            <p className="text-white/80 max-w-xl">
              {category.description}
            </p>
          </div>
        </section>

        {/* Products with Filters */}
        <CategoryFilters 
          products={products} 
          category={category}
          categorySlug={categorySlug}
        />

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
