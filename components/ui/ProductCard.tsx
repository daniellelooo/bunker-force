import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { effectiveStatus } from "@/lib/status";

function formatCOP(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

interface ProductCardProps {
  product: Product;
  variant?: "carousel" | "grid";
}

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const status = effectiveStatus(product);
  const isOutOfStock = status === "out-of-stock";
  const isLowStock = status === "low-stock";

  if (variant === "carousel") {
    return (
      <Link
        href={`/product/${product.slug}`}
        className="min-w-[320px] bg-surface-container relative border border-outline-variant/20 snap-start group block"
      >
        <div className="absolute top-0 right-0 bg-primary-container text-on-primary-container px-3 py-1 font-label text-xs font-bold z-10">
          {formatCOP(product.price)}
        </div>
        <div className="aspect-[4/5] overflow-hidden bg-surface-container-high relative">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            width={320}
            height={400}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? "opacity-40 grayscale" : ""}`}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="font-headline font-black text-white tracking-widest text-sm border border-white/60 px-4 py-2">
                AGOTADO
              </span>
            </div>
          )}
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
          <div className={`w-full border py-3 font-headline font-bold uppercase text-sm text-center transition-colors ${
            isOutOfStock
              ? "border-outline-variant/30 text-outline cursor-default"
              : "border-primary text-primary hover:bg-primary hover:text-on-primary"
          }`}>
            {isOutOfStock ? "SIN STOCK" : "VER PRODUCTO"}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative bg-surface-container-low flex flex-col border border-transparent hover:border-outline-variant transition-all overflow-hidden"
    >
      {/* Badge de precio */}
      <div className="absolute top-0 right-0 p-4 z-10">
        <div className="bg-primary-container text-on-primary-container px-3 py-1 text-[10px] font-black tracking-tighter uppercase">
          {formatCOP(product.price)}
        </div>
      </div>

      {/* Badge pocas unidades */}
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-0 left-0 p-4 z-10">
          <div className="bg-yellow-500 text-black px-2 py-1 text-[9px] font-black tracking-widest uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">warning</span>
            ÚLTIMAS UNIDADES
          </div>
        </div>
      )}

      <div className="aspect-[3/4] overflow-hidden bg-surface-container-high relative">
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          width={400}
          height={533}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isOutOfStock ? "opacity-40 grayscale" : ""}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="font-headline font-black text-white tracking-widest text-base border border-white/60 px-5 py-2">
              AGOTADO
            </span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-tertiary tracking-widest uppercase">
            ESPECIFICACIÓN: {product.series}
          </span>
          <h3 className="text-xl font-headline font-bold uppercase group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>
        <div className={`w-full py-4 font-headline font-black text-xs tracking-[0.2em] uppercase transition-all text-center flex items-center justify-center gap-2 ${
          isOutOfStock
            ? "bg-surface-container text-outline border border-outline-variant/30"
            : "bg-primary text-on-primary active:scale-[0.98]"
        }`}>
          {isOutOfStock ? "SIN STOCK" : "VER PRODUCTO"}
          {!isOutOfStock && <span className="material-symbols-outlined text-[14px]">arrow_forward</span>}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 p-1 opacity-20">
        <span className="material-symbols-outlined text-4xl">grid_4x4</span>
      </div>
    </Link>
  );
}
