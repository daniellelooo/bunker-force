"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

function resolveColor(colorId: string): { label: string; hex: string } {
  if (colorMap[colorId]) return colorMap[colorId];
  if (colorId.includes("|")) {
    const [label, hex] = colorId.split("|");
    return { label, hex };
  }
  return { label: colorId, hex: "#888" };
}

function variantKey(size: string, color: string | undefined, multiColor: boolean): string {
  return multiColor && color ? `${size}:${color}` : size;
}

function getVariantStock(
  variantStock: Record<string, number> | undefined,
  size: string,
  color: string | undefined,
  multiColor: boolean
): number | undefined {
  if (!variantStock) return undefined;
  return variantStock[variantKey(size, color, multiColor)];
}

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch } = useCart();
  const router = useRouter();
  const hasSizes = product.availableSizes.length > 0;
  const hasColors = product.availableColors.length > 1;
  const multiColor = hasColors;
  const autoColor = product.availableColors.length === 1 ? product.availableColors[0] : undefined;

  const [selectedSize, setSelectedSize] = useState<string>(hasSizes ? "" : "ÚNICA");
  const [selectedColor, setSelectedColor] = useState<string>(autoColor ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  const effectiveColor = selectedColor || autoColor;

  // Stock de la variante exacta seleccionada
  const selectedVariantStock =
    selectedSize
      ? getVariantStock(product.variantStock, selectedSize, effectiveColor, multiColor)
      : undefined;

  // Sin variantStock configurado y con tallas → no se puede pedir
  const isProductOutOfStock =
    product.status === "out-of-stock" ||
    (product.availableSizes.length > 0 && !product.variantStock);
  const isVariantOutOfStock = selectedVariantStock === 0;
  const stockMax = selectedVariantStock !== undefined && selectedVariantStock > 0
    ? selectedVariantStock
    : undefined;

  function handleSizeChange(size: string) {
    setSelectedSize(size);
    setSizeError(false);
    // Ajustar cantidad si supera el stock de la nueva variante
    if (product.variantStock) {
      const newStock = getVariantStock(product.variantStock, size, effectiveColor, multiColor);
      if (newStock !== undefined && newStock > 0 && quantity > newStock) {
        setQuantity(newStock);
      }
    }
  }

  function handleColorChange(color: string) {
    setSelectedColor(color);
    setColorError(false);
    // Ajustar cantidad si la nueva variante tiene menos stock
    if (product.variantStock && selectedSize) {
      const newStock = getVariantStock(product.variantStock, selectedSize, color, multiColor);
      if (newStock !== undefined && newStock > 0 && quantity > newStock) {
        setQuantity(newStock);
      }
    }
  }

  function validateSelection(): boolean {
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
    return valid;
  }

  function addToCart() {
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
        maxStock: stockMax,
      },
    });
  }

  const handleAdd = () => {
    if (!validateSelection() || isProductOutOfStock || isVariantOutOfStock) return;
    addToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!validateSelection() || isProductOutOfStock || isVariantOutOfStock) return;
    addToCart();
    router.push("/cart");
  };

  if (isProductOutOfStock) {
    return (
      <div className="space-y-6 mb-10">
        <div className="w-full py-6 px-8 font-headline text-lg font-black tracking-widest bg-surface-container border border-outline-variant/30 text-outline flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">block</span>
            AGOTADO
          </span>
        </div>
        <p className="font-label text-[11px] text-outline tracking-widest">
          Este producto está temporalmente sin stock. Contáctanos para más información.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-10">
      {/* Color primero si hay varios (afecta la disponibilidad de tallas) */}
      {hasColors && (
        <div>
          <label className="block font-label text-[10px] tracking-widest font-bold mb-2 text-outline">
            SELECCIONAR COLOR
          </label>
          <div className="flex flex-wrap gap-2">
            {product.availableColors.map((colorId) => {
              const color = resolveColor(colorId);
              const active = selectedColor === colorId;
              return (
                <button
                  key={colorId}
                  onClick={() => handleColorChange(colorId)}
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

      {hasSizes && (
        <div>
          <SizeSelector
            sizes={product.availableSizes}
            selected={selectedSize}
            onChange={handleSizeChange}
            variantStock={product.variantStock}
            selectedColor={effectiveColor}
            multiColor={multiColor}
          />
          {sizeError && (
            <p className="mt-2 font-label text-[10px] tracking-widest uppercase text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              Selecciona una talla antes de continuar
            </p>
          )}
          {/* Aviso stock bajo */}
          {selectedSize && selectedVariantStock !== undefined && selectedVariantStock > 0 && selectedVariantStock <= 3 && (
            <p className="mt-2 font-label text-[10px] tracking-widest uppercase text-yellow-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              ¡Solo {selectedVariantStock === 1 ? "queda 1 unidad" : `quedan ${selectedVariantStock} unidades`}
              {selectedColor && ` en ${resolveColor(selectedColor).label}`}
              {" "}talla {selectedSize}!
            </p>
          )}
          {/* Variante agotada */}
          {selectedSize && isVariantOutOfStock && (
            <p className="mt-2 font-label text-[10px] tracking-widest uppercase text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">block</span>
              {selectedColor
                ? `${resolveColor(selectedColor).label} en talla ${selectedSize} agotado`
                : `Talla ${selectedSize} agotada`}
              {" — elige otra combinación"}
            </p>
          )}
        </div>
      )}

      <div className="flex">
        <QuantityControl
          quantity={quantity}
          onChange={setQuantity}
          max={stockMax}
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleBuyNow}
          disabled={isVariantOutOfStock}
          className="w-full py-6 px-8 font-headline text-lg font-black tracking-widest transition-all active:scale-[0.98] duration-100 flex items-center justify-between group shadow-xl disabled:opacity-40 disabled:cursor-not-allowed bg-primary hover:bg-primary-container text-on-primary"
        >
          <span>COMPRAR AHORA</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
            shopping_cart
          </span>
        </button>

        <button
          onClick={handleAdd}
          disabled={isVariantOutOfStock}
          className={`w-full py-4 px-8 font-headline text-sm font-black tracking-widest transition-all active:scale-[0.98] duration-100 flex items-center justify-between group border disabled:opacity-40 disabled:cursor-not-allowed ${
            sizeError || colorError
              ? "bg-error/10 border-error text-error"
              : "bg-transparent border-outline-variant/60 text-on-surface hover:border-primary hover:text-primary"
          }`}
        >
          <span className="flex items-center gap-2">
            {added && <span className="material-symbols-outlined text-base">check</span>}
            {added ? "AÑADIDO AL CARRITO" : "AÑADIR AL CARRITO"}
          </span>
          <span className="material-symbols-outlined text-base">add</span>
        </button>
      </div>
    </div>
  );
}
