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

function ColorBadge({ colorId }: { colorId: string }) {
  const c = colorMap[colorId] ?? { label: colorId, hex: "#888" };
  return (
    <span className="flex items-center gap-1 font-label text-[10px] text-on-surface-variant">
      <span className="w-3 h-3 rounded-full border border-outline-variant/40 shrink-0" style={{ backgroundColor: c.hex }} />
      {c.label}
    </span>
  );
}

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { dispatch } = useCart();

  return (
    <div className="group bg-surface-container-low border-l-4 border-transparent hover:border-primary transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-12 items-center p-4 gap-6">
        {/* Info del producto */}
        <div className="col-span-6 flex items-center gap-6">
          <div className="w-32 h-32 bg-surface-container-highest shrink-0 relative overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label text-[10px] text-tertiary tracking-widest uppercase">
              SKU: {item.sku}
            </span>
            <h3 className="font-headline text-xl font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <button
              onClick={() =>
                dispatch({
                  type: "REMOVE_ITEM",
                  payload: { productId: item.productId, selectedSize: item.selectedSize, selectedColor: item.selectedColor },
                })
              }
              className="text-outline hover:text-error text-[10px] font-label tracking-widest uppercase mt-1 text-left transition-colors"
            >
              ELIMINAR
            </button>
          </div>
        </div>

        {/* Talla y Color */}
        <div className="col-span-2 flex flex-col items-center gap-1">
          <span className="font-label text-xs font-bold uppercase px-3 py-1 bg-surface-container text-secondary border border-outline-variant/30">
            {item.selectedSize === "ÚNICA" ? "TALLA ÚNICA" : `Talla: ${item.selectedSize}`}
          </span>
          {item.selectedColor && (
            <ColorBadge colorId={item.selectedColor} />
          )}
        </div>

        {/* Cantidad */}
        <div className="col-span-2 flex justify-center items-center">
          <div className="flex items-center border border-outline-variant/30 bg-surface-container">
            <button
              onClick={() =>
                dispatch({
                  type: "UPDATE_QUANTITY",
                  payload: {
                    productId: item.productId,
                    selectedSize: item.selectedSize,
                    selectedColor: item.selectedColor,
                    quantity: item.quantity - 1,
                  },
                })
              }
              className="p-2 hover:bg-surface-container-highest text-outline hover:text-on-surface transition-colors material-symbols-outlined text-sm"
            >
              remove
            </button>
            <span className="px-4 font-label font-bold text-sm">
              {String(item.quantity).padStart(2, "0")}
            </span>
            <button
              onClick={() =>
                dispatch({
                  type: "UPDATE_QUANTITY",
                  payload: {
                    productId: item.productId,
                    selectedSize: item.selectedSize,
                    selectedColor: item.selectedColor,
                    quantity: item.quantity + 1,
                  },
                })
              }
              className="p-2 hover:bg-surface-container-highest text-outline hover:text-on-surface transition-colors material-symbols-outlined text-sm"
            >
              add
            </button>
          </div>
        </div>

        {/* Precio */}
        <div className="col-span-2 text-right">
          <span className="font-headline text-xl font-black text-on-surface">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
