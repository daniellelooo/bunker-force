"use client";

import type { ProductSize } from "@/lib/types";

interface SizeSelectorProps {
  sizes: ProductSize[];
  selected: string;
  onChange: (size: string) => void;
}

export function SizeSelector({ sizes, selected, onChange }: SizeSelectorProps) {
  return (
    <div>
      <label className="block font-label text-[10px] tracking-widest font-bold mb-2 text-outline">
        SELECCIONAR TALLA
      </label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`px-4 py-2 border text-xs font-bold font-label tracking-wide transition-colors ${
              selected === size
                ? "border-primary bg-surface-container-highest text-primary"
                : "border-outline-variant text-on-surface hover:border-outline"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
