import { fetchFromOzon } from "./ozon/api-client";
import type { Product } from "./ozon-types";
import { categories, products as fallbackProducts } from "./products";

export async function getProducts(): Promise<Product[]> {
  console.log("[ozon] 🔄 Fetching products...");
  const ozonProducts = await fetchFromOzon();

  if (ozonProducts && ozonProducts.length > 0) {
    console.log("[ozon] ✓ Using Ozon products:", ozonProducts.length, "items");
    return ozonProducts;
  }

  console.log(
    "[ozon] 📂 Using fallback static products:",
    fallbackProducts.length,
    "items",
  );
  return fallbackProducts;
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.category === category);
}

export async function getProductsBySubcategory(
  subcategory: string,
): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.subcategory === subcategory);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);
  if (featured.length > 0) return featured;

  const result: Product[] = [];
  for (const cat of categories) {
    const catProducts = products.filter((p) => p.category === cat.slug);
    if (catProducts.length > 0) result.push(catProducts[0]);
  }
  return result.slice(0, 3);
}

export { categories } from "./products";
