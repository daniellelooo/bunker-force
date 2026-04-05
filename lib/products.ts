import { supabase, supabaseAdmin } from "@/lib/supabase";
import type { Product, CatalogFilters } from "@/lib/types";


// Mapea la fila de Supabase (snake_case) al tipo Product (camelCase)
function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    sku: row.sku as string,
    series: row.series as string,
    name: row.name as string,
    category: row.category as Product["category"],
    price: row.price as number,
    rating: row.rating as number,
    reviewCount: row.review_count as number,
    badge: (row.badge as string) ?? undefined,
    status: row.status as Product["status"],
    stock: (row.stock as number) ?? undefined,
    variantStock: (row.size_stock as Product["variantStock"]) ?? undefined,
    images: row.images as Product["images"],
    specs: (row.specs as Product["specs"]) ?? [],
    availableSizes: row.available_sizes as Product["availableSizes"],
    availableColors: row.available_colors as string[],
    featured: row.featured as boolean,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return undefined;
  return mapProduct(data);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true);
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProduct);
}

export async function getFilteredProducts(filters: CatalogFilters): Promise<Product[]> {
  let query = supabase.from("products").select("*");

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let result = (data ?? []).map(mapProduct);

  // Filtros que Supabase no soporta nativamente con arrays
  if (filters.sizes && filters.sizes.length > 0) {
    result = result.filter((p) =>
      filters.sizes!.some((s) =>
        p.availableSizes.some((ps) => ps.toLowerCase() === s.toLowerCase())
      )
    );
  }
  if (filters.colors && filters.colors.length > 0) {
    result = result.filter((p) =>
      filters.colors!.some((c) => p.availableColors.includes(c))
    );
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  return result;
}

export async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from("products").select("slug");
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.slug as string);
}

export async function getRelatedProducts(currentId: string, category: string, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", currentId);
  if (error) throw new Error(error.message);
  return (data ?? [])
    .map(mapProduct)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating)
    .slice(0, limit);
}

// Funciones admin (usan service role para bypass de RLS)
export async function adminGetAllProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin.from("products").select("*");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProduct);
}

export async function adminCreateProduct(product: Omit<Product, "id">): Promise<Product> {
  const row = {
    id: Date.now().toString(),
    slug: product.slug,
    sku: product.sku,
    series: product.series,
    name: product.name,
    category: product.category,
    price: product.price,
    rating: product.rating,
    review_count: product.reviewCount,
    badge: product.badge ?? null,
    status: product.status,
    stock: product.stock ?? null,
    size_stock: product.variantStock ?? null,
    images: product.images,
    specs: product.specs,
    available_sizes: product.availableSizes,
    available_colors: product.availableColors,
    featured: product.featured,
  };
  const { data, error } = await supabaseAdmin.from("products").insert(row).select().single();
  if (error) throw new Error(error.message);
  return mapProduct(data);
}

export async function adminUpdateProduct(id: string, product: Product): Promise<Product> {
  const row = {
    slug: product.slug,
    sku: product.sku,
    series: product.series,
    name: product.name,
    category: product.category,
    price: product.price,
    rating: product.rating,
    review_count: product.reviewCount,
    badge: product.badge ?? null,
    status: product.status,
    stock: product.stock ?? null,
    size_stock: product.variantStock ?? null,
    images: product.images,
    specs: product.specs,
    available_sizes: product.availableSizes,
    available_colors: product.availableColors,
    featured: product.featured,
  };
  const { data, error } = await supabaseAdmin.from("products").update(row).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return mapProduct(data);
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
