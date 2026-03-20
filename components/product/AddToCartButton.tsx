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
  const [selectedSize, setSelectedSize] = useState<string>(
    hasSizes ? product.availableSizes[0] : "ÚNICA"
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
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
        <SizeSelector
          sizes={product.availableSizes}
          selected={selectedSize}
          onChange={setSelectedSize}
        />
      )}
      <div className="flex">
        <QuantityControl quantity={quantity} onChange={setQuantity} />
      </div>
      <button
        onClick={handleAdd}
        className="w-full bg-primary hover:bg-primary-container text-on-primary py-6 px-8 font-headline text-lg font-black tracking-widest transition-all active:scale-[0.98] duration-100 flex items-center justify-between group shadow-xl"
      >
        <span>{added ? "✓ AÑADIDO AL CARRITO" : "AÑADIR AL CARRITO"}</span>
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </button>

    </div>
  );
}
