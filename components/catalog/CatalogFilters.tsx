"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const sizes = ["S", "M", "L", "XL", "XXL"];
const colors = [
  { id: "black-ops", label: "Black Ops", hex: "#000000" },
  { id: "od-green", label: "Verde Militar", hex: "#3d4231" },
  { id: "coyote-tan", label: "Coyote Tan", hex: "#937b5d" },
  { id: "multicam", label: "MultiCam", hex: "#6b6e56" },
];

export function CatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSizes = searchParams.getAll("sizes");
  const selectedColors = searchParams.getAll("colors");
  const maxPrice = searchParams.get("maxPrice") || "1000";
  const isAccessories = searchParams.get("category") === "accessories";

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

  return (
    <aside className="w-full md:w-72 bg-surface-container-low p-8 space-y-12 shrink-0">
      <div className="space-y-6">
        <h3 className="font-headline text-sm font-black tracking-widest text-primary uppercase">
          FILTROS
        </h3>

        {/* Size Filter — hidden for accessories */}
        {!isAccessories && (
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
        )}

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
      </div>

      <div className="pt-8 border-t border-outline-variant/30">
        <button
          onClick={reset}
          className="w-full py-3 text-[10px] font-black tracking-widest text-on-surface bg-surface-container-highest border border-outline-variant hover:bg-surface-container-high transition-colors uppercase"
        >
          RESTABLECER FILTROS
        </button>
      </div>
    </aside>
  );
}
