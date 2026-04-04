"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import { SizeSelector } from "./SizeSelector";
import { QuantityControl } from "./QuantityControl";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch } = useCart();
  const hasSizes = product.availableSizes.length > 0;
  const [selectedSize, setSelectedSize] = useState<string>(hasSizes ? "" : "ÚNICA");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const handleAdd = () => {
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    setSizeError(false);
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
      <div className="flex">
        <QuantityControl quantity={quantity} onChange={setQuantity} />
      </div>
      <button
        onClick={handleAdd}
        className={`w-full py-6 px-8 font-headline text-lg font-black tracking-widest transition-all active:scale-[0.98] duration-100 flex items-center justify-between group shadow-xl ${
          sizeError
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
