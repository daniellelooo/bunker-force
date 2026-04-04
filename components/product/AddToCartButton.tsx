"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import { SizeSelector } from "./SizeSelector";
import { QuantityControl } from "./QuantityControl";

const colorMap: Record<string, { label: string; hex: string }> = {
  "black-ops":  { label: "Black Ops",     hex: "#000000" },
  "od-green":   { label: "Verde Militar", hex: "#3d4231" },
  "wolf-grey":  { label: "Gris Lobo",     hex: "#6b7280" },
  "navy":       { label: "Azul Marino",   hex: "#1e3a5f" },
  "coyote-tan": { label: "Coyote Tan",    hex: "#937b5d" },
  "multicam":   { label: "MultiCam",      hex: "#6b6e56" },
};

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch } = useCart();
  const hasSizes = product.availableSizes.length > 0;
  const hasColors = product.availableColors.length > 1;
  const autoColor = product.availableColors.length === 1 ? product.availableColors[0] : undefined;

  const [selectedSize, setSelectedSize] = useState<string>(hasSizes ? "" : "ÚNICA");
  const [selectedColor, setSelectedColor] = useState<string>(autoColor ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  const handleAdd = () => {
    let valid = true;
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      valid = false;
    }
    if (hasColors && !selectedColor) {
      setColorError(true);
      setTimeout(() => setColorError(false), 2500);
      valid = false;
    }
    if (!valid) return;

    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        price: product.price,
        image: product.images[0].src,
        selectedSize,
        selectedColor: selectedColor || undefined,
        quantity,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6 mb-10">
      {hasSizes && (
        <div>
          <SizeSelector
            sizes={product.availableSizes}
            selected={selectedSize}
            onChange={(s) => { setSelectedSize(s); setSizeError(false); }}
          />
          {sizeError && (
            <p className="mt-2 font-label text-[10px] tracking-widest uppercase text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              Selecciona una talla antes de continuar
            </p>
          )}
        </div>
      )}

      {hasColors && (
        <div>
          <label className="block font-label text-[10px] tracking-widest font-bold mb-2 text-outline">
            SELECCIONAR COLOR
          </label>
          <div className="flex flex-wrap gap-2">
            {product.availableColors.map((colorId) => {
              const color = colorMap[colorId] ?? { label: colorId, hex: "#888" };
              const active = selectedColor === colorId;
              return (
                <button
                  key={colorId}
                  onClick={() => { setSelectedColor(colorId); setColorError(false); }}
                  title={color.label}
                  className={`flex items-center gap-2 px-3 py-2 border text-xs font-bold font-label tracking-wide transition-colors ${
                    active
                      ? "border-primary bg-surface-container-highest text-primary"
                      : "border-outline-variant text-on-surface hover:border-outline"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 border border-outline-variant/40"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.label}
                </button>
              );
            })}
          </div>
          {colorError && (
            <p className="mt-2 font-label text-[10px] tracking-widest uppercase text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              Selecciona un color antes de continuar
            </p>
          )}
        </div>
      )}

      <div className="flex">
        <QuantityControl quantity={quantity} onChange={setQuantity} />
      </div>
      <button
        onClick={handleAdd}
        className={`w-full py-6 px-8 font-headline text-lg font-black tracking-widest transition-all active:scale-[0.98] duration-100 flex items-center justify-between group shadow-xl ${
          sizeError || colorError
            ? "bg-error/20 border border-error text-error"
            : "bg-primary hover:bg-primary-container text-on-primary"
        }`}
      >
        <span className="flex items-center gap-2">
          {added && <span className="material-symbols-outlined text-base">check</span>}
          {added ? "AÑADIDO AL CARRITO" : "AÑADIR AL CARRITO"}
        </span>
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </button>
    </div>
  );
}
