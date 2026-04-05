import type { Product, ProductStatus } from "@/lib/types";

/**
 * Devuelve el estado real del producto para mostrarlo al cliente.
 * Si el producto tiene tallas pero aún no tiene variantStock configurado,
 * se considera "out-of-stock" para evitar pedidos sin stock real.
 * Este archivo no importa Supabase — se puede usar en Client Components.
 */
export function effectiveStatus(product: Product): ProductStatus {
  if (product.availableSizes.length > 0 && !product.variantStock) {
    return "out-of-stock";
  }
  return product.status;
}
