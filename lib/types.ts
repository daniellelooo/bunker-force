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

export type ProductCategory = "superior" | "inferior" | "calzado" | "accessories";
export type ProductSize = string;
export type ProductColor = string;
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
  stock?: number;
  // Clave: "TALLA" (sin colores) o "TALLA:COLOR" (con colores). Undefined = stock no configurado aún.
  variantStock?: Record<string, number>;
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
  selectedColor?: string;
  quantity: number;
  maxStock?: number; // Stock disponible para esta variante al momento de añadir
}

export interface CatalogFilters {
  sizes?: string[];
  colors?: string[];
  maxPrice?: number;
  category?: ProductCategory;
  sort?: "price-asc" | "price-desc" | "rating" | "featured";
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}
