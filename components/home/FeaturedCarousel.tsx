"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

function formatCOP(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

export function FeaturedCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 352 : -352, behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-surface px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-16">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="font-headline text-4xl font-black uppercase tracking-tight">
              PRODUCTOS DESTACADOS
            </h2>
            <div className="flex-grow h-[1px] bg-outline-variant opacity-30" />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors active:scale-95"
              aria-label="Anterior"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 border border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors active:scale-95"
              aria-label="Siguiente"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-4 snap-x no-scrollbar"
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="min-w-[320px] bg-surface-container relative border border-outline-variant/20 snap-start group block"
            >
              <div className="absolute top-0 right-0 bg-primary-container text-on-primary-container px-3 py-1 font-label text-xs font-bold z-10">
                {formatCOP(product.price)}
              </div>
              <div className="aspect-[4/5] overflow-hidden bg-surface-container-high">
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  width={320}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-[10px] text-tertiary tracking-[0.2em] font-label uppercase mb-1">
                    SERIE: {product.series}
                  </p>
                  <h4 className="font-headline text-xl font-bold uppercase">
                    {product.name}
                  </h4>
                </div>
                <div className="w-full border border-primary text-primary py-3 font-headline font-bold uppercase text-sm hover:bg-primary hover:text-on-primary transition-colors text-center">
                  VER PRODUCTO
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
