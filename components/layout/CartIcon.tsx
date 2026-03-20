"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative p-2 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 active:scale-95"
    >
      <span className="material-symbols-outlined">shopping_cart</span>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 leading-none min-w-[18px] text-center">
          {cartCount > 99 ? "99+" : String(cartCount).padStart(2, "0")}
        </span>
      )}
    </Link>
  );
}
