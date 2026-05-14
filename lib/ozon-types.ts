// Ozon Seller API Types

export interface OzonProductInfo {
  id: number
  offer_id: string
  name: string
  barcode: string
  category_id: number
  description: string
  images: string[]
  primary_image: string
  price: string
  old_price: string
  currency_code: string
  sku: number
  fbo_sku: number
  fbs_sku: number
  sources: OzonSource[]
  stocks: OzonStock
  status: OzonProductStatus
  visible_status: string
  visibility_details: OzonVisibilityDetails
  created_at: string
  updated_at: string
}

export interface OzonSource {
  is_enabled: boolean
  sku: number
  source: string
}

export interface OzonStock {
  coming: number
  present: number
  reserved: number
}

export interface OzonProductStatus {
  state: string
  state_failed: string
  moderate_status: string
  decline_reasons: string[]
  validation_state: string
  state_name: string
  state_description: string
  is_failed: boolean
  is_created: boolean
  state_tooltip: string
}

export interface OzonVisibilityDetails {
  has_price: boolean
  has_stock: boolean
  active_product: boolean
}

export interface OzonProductListResponse {
  result: {
    items: OzonProductListItem[]
    total: number
    last_id: string
  }
}

export interface OzonProductListItem {
  product_id: number
  offer_id: string
  is_fbo_visible: boolean
  is_fbs_visible: boolean
  archived: boolean
  is_discounted: boolean
}

export interface OzonProductInfoResponse {
  result: {
    items: OzonProductInfo[]
  }
}

// Internal Product Types
export type ProductCategory = "clothes" | "interior" | "decor"
export type ProductSubcategory = 
  | "dresses" | "tops" 
  | "lampshades" | "tipis" 
  | "pannos" | "placemats" | "planters"

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  shortDescription: string
  price: number
  oldPrice?: number
  currency: string
  images: string[]
  category: ProductCategory
  subcategory: ProductSubcategory
  ozonId?: number
  ozonUrl?: string
  inStock: boolean
  material: string
  dimensions?: string
  careInstructions?: string
  featured?: boolean
}

export interface Category {
  slug: ProductCategory
  name: string
  description: string
  image: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  slug: ProductSubcategory
  name: string
  categorySlug: ProductCategory
}
