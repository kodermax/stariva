import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProductsByCategory,
footer";
import { Header } from "@/src/components/stariva/header";
import {
  getProductBySlug,
  getProductsByCategory,
} from "@/src/lib/ozon-service";
import { getCategoryBySlug } from "@/src/lib/products";
import { ProductDetails } from "./product-details";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const { getProducts } = await import("@/src/lib/ozon-service");
  const products = await getProducts();
  return products.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category: categorySlug, slug } = await params;
  const product = await getProductBySlug(slug);
  const category = getCategoryBySlug(categorySlug);

  if (!product || !category || product.category !== categorySlug) {
    notFound();
  }

  const allCategoryProducts = await getProductsByCategory(categorySlug);
  const relatedProducts = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <>
      <Header variant="solid" />
      <ProductDetails
        product={product}
        category={category}
        categorySlug={categorySlug}
        relatedProducts={relatedProducts}
      />
      <Footer />
    </>
  );
}
