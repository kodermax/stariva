import type { ProductCategory, ProductSubcategory } from "../ozon-types";

export function mapOfferIdToCategory(offerId: string): {
  category: ProductCategory;
  subcategory: ProductSubcategory;
} {
  const id = offerId.toLowerCase();

  // ── Одежда: туники, накидки, кофты ──
  if (id.startsWith("plt-macr") || id.startsWith("plphr-macr")) {
    return { category: "clothes", subcategory: "dresses" };
  }
  if (id.startsWith("komplekt")) {
    return { category: "clothes", subcategory: "tops" };
  }
  if (id.startsWith("crocket")) {
    return { category: "clothes", subcategory: "tops" };
  }
  if (id.startsWith("belt")) {
    return { category: "clothes", subcategory: "belts" };
  }

  // ── Сумки ──
  if (id.startsWith("avsk-mkrm") || id.startsWith("avsk")) {
    return { category: "bags", subcategory: "crossbody" };
  }
  if (
    id.startsWith("bag") ||
    id.startsWith("ring_bag") ||
    id.startsWith("heart_")
  ) {
    return { category: "bags", subcategory: "totes" };
  }
  if (id.startsWith("basket")) {
    return { category: "bags", subcategory: "baskets" };
  }

  // ── Интерьер ──
  if (id.startsWith("lustra")) {
    return { category: "interior", subcategory: "lampshades" };
  }
  if (id.startsWith("gmk-macr") || id.startsWith("gmk")) {
    return { category: "interior", subcategory: "tipis" };
  }
  if (id.startsWith("toycat")) {
    return { category: "interior", subcategory: "tipis" };
  }

  // ── Декор ──
  if (id.startsWith("elka")) {
    return { category: "decor", subcategory: "pannos" };
  }
  if (id.startsWith("plate")) {
    return { category: "decor", subcategory: "placemats" };
  }
  if (id.startsWith("toy")) {
    return { category: "decor", subcategory: "planters" };
  }

  // Дефолт
  return { category: "decor", subcategory: "pannos" };
}
