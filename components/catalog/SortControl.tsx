"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const sortOptions = [
  { value: "featured", label: "DESTACADOS" },
  { value: "price-asc", label: "PRECIO: MENOR A MAYOR" },
  { value: "price-desc", label: "PRECIO: MAYOR A MENOR" },
  { value: "rating", label: "MEJOR VALORADOS" },
];

export function SortControl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "featured";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center space-x-4 text-[10px] font-bold tracking-widest text-outline uppercase">
      <span>ORDENAR POR:</span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleChange(e.target.value)}
          className="bg-transparent border border-outline-variant/30 text-on-surface text-[10px] font-bold tracking-widest uppercase py-1 px-3 appearance-none pr-6 focus:outline-none focus:border-primary cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface-container">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-1 top-1/2 -translate-y-1/2 material-symbols-outlined text-xs pointer-events-none">
          expand_more
        </span>
      </div>
    </div>
  );
}
