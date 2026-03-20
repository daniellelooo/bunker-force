"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export function CartView() {
  const { state } = useCart();
  const items = state.items;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-outline">
        <span className="material-symbols-outlined text-6xl mb-4">
          shopping_cart
        </span>
        <p className="font-headline text-2xl uppercase tracking-tight mb-2">
          Carrito vacío
        </p>
        <p className="font-label text-sm mb-8 text-center max-w-xs">
          Aún no hay productos en tu carrito. Explora el catálogo y equípate.
        </p>
        <Link
          href="/catalog"
          className="bg-primary text-on-primary font-headline font-bold px-8 py-4 uppercase tracking-widest hover:bg-primary-container transition-all"
        >
          VER CATÁLOGO
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Lista de items */}
      <div className="lg:col-span-8 space-y-8">
        <div className="hidden md:grid grid-cols-12 px-4 py-2 border-b border-outline-variant/30 text-[10px] uppercase tracking-[0.2em] text-outline font-bold">
          <div className="col-span-6">Producto</div>
          <div className="col-span-2 text-center">Talla</div>
          <div className="col-span-2 text-center">Cantidad</div>
          <div className="col-span-2 text-right">Precio</div>
        </div>
        {items.map((item) => (
          <CartItem
            key={`${item.productId}-${item.selectedSize}`}
            item={item}
          />
        ))}
      </div>

      {/* Resumen */}
      <div className="lg:col-span-4">
        <CartSummary />
      </div>
    </div>
  );
}
