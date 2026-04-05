"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { CartItem as CartItemType } from "@/lib/types";

const colorMap: Record<string, { label: string; hex: string }> = {
  "black-ops":  { label: "Black Ops",     hex: "#000000" },
  "od-green":   { label: "Verde Militar", hex: "#3d4231" },
  "wolf-grey":  { label: "Gris Lobo",     hex: "#6b7280" },
  "navy":       { label: "Azul Marino",   hex: "#1e3a5f" },
  "coyote-tan": { label: "Coyote Tan",    hex: "#937b5d" },
  "multicam":   { label: "MultiCam",      hex: "#6b6e56" },
};

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CartItem({ item }: { item: CartItemType }) {
  const { dispatch } = useCart();
  const atMax = item.maxStock !== undefined && item.quantity >= item.maxStock;
  const color = item.selectedColor ? (colorMap[item.selectedColor] ?? { label: item.selectedColor, hex: "#888" }) : null;

  function remove() {
    dispatch({
      type: "REMOVE_ITEM",
      payload: {
        productId: item.productId,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      },
    });
  }

  function setQty(qty: number) {
    if (qty <= 0) return;
    const capped = item.maxStock !== undefined ? Math.min(qty, item.maxStock) : qty;
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        productId: item.productId,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        quantity: capped,
      },
    });
  }

  return (
    <div className="relative bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/40 transition-colors">

      {/* Botón eliminar — esquina superior derecha, siempre visible */}
      <button
        type="button"
        onClick={remove}
        className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 border border-error/40 text-error/70 hover:text-error hover:bg-error/10 hover:border-error transition-all font-label text-[10px] tracking-widest uppercase"
        title="Eliminar del carrito"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
        Quitar
      </button>

      <div className="flex items-start gap-4 p-4 pr-24">

        {/* Imagen */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-surface-container-highest shrink-0 relative overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <p className="font-label text-[10px] text-tertiary tracking-widest uppercase">
              SKU: {item.sku}
            </p>
            <h3 className="font-headline text-base md:text-lg font-bold uppercase tracking-tight leading-tight">
              {item.name}
            </h3>
          </div>

          {/* Talla y color */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-label text-[10px] font-bold uppercase px-2 py-0.5 bg-surface-container text-secondary border border-outline-variant/30">
              {item.selectedSize === "ÚNICA" ? "TALLA ÚNICA" : `Talla ${item.selectedSize}`}
            </span>
            {color && (
              <span className="flex items-center gap-1 font-label text-[10px] text-on-surface-variant">
                <span className="w-3 h-3 rounded-full border border-outline-variant/40 shrink-0" style={{ backgroundColor: color.hex }} />
                {color.label}
              </span>
            )}
          </div>

          {/* Cantidad + precio */}
          <div className="flex items-center justify-between gap-4 flex-wrap pt-1">

            {/* Control cantidad */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center border border-outline-variant/30 bg-surface-container w-fit">
                <button
                  type="button"
                  onClick={() => setQty(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-highest transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="w-10 text-center font-label font-bold text-sm">
                  {String(item.quantity).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(item.quantity + 1)}
                  disabled={atMax}
                  className="w-8 h-8 flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-highest transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
              {atMax && (
                <p className="font-label text-[9px] tracking-widest text-yellow-500 uppercase">
                  Máx. disponible: {item.maxStock}
                </p>
              )}
            </div>

            {/* Precio */}
            <div className="text-right">
              <p className="font-headline text-lg font-black text-primary">
                {formatCOP(item.price * item.quantity)}
              </p>
              {item.quantity > 1 && (
                <p className="font-label text-[10px] text-outline">
                  {formatCOP(item.price)} c/u
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
