"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { CartItem as CartItemType } from "@/lib/types";

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
                  payload: { productId: item.productId, selectedSize: item.selectedSize },
                })
              }
              className="text-outline hover:text-error text-[10px] font-label tracking-widest uppercase mt-1 text-left transition-colors"
            >
              ELIMINAR
            </button>
          </div>
        </div>

        {/* Talla */}
        <div className="col-span-2 text-center">
          <span className="font-label text-xs font-bold uppercase px-3 py-1 bg-surface-container text-secondary border border-outline-variant/30">
            {item.selectedSize === "ÚNICA" ? "TALLA ÚNICA" : `Talla: ${item.selectedSize}`}
          </span>
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
