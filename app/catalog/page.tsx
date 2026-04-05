import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explora todo el equipamiento táctico de Bunker Force Bello. Chaquetas, pantalones, botas y accesorios militares disponibles en Bello, Antioquia.",
  openGraph: {
    title: "Catálogo | BUNKER FORCE BELLO",
    description:
      "Chaquetas, pantalones, botas y accesorios tácticos. Envíos a toda Colombia.",
  },
};
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SortControl } from "@/components/catalog/SortControl";
import type { CatalogFilters as FiltersType, ProductCategory } from "@/lib/types";

const categoryTitles: Record<string, { top: string; bottom: string }> = {
  superior: { top: "TODA LA", bottom: "ROPA SUPERIOR" },
  inferior: { top: "TODA LA", bottom: "ROPA INFERIOR" },
  calzado: { top: "TODO EL", bottom: "CALZADO" },
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
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    category: params.category as ProductCategory | undefined,
    sort: params.sort as FiltersType["sort"],
  };

  const title =
    (filters.category && categoryTitles[filters.category]) ??
    { top: "TODO EL", bottom: "EQUIPAMIENTO" };

  return (
    <div className="min-h-screen pt-0">
      <div className="flex flex-col md:flex-row">
        <Suspense fallback={null}>
          <CatalogFilters />
        </Suspense>

        <section className="flex-1 bg-surface p-4 md:p-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-8 font-label text-[10px] tracking-[0.2em] uppercase text-outline">
            <a href="/" className="hover:text-primary transition-colors">INICIO</a>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            {filters.category ? (
              <>
                <a href="/catalog" className="hover:text-primary transition-colors">CATÁLOGO</a>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-primary">{title.bottom}</span>
              </>
            ) : (
              <span className="text-primary">CATÁLOGO</span>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 space-y-4 md:space-y-0">
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
