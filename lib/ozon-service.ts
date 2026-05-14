import type { Product, ProductCategory, ProductSubcategory } from "./ozon-types"
import { products as fallbackProducts, categories } from "./products"
import { env } from "./env"

const OZON_API_URL = "https://api-seller.ozon.ru"

interface OzonProductInfo {
  id: number
  offer_id: string
  name: string
  description: string
  images: string[]
  primary_image: string
  price: string
  old_price: string
  currency_code: string
  sku: number
  stocks: {
    coming: number
    present: number
    reserved: number
  }
  status: {
    state: string
    is_created: boolean
  }
}

interface OzonProductListResponse {
  result: {
    items: { product_id: number; offer_id: string }[]
    total: number
    last_id: string
  }
}

interface OzonProductInfoResponse {
  result: {
    items: OzonProductInfo[]
  }
}

// Map offer_id prefix to category/subcategory
function mapOfferIdToCategory(offerId: string): { category: ProductCategory; subcategory: ProductSubcategory } {
  const prefix = offerId.split("-")[0]?.toLowerCase() || ""
  
  const mapping: Record<string, { category: ProductCategory; subcategory: ProductSubcategory }> = {
    dress: { category: "clothes", subcategory: "dresses" },
    platie: { category: "clothes", subcategory: "dresses" },
    top: { category: "clothes", subcategory: "tops" },
    lamp: { category: "interior", subcategory: "lampshades" },
    abazhur: { category: "interior", subcategory: "lampshades" },
    tipi: { category: "interior", subcategory: "tipis" },
    vigvam: { category: "interior", subcategory: "tipis" },
    panno: { category: "decor", subcategory: "pannos" },
    placemat: { category: "decor", subcategory: "placemats" },
    pleis: { category: "decor", subcategory: "placemats" },
    kashpo: { category: "decor", subcategory: "planters" },
    planter: { category: "decor", subcategory: "planters" },
  }
  
  return mapping[prefix] || { category: "decor", subcategory: "pannos" }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
        з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
        п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
        ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
      }
      return map[char] || char
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function transformOzonProduct(ozonProduct: OzonProductInfo): Product {
  const { category, subcategory } = mapOfferIdToCategory(ozonProduct.offer_id)
  const price = parseFloat(ozonProduct.price) || 0
  const oldPrice = parseFloat(ozonProduct.old_price) || undefined
  
  // Extract material and dimensions from description if present
  const descLines = ozonProduct.description.split("\n")
  let material = "100% хлопок"
  let dimensions: string | undefined
  let careInstructions: string | undefined
  
  for (const line of descLines) {
    if (line.toLowerCase().includes("материал:")) {
      material = line.replace(/материал:/i, "").trim()
    }
    if (line.toLowerCase().includes("размер:") || line.toLowerCase().includes("габариты:")) {
      dimensions = line.replace(/размер:|габариты:/i, "").trim()
    }
    if (line.toLowerCase().includes("уход:")) {
      careInstructions = line.replace(/уход:/i, "").trim()
    }
  }
  
  // Create short description from first paragraph
  const shortDescription = ozonProduct.description.split("\n\n")[0]?.slice(0, 150) + "..." || ozonProduct.name
  
  return {
    id: `ozon-${ozonProduct.id}`,
    slug: slugify(ozonProduct.name) || `product-${ozonProduct.id}`,
    name: ozonProduct.name,
    description: ozonProduct.description,
    shortDescription,
    price,
    oldPrice: oldPrice && oldPrice > price ? oldPrice : undefined,
    currency: ozonProduct.currency_code || "RUB",
    images: ozonProduct.images.length > 0 
      ? ozonProduct.images 
      : ozonProduct.primary_image 
        ? [ozonProduct.primary_image] 
        : ["/images/catalog/placeholder.jpg"],
    category,
    subcategory,
    ozonId: ozonProduct.id,
    ozonUrl: `https://www.ozon.ru/product/${ozonProduct.sku}`,
    inStock: ozonProduct.stocks.present > 0 || ozonProduct.stocks.coming > 0,
    material,
    dimensions,
    careInstructions,
    featured: false,
  }
}

async function fetchFromOzon(): Promise<Product[] | null> {
  const clientId = env.OZON_CLIENT_ID
  const apiKey = env.OZON_API_KEY

  console.log("[v0] ✓ Ozon credentials found. Client ID starts with:", clientId?.substring(0, 5) + "...")

  try {
    // Use v3/product/info/stocks - single endpoint that returns products with stock info
    console.log("[v0] 📦 Fetching Ozon products with stocks...")
    const response = await fetch(`${OZON_API_URL}/v3/product/info/stocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Api-Key": apiKey,
      },
      body: JSON.stringify({
        filter: {
          visibility: "ALL",
        },
        last_id: "",
        limit: 100,
      }),
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] ❌ Ozon request failed:", response.status)
      console.log("[v0] Response body:", errorText)
      console.log("[v0] Request URL:", `${OZON_API_URL}/v3/product/info/stocks`)
      return null
    }

    const data = await response.json()
    console.log("[v0] ✓ Received response from Ozon")
    console.log("[v0] Response keys:", Object.keys(data))
    
    if (!data.result || !data.result.items) {
      console.log("[v0] ⚠️ Unexpected response structure:", JSON.stringify(data).substring(0, 200))
      return []
    }

    console.log("[v0] ✓ Found", data.result.items.length, "products in Ozon")
    
    // Transform Ozon products to our format
    const transformedProducts = data.result.items.map((item: any) => transformOzonProduct(item))
    console.log("[v0] ✓ Transformed", transformedProducts.length, "products for display")
    return transformedProducts
    
  } catch (error) {
    console.log("[v0] ❌ Ozon API error:", error instanceof Error ? error.message : error)
    return null
  }
}

export async function getProducts(): Promise<Product[]> {
  // Next.js Data Cache handles caching via fetch's `next: { revalidate }` option
  console.log("[ozon] 🔄 Fetching products...")
  const ozonProducts = await fetchFromOzon()

  if (ozonProducts && ozonProducts.length > 0) {
    console.log("[ozon] ✓ Using Ozon products:", ozonProducts.length, "items")
    return ozonProducts
  }

  // Fallback to static products
  console.log("[ozon] 📂 Using fallback static products:", fallbackProducts.length, "items")
  return fallbackProducts
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((p) => p.category === category)
}

export async function getProductsBySubcategory(subcategory: string): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((p) => p.subcategory === subcategory)
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts()
  return products.find((p) => p.slug === slug)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts()
  // If Ozon products don't have featured flag, return first 3 from different categories
  const featured = products.filter((p) => p.featured)
  if (featured.length > 0) return featured
  
  const result: Product[] = []
  for (const cat of categories) {
    const catProducts = products.filter((p) => p.category === cat.slug)
    if (catProducts.length > 0) {
      result.push(catProducts[0])
    }
  }
  return result.slice(0, 3)
}

export { categories } from "./products"
