import { Suspense } from "react";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SortControl } from "@/components/catalog/SortControl";
import type { CatalogFilters as FiltersType, ProductCategory } from "@/lib/types";

const categoryTitles: Record<string, { top: string; bottom: string }> = {
  jackets: { top: "TODAS LAS", bottom: "CHAQUETAS" },
  pants: { top: "TODOS LOS", bottom: "PANTALONES" },
  boots: { top: "TODAS LAS", bottom: "BOTAS" },
  accessories: { top: "TODOS LOS", bottom: "ACCESORIOS" },
};

interface CatalogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const filters: FiltersType = {
    sizes: params.sizes
      ? Array.isArray(params.sizes)
        ? params.sizes
        : [params.sizes]
      : undefined,
    colors: params.colors
      ? Array.isArray(params.colors)
        ? params.colors
        : [params.colors]
      : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    category: params.category as ProductCategory | undefined,
    sort: params.sort as FiltersType["sort"],
  };

  const title = filters.category
    ? categoryTitles[filters.category]
    : { top: "TODO EL", bottom: "EQUIPAMIENTO" };

  return (
    <div className="min-h-screen pt-0">
      <div className="flex flex-col md:flex-row">
        <Suspense fallback={<div className="w-72 bg-surface-container-low p-8" />}>
          <CatalogFilters />
        </Suspense>

        <section className="flex-1 bg-surface p-6 md:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter uppercase leading-none">
                {title.top} <br />
                <span className="text-primary">{title.bottom}</span>
              </h1>
            </div>
            <Suspense fallback={null}>
              <SortControl />
            </Suspense>
          </div>
          <ProductGrid filters={filters} />
        </section>
      </div>
    </div>
  );
}
