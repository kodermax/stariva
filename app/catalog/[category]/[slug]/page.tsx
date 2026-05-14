import { notFound } from "next/navigation"
import {
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/ozon-service"
import { formatPrice, getCategoryBySlug } from "@/lib/products"
import { Header } from "@/components/stariva/header"
import { Footer } from "@/components/stariva/footer"
import { ProductDetails } from "./product-details"

export const dynamic = "force-dynamic"
export const revalidate = 3600

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category: categorySlug, slug } = await params
  const product = await getProductBySlug(slug)
  const category = getCategoryBySlug(categorySlug)

  if (!product || !category || product.category !== categorySlug) {
    notFound()
  }

  const allCategoryProducts = await getProductsByCategory(categorySlug)
  const relatedProducts = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  return (
    <>
      <Header />
      <ProductDetails 
        product={product} 
        category={category} 
        categorySlug={categorySlug}
        relatedProducts={relatedProducts}
      />
      <Footer />
    </>
  )
}
