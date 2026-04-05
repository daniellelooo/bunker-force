"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";

const sizesByCategory: Record<string, string[]> = {
  superior:    ["XS", "S", "M", "L", "XL", "XXL"],
  inferior:    ["28", "30", "32", "34", "36", "38", "40", "42"],
  calzado:     ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
  accessories: ["Única", "S", "M", "L", "XL"],
  default:     ["XS", "S", "M", "L", "XL", "XXL"],
};
const colors = [
  { id: "black-ops",  label: "Black Ops",     hex: "#000000" },
  { id: "od-green",   label: "Verde Militar",  hex: "#3d4231" },
  { id: "wolf-grey",  label: "Gris Lobo",      hex: "#6b7280" },
  { id: "navy",       label: "Azul Marino",    hex: "#1e3a5f" },
  { id: "coyote-tan", label: "Coyote Tan",     hex: "#937b5d" },
  { id: "multicam",   label: "MultiCam",       hex: "#6b6e56" },
];

export function CatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedSizes = searchParams.getAll("sizes");
  const selectedColors = searchParams.getAll("colors");
  const maxPrice = searchParams.get("maxPrice") || "1000";
  const category = searchParams.get("category");

  const activeCount =
    selectedSizes.length +
    selectedColors.length +
    (maxPrice !== "1000" ? 1 : 0);

  const updateParam = useCallback(
    (key: string, value: string, toggle = false) => {
      const params = new URLSearchParams(searchParams.toString());
      if (toggle) {
        const existing = params.getAll(key);
        if (existing.includes(value)) {
          params.delete(key);
          existing.filter((v) => v !== value).forEach((v) => params.append(key, v));
        } else {
          params.append(key, value);
        }
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const reset = () => {
    router.push(pathname, { scroll: false });
  };

  const filterContent = (
    <div className="space-y-6">
      <h3 className="font-headline text-sm font-black tracking-widest text-primary uppercase">
        FILTROS
      </h3>

      {/* Filtro de talla */}
      {(() => {
        const sizes = sizesByCategory[category ?? "default"] ?? sizesByCategory.default;
        return (
          <div className="space-y-4">
            <span className="block text-[10px] font-bold tracking-[0.2em] text-outline uppercase">
              TALLA
            </span>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => updateParam("sizes", size, true)}
                  className={`border py-2 text-xs font-bold transition-colors ${
                    selectedSizes.includes(size)
                      ? "border-primary bg-surface-container-highest text-primary"
                      : "border-outline-variant hover:bg-surface-container-high text-on-surface"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Color Filter */}
      <div className="space-y-4">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-outline uppercase">
          COLOR / ACABADO
        </span>
        <div className="space-y-1">
          {colors.map((color) => {
            const active = selectedColors.includes(color.id);
            return (
              <button
                key={color.id}
                onClick={() => updateParam("colors", color.id, true)}
                className={`w-full flex items-center gap-0 border transition-colors overflow-hidden ${
                  active
                    ? "border-primary"
                    : "border-outline-variant/40 hover:border-outline-variant"
                }`}
              >
                <span
                  className="w-8 h-9 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span
                  className={`flex-1 text-left px-3 text-[10px] font-bold tracking-[0.15em] uppercase transition-colors ${
                    active ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {color.label}
                </span>
                {active && (
                  <span className="material-symbols-outlined text-primary text-sm pr-3">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-outline uppercase">
          PRESUPUESTO
        </span>
        <input
          className="w-full h-1 bg-surface-container-highest appearance-none accent-primary cursor-pointer"
          type="range"
          min="100000"
          max="2000000"
          step="50000"
          value={maxPrice === "1000" ? "2000000" : maxPrice}
          onChange={(e) => updateParam("maxPrice", e.target.value)}
        />
        <div className="flex justify-between text-[10px] font-mono text-tertiary">
          <span>$100 K</span>
          <span>
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            }).format(Number(maxPrice === "1000" ? "2000000" : maxPrice))}
          </span>
        </div>
      </div>

      <div className="pt-6 border-t border-outline-variant/30">
        <button
          onClick={reset}
          className="w-full py-3 text-[10px] font-black tracking-widest text-on-surface bg-surface-container-highest border border-outline-variant hover:bg-surface-container-high transition-colors uppercase"
        >
          RESTABLECER FILTROS
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-surface-container-low border-b border-outline-variant/20">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 font-label text-xs tracking-widest uppercase text-on-surface"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
          Filtros
          {activeCount > 0 && (
            <span className="bg-primary text-on-primary font-headline font-black text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
              {activeCount}
            </span>
          )}
        </button>
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="font-label text-[10px] tracking-widest uppercase text-outline hover:text-primary transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] bg-surface-container-low overflow-y-auto transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
          <span className="font-headline font-black text-sm tracking-widest uppercase text-primary">
            Filtros
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-on-surface hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
        <div className="p-6">
          {filterContent}
          <button
            onClick={() => setMobileOpen(false)}
            className="w-full mt-4 py-3 bg-primary text-on-primary font-headline font-black text-sm tracking-widest uppercase hover:bg-primary-container transition-colors"
          >
            Ver resultados
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-72 bg-surface-container-low p-8 space-y-12 shrink-0">
        {filterContent}
      </aside>
    </>
  );
}
