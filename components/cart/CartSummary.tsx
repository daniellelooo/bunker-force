"use client";

import { useCart } from "@/context/CartContext";

export function CartSummary() {
  const { cartSubtotal, cartTax, cartTotal, dispatch } = useCart();

  return (
    <div className="bg-surface-container-low border border-outline-variant/20 p-8 space-y-6 sticky top-24">
      <h2 className="font-headline text-xl font-black uppercase tracking-tight text-primary">
        RESUMEN DEL PEDIDO
      </h2>

      <div className="space-y-3 font-label text-sm">
        <div className="flex justify-between">
          <span className="text-outline uppercase tracking-widest text-xs">SUBTOTAL</span>
          <span className="font-bold">${cartSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-outline uppercase tracking-widest text-xs">IVA (19%)</span>
          <span className="font-bold">${cartTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-outline-variant/30 pt-3">
          <span className="text-on-surface font-black uppercase tracking-widest text-xs">TOTAL</span>
          <span className="font-headline text-2xl font-black text-primary">
            ${cartTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <button className="w-full bg-primary hover:bg-primary-container text-on-primary py-5 px-8 font-headline font-black tracking-widest transition-all active:scale-[0.98] flex items-center justify-between group">
        <span>CONFIRMAR PEDIDO</span>
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </button>

      <button
        onClick={() => dispatch({ type: "CLEAR_CART" })}
        className="w-full py-3 text-[10px] font-black tracking-widest text-outline border border-outline-variant/30 hover:border-error hover:text-error transition-colors uppercase"
      >
        VACIAR CARRITO
      </button>

      <div className="text-[9px] font-label text-outline tracking-widest uppercase text-center opacity-60 pt-2">
        TRANSACCIÓN SEGURA — CIFRADA
      </div>
    </div>
  );
}
