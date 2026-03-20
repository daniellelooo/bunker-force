export interface ProductImage {
  src: string;
  alt: string;
  label: string;
}

export interface ProductSpec {
  icon: string;
  title: string;
  description: string;
}

export type ProductCategory = "jackets" | "pants" | "boots" | "accessories";
export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type ProductColor = "black-ops" | "od-green" | "coyote-tan" | "multicam";
export type ProductStatus = "available" | "low-stock" | "out-of-stock";

export interface Product {
  id: string;
  slug: string;
  sku: string;
  series: string;
  name: string;
  category: ProductCategory;
  price: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  status: ProductStatus;
  images: ProductImage[];
  specs: ProductSpec[];
  availableSizes: ProductSize[];
  availableColors: ProductColor[];
  featured: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  selectedSize: string;
  quantity: number;
}

export interface CatalogFilters {
  sizes?: string[];
  colors?: string[];
  maxPrice?: number;
  category?: ProductCategory;
  sort?: "price-asc" | "price-desc" | "rating" | "featured";
}
