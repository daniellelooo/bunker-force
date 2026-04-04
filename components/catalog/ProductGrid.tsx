import { getFilteredProducts } from "@/lib/products";
import type { CatalogFilters } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductGridProps {
  filters: CatalogFilters;
}

export async function ProductGrid({ filters }: ProductGridProps) {
  const products = await getFilteredProducts(filters);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-outline">
        <span className="material-symbols-outlined text-6xl mb-4">inventory_2</span>
        <p className="font-headline text-xl uppercase tracking-tight">
          Sin resultados
        </p>
        <p className="font-label text-sm mt-2">Ajusta los filtros para ver más productos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant="grid" />
      ))}
    </div>
  );
}
