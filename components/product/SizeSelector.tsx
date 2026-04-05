"use client";

import type { ProductSize } from "@/lib/types";

interface SizeSelectorProps {
  sizes: ProductSize[];
  selected: string;
  onChange: (size: string) => void;
  variantStock?: Record<string, number>;
  selectedColor?: string;
  multiColor?: boolean;
}

function getStockForSize(
  size: string,
  variantStock: Record<string, number> | undefined,
  selectedColor: string | undefined,
  multiColor: boolean
): number | undefined {
  if (!variantStock) return undefined;
  if (multiColor && selectedColor) {
    // Stock exacto para esta combinación talla+color
    return variantStock[`${size}:${selectedColor}`];
  }
  if (multiColor && !selectedColor) {
    // Sin color elegido: sumar stock de todos los colores para esta talla
    const keys = Object.keys(variantStock).filter((k) => k.startsWith(`${size}:`));
    if (keys.length === 0) return undefined;
    return keys.reduce((sum, k) => sum + (variantStock[k] ?? 0), 0);
  }
  return variantStock[size];
}

export function SizeSelector({
  sizes,
  selected,
  onChange,
  variantStock,
  selectedColor,
  multiColor = false,
}: SizeSelectorProps) {
  const stockNotConfigured = variantStock === undefined;

  return (
    <div>
      <label className="block font-label text-[10px] tracking-widest font-bold mb-2 text-outline">
        SELECCIONAR TALLA
      </label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const stock = getStockForSize(size, variantStock, selectedColor, multiColor);
          const isOutOfStock = !stockNotConfigured && stock !== undefined && stock === 0;
          const isLowStock = stock !== undefined && stock > 0 && stock <= 3;
          const isSelected = selected === size;

          return (
            <button
              key={size}
              onClick={() => !isOutOfStock && onChange(size)}
              disabled={isOutOfStock}
              className={`relative px-4 py-2 border text-xs font-bold font-label tracking-wide transition-colors ${
                isOutOfStock
                  ? "border-outline-variant/20 text-outline/30 bg-surface-container-low cursor-not-allowed"
                  : isSelected
                  ? "border-primary bg-surface-container-highest text-primary"
                  : "border-outline-variant text-on-surface hover:border-outline"
              }`}
            >
              {isOutOfStock ? <span className="line-through">{size}</span> : size}
              {isLowStock && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black font-label font-black text-[8px] tracking-wide px-1 leading-4">
                  {stock}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {!stockNotConfigured && multiColor && !selectedColor && (
        <p className="mt-2 font-label text-[10px] tracking-widest text-outline flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">info</span>
          Elige un color para ver el stock exacto de cada talla
        </p>
      )}
      {!stockNotConfigured && sizes.some((s) => {
        const st = getStockForSize(s, variantStock, selectedColor, multiColor);
        return st !== undefined && st > 0 && st <= 3;
      }) && (
        <p className="mt-2 font-label text-[10px] tracking-widest text-yellow-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">warning</span>
          El número sobre la talla indica las unidades disponibles
        </p>
      )}
    </div>
  );
}
