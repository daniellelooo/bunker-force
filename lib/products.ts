import productsData from "@/data/products.json";
import type { Product, CatalogFilters } from "@/lib/types";

const products = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getFilteredProducts(filters: CatalogFilters): Product[] {
  let result = [...products];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.sizes && filters.sizes.length > 0) {
    result = result.filter((p) =>
      filters.sizes!.some((s) => p.availableSizes.includes(s as any))
    );
  }

  if (filters.colors && filters.colors.length > 0) {
    result = result.filter((p) =>
      filters.colors!.some((c) => p.availableColors.includes(c as any))
    );
  }

  if (filters.maxPrice) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
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
    case "featured":
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  return result;
}

export function getAllSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function getRelatedProducts(currentId: string, category: string, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== currentId && p.category === category)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating)
    .slice(0, limit);
}
