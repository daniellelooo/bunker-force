"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Carga productos desde la API pública una sola vez al montar
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setAllProducts)
      .catch(() => {});
  }, []);

  const results: Product[] = query.trim().length < 2
    ? []
    : allProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase()) ||
        p.series.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex flex-col">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl mx-auto mt-16 md:mt-24 px-4">
        <div className="flex items-center bg-surface-container-low border border-outline-variant">
          <span className="material-symbols-outlined text-primary pl-4">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos, SKU, serie..."
            className="flex-1 bg-transparent px-4 py-4 font-label text-on-surface placeholder:text-outline focus:outline-none text-sm tracking-wide"
          />
          <button
            onClick={onClose}
            className="p-4 text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {query.trim().length >= 2 && (
          <div className="bg-surface-container-low border border-t-0 border-outline-variant max-h-[60vh] overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-6 py-8 text-center text-outline font-label text-sm">
                Sin resultados para &quot;{query}&quot;
              </div>
            ) : (
              results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-surface-container transition-colors border-b border-outline-variant/20 last:border-0 group"
                >
                  <div className="w-12 h-12 bg-surface-container-high shrink-0 overflow-hidden">
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover transition-all"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-sm uppercase group-hover:text-primary transition-colors truncate">
                      {product.name}
                    </p>
                    <p className="font-label text-[10px] text-outline tracking-widest uppercase">
                      {product.sku} · {product.series}
                    </p>
                  </div>
                  <span className="font-headline font-black text-primary text-sm shrink-0">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
