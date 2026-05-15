import type {
  Product,
  ProductCategory,
  ProductSubcategory,
} from "./ozon-types";
import { products as fallbackProducts, categories } from "./products";
import { env } from "./env";

const OZON_API_URL = "https://api-seller.ozon.ru";

interface OzonProductInfo {
  id: number;
  offer_id: string;
  name: string;
  description: string;
  images: string[];
  primary_image: string;
  price: string;
  old_price: string;
  currency_code: string;
  sku: number;
  stocks: {
    coming: number;
    present: number;
    reserved: number;
  };
  status: {
    state: string;
    is_created: boolean;
  };
}

interface OzonProductListResponse {
  result: {
    items: { product_id: number; offer_id: string }[];
    total: number;
    last_id: string;
  };
}

interface OzonProductInfoResponse {
  result: {
    items: OzonProductInfo[];
  };
}

// Map offer_id to category/subcategory based on real Ozon product data
function mapOfferIdToCategory(offerId: string): {
  category: ProductCategory;
  subcategory: ProductSubcategory;
} {
  const id = offerId.toLowerCase();

  // ── Одежда: туники, накидки, кофты ──
  // PLT-MACR-xxx, PLPHR-MACR-xxx — туники и накидки
  if (id.startsWith("plt-macr") || id.startsWith("plphr-macr")) {
    return { category: "clothes", subcategory: "dresses" };
  }
  // KOMPLEKT — пляжные комплекты (топ + юбка)
  if (id.startsWith("komplekt")) {
    return { category: "clothes", subcategory: "tops" };
  }
  // crocket — болеро, вязаные изделия
  if (id.startsWith("crocket")) {
    return { category: "clothes", subcategory: "tops" };
  }
  // BELT — пояса макраме
  if (id.startsWith("belt")) {
    return { category: "clothes", subcategory: "belts" };
  }

  // ── Сумки ──
  // AVSK-MKRM — авоськи
  if (id.startsWith("avsk-mkrm") || id.startsWith("avsk")) {
    return { category: "bags", subcategory: "crossbody" };
  }
  // BAG, BAG-, BAG_, RING_BAG, Bag_Flower, Heart_ — сумки
  if (
    id.startsWith("bag") ||
    id.startsWith("ring_bag") ||
    id.startsWith("heart_")
  ) {
    return { category: "bags", subcategory: "totes" };
  }
  // Basket — корзины
  if (id.startsWith("basket")) {
    return { category: "bags", subcategory: "baskets" };
  }

  // ── Интерьер ──
  // Lustra — абажуры
  if (id.startsWith("lustra")) {
    return { category: "interior", subcategory: "lampshades" };
  }
  // GMK-MACR — подвесные кресла/гамаки
  if (id.startsWith("gmk-macr") || id.startsWith("gmk")) {
    return { category: "interior", subcategory: "tipis" };
  }
  // TOYCAT — гамаки для животных (интерьер)
  if (id.startsWith("toycat")) {
    return { category: "interior", subcategory: "tipis" };
  }

  // ── Декор ──
  // ELKA — панно
  if (id.startsWith("elka")) {
    return { category: "decor", subcategory: "pannos" };
  }
  // PLATE — плейсменты
  if (id.startsWith("plate")) {
    return { category: "decor", subcategory: "placemats" };
  }
  // TOY — игрушки
  if (id.startsWith("toy")) {
    return { category: "decor", subcategory: "planters" };
  }

  // Дефолт — декор/панно
  return { category: "decor", subcategory: "pannos" };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const map: Record<string, string> = {
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ё: "yo",
        ж: "zh",
        з: "z",
        и: "i",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "h",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "sch",
        ъ: "",
        ы: "y",
        ь: "",
        э: "e",
        ю: "yu",
        я: "ya",
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function transformOzonProduct(
  ozonProduct: any,
  attrs?: ReturnType<typeof extractAttributes>,
): Product {
  const { category, subcategory } = mapOfferIdToCategory(
    ozonProduct.offer_id || "",
  );
  const price = parseFloat(ozonProduct.price) || 0;
  const oldPrice = parseFloat(ozonProduct.old_price) || undefined;

  // v3 API: stocks вложены в ozonProduct.stocks.stocks[]
  const stocksList: Array<{ present: number; reserved: number }> =
    ozonProduct.stocks?.stocks || [];
  const totalPresent = stocksList.reduce(
    (sum: number, s: any) => sum + (s.present || 0),
    0,
  );
  const inStock = totalPresent > 0;

  // primary_image в v3 — массив строк, это главная обложка (не входит в images[])
  // Правильный порядок как на Ozon: primary_image первой, затем остальные из images[]
  const primaryImage = Array.isArray(ozonProduct.primary_image)
    ? ozonProduct.primary_image[0]
    : ozonProduct.primary_image;

  const galleryImages: string[] = ozonProduct.images ?? [];

  let images: string[];
  if (primaryImage) {
    // primary_image ставим первой, затем галерея (фильтруем дубли на случай совпадения)
    const rest = galleryImages.filter((img: string) => img !== primaryImage);
    images = [primaryImage, ...rest];
  } else if (galleryImages.length > 0) {
    images = galleryImages;
  } else {
    images = ["/images/catalog/placeholder.jpg"];
  }

  const name = ozonProduct.name || "Без названия";
  const rawDescription = ozonProduct.description || "";

  // Если описание не содержит HTML-тегов — конвертируем переносы строк в <br>/<p>
  const hasHtml = /<[a-z][\s\S]*>/i.test(rawDescription);
  const description = rawDescription
    ? hasHtml
      ? rawDescription
      : rawDescription
          .split(/\n{2,}/)
          .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
          .join("")
    : `<p>${name}</p>`;

  const shortDescription = rawDescription
    ? rawDescription
        .replace(/<[^>]+>/g, "")
        .slice(0, 200)
        .replace(/\s+\S*$/, "") + (rawDescription.length > 200 ? "…" : "")
    : name;

  return {
    id: `ozon-${ozonProduct.id}`,
    slug: slugify(name) || `product-${ozonProduct.id}`,
    name,
    description,
    shortDescription,
    price,
    oldPrice: oldPrice && oldPrice > price ? oldPrice : undefined,
    currency: ozonProduct.currency_code || "RUB",
    images,
    category,
    subcategory,
    ozonId: ozonProduct.id,
    ozonUrl: `https://www.ozon.ru/product/${ozonProduct.sku || ozonProduct.id}`,
    inStock,
    material: attrs?.material || "100% хлопок",
    careInstructions: attrs?.careInstructions,
    color: attrs?.color,
    sizes: attrs?.sizes,
    featured: false,
  };
}

// Извлекаем нужные атрибуты из ответа v4/product/info/attributes
// API не возвращает attribute_id, поэтому ищем по ключевым словам в значениях
function extractAttributes(attrs: any[]): {
  material?: string;
  careInstructions?: string;
  color?: string;
  sizes?: string[];
} {
  if (!attrs?.length) return {};

  const values = attrs.map((a: any) =>
    (a.values ?? []).map((v: any) => (v.value ?? "").trim()).filter(Boolean),
  );

  // Материал — ищем атрибут со значением содержащим "хлопок", "полиэфир", "шнур" и т.п.
  const materialKeywords =
    /хлопок|полиэфир|шнур|лён|шерсть|акрил|cotton|polyester/i;
  const materialAttr = values.find((vals) =>
    vals.some((v: string) => materialKeywords.test(v)),
  );
  const material = materialAttr?.find((v: string) => materialKeywords.test(v));

  // Уход — ищем атрибут со значением содержащим "стирк", "уход", "чистк"
  const careKeywords = /стирк|уход|чистк|wash|care/i;
  const careAttr = values.find((vals) =>
    vals.some((v: string) => careKeywords.test(v)),
  );
  const careInstructions = careAttr?.find((v: string) => careKeywords.test(v));

  // Цвет — ищем атрибут с несколькими значениями цветов или ключевыми словами
  const colorKeywords =
    /бежев|молочн|белый|чёрн|черн|коричнев|серый|айвори|экрю|капучино|натуральн|слоновая/i;
  const colorAttr = values.find((vals) =>
    vals.some((v: string) => colorKeywords.test(v)),
  );
  const color = colorAttr
    ?.filter((v: string) => colorKeywords.test(v))
    .join(", ");

  // Размеры — ищем атрибут со значениями типа "42", "44", "S", "M", "L", "XS"
  const sizePattern = /^(XS|S|M|L|XL|XXL|\d{2})$/i;
  const sizeAttr = values.find(
    (vals) => vals.length > 0 && vals.every((v: string) => sizePattern.test(v)),
  );
  const sizes = sizeAttr?.length ? sizeAttr : undefined;

  return {
    material: material || undefined,
    careInstructions: careInstructions || undefined,
    color: color || undefined,
    sizes,
  };
}

async function fetchAttributes(
  productIds: number[],
  clientId: string,
  apiKey: string,
): Promise<Map<number, ReturnType<typeof extractAttributes>>> {
  try {
    const res = await fetch(`${OZON_API_URL}/v4/product/info/attributes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Api-Key": apiKey,
      },
      body: JSON.stringify({
        filter: { product_id: productIds, visibility: "ALL" },
        last_id: "",
        limit: 100,
        sort_by: "",
        sort_dir: "",
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return new Map();
    const data = await res.json();
    const result = new Map<number, ReturnType<typeof extractAttributes>>();
    for (const item of data.result ?? []) {
      result.set(item.id, extractAttributes(item.attributes ?? []));
    }
    return result;
  } catch {
    return new Map();
  }
}

async function fetchFromOzon(): Promise<Product[] | null> {
  const clientId = env.OZON_CLIENT_ID;
  const apiKey = env.OZON_API_KEY;

  console.log(
    "[v0] ✓ Ozon credentials found. Client ID starts with:",
    `${clientId?.substring(0, 5)}...`,
  );

  try {
    // Step 1: Get product list using v3/product/list (correct endpoint)
    console.log("[v0] 📦 Fetching Ozon product list...");
    const listResponse = await fetch(`${OZON_API_URL}/v3/product/list`, {
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
    });

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.log("[v0] ❌ Ozon list request failed:", listResponse.status);
      console.log("[v0] Response body:", errorText);
      console.log("[v0] Request URL:", `${OZON_API_URL}/v3/product/list`);
      return null;
    }

    const listData: OzonProductListResponse = await listResponse.json();
    console.log(
      "[v0] ✓ Found",
      listData.result.items.length,
      "products in Ozon",
    );

    const productIds = listData.result.items.map((item) => item.product_id);

    if (productIds.length === 0) {
      console.log("[v0] ⚠️ No products found in Ozon account");
      return [];
    }

    // Step 2: Get detailed product info using v3/product/info/list (correct endpoint)
    console.log(
      "[v0] 📋 Fetching product details for",
      productIds.length,
      "products...",
    );
    const infoResponse = await fetch(`${OZON_API_URL}/v3/product/info/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Api-Key": apiKey,
      },
      body: JSON.stringify({
        product_id: productIds,
      }),
      next: { revalidate: 3600 },
    });

    if (!infoResponse.ok) {
      const errorText = await infoResponse.text();
      console.log("[v0] ❌ Ozon info request failed:", infoResponse.status);
      console.log("[v0] Response body:", errorText);
      console.log("[v0] Request URL:", `${OZON_API_URL}/v3/product/info/list`);
      return null;
    }

    const infoData = await infoResponse.json();
    console.log("[v0] ✓ Response received from product info endpoint");
    console.log("[v0] Response has 'result' key:", "result" in infoData);
    console.log("[v0] Response has 'items' key:", "items" in infoData);
    console.log(
      "[v0] Items count:",
      infoData.items?.length || infoData.result?.items?.length || 0,
    );

    // v3/product/info/list returns items directly, not in result.items
    const items = infoData.items || infoData.result?.items || [];

    if (items.length === 0) {
      console.log("[v0] ⚠️ No product details returned");
      return [];
    }

    console.log("[v0] ✓ Successfully fetched", items.length, "product details");

    // Step 3: Fetch attributes (material, care, color, sizes) in parallel
    console.log("[v0] 🏷️ Fetching product attributes...");
    const attrsMap = await fetchAttributes(productIds, clientId, apiKey);
    console.log("[v0] ✓ Attributes fetched for", attrsMap.size, "products");

    // Transform Ozon products to our format
    const transformedProducts = items.map((item: any) =>
      transformOzonProduct(item, attrsMap.get(item.id)),
    );
    console.log(
      "[v0] ✓ Transformed",
      transformedProducts.length,
      "products for display",
    );
    return transformedProducts;
  } catch (error) {
    console.log(
      "[v0] ❌ Ozon API error:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  // Next.js Data Cache handles caching via fetch's `next: { revalidate }` option
  console.log("[ozon] 🔄 Fetching products...");
  const ozonProducts = await fetchFromOzon();

  if (ozonProducts && ozonProducts.length > 0) {
    console.log("[ozon] ✓ Using Ozon products:", ozonProducts.length, "items");
    return ozonProducts;
  }

  // Fallback to static products
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
  // If Ozon products don't have featured flag, return first 3 from different categories
  const featured = products.filter((p) => p.featured);
  if (featured.length > 0) return featured;

  const result: Product[] = [];
  for (const cat of categories) {
    const catProducts = products.filter((p) => p.category === cat.slug);
    if (catProducts.length > 0) {
      result.push(catProducts[0]);
    }
  }
  return result.slice(0, 3);
}

export { categories } from "./products";
