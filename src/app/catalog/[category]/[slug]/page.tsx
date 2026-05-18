import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProductsByCategory } from "@/lib/ozon-service";
import { getCategoryBySlug } from "@/lib/products";
import { Header } from "@/components/stariva/header";
import { Footer } from "@/components/stariva/footer";
import { ProductDetails } from "./product-details";
import {
  BreadcrumbJsonLd,
  ProductJsonLd,
} from "@/components/stariva/json-ld";

export const revalidate = 3600;

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://stariva.ru";

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const { getProducts } = await import("@/lib/ozon-service");
  const products = await getProducts();
  return products.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const product = await getProductBySlug(slug);
  const category = getCategoryBySlug(categorySlug);

  if (!product || !category) return {};

  const title = `${product.name} — купить в интернет-магазине`;
  const description = product.shortDescription
    ? `${product.shortDescription} Ручная работа из натурального хлопка. Купить на Ozon.`
    : `${product.name} — изделие ручного макраме из натурального хлопка. Купить на Ozon.`;
  const url = `/catalog/${categorySlug}/${slug}`;
  const image = product.images[0] ?? "/images/about/hero-founder.jpg";
  const isExternal = image.startsWith("http");

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}${url}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${BASE_URL}${url}`,
      images: [
        {
          url: isExternal ? image : `${BASE_URL}${image}`,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [isExternal ? image : `${BASE_URL}${image}`],
    },
  };
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

  const url = `/catalog/${categorySlug}/${slug}`;

  return (
    <>
      <Header variant="solid" />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", href: "/" },
          { name: "Каталог", href: "/catalog" },
          { name: category.name, href: `/catalog/${categorySlug}` },
          { name: product.name, href: url },
        ]}
      />
      <ProductJsonLd
        name={product.name}
        description={product.shortDescription || product.description}
        image={product.images.map((img) =>
          img.startsWith("http") ? img : `${BASE_URL}${img}`,
        )}
        price={product.price}
        oldPrice={product.oldPrice}
        currency={product.currency}
        inStock={product.inStock}
        url={url}
        category={category.name}
        material={product.material}
      />
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
