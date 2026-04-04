"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  available: "Disponible",
  "low-stock": "Stock bajo",
  "out-of-stock": "Sin stock",
};

const STATUS_COLORS: Record<string, string> = {
  available: "text-tertiary border-tertiary/30 bg-tertiary/10",
  "low-stock": "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  "out-of-stock": "text-error border-error/30 bg-error/10",
};

const CATEGORY_LABELS: Record<string, string> = {
  jackets: "Chaquetas",
  pants: "Pantalones",
  boots: "Botas",
  accessories: "Accesorios",
};

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

export function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleToggleFeatured(product: Product) {
    setTogglingId(product.id);
    const updated = { ...product, featured: !product.featured };
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    setTogglingId(null);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="font-label text-xs tracking-[0.25em] text-primary uppercase">
            Gestión de inventario
          </span>
          <h1 className="font-headline font-black text-3xl md:text-4xl uppercase tracking-tighter mt-1">
            Productos
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-3 md:px-5 py-3 font-headline font-black text-sm tracking-widest uppercase transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden sm:inline">Nuevo producto</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-surface-container-low border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20">
                {["Producto", "SKU", "Categoría", "Precio", "Estado", "Destacado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-label text-[10px] tracking-[0.2em] uppercase text-outline">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-high transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0].src} alt={product.name} className="w-10 h-10 object-cover bg-surface-container-high shrink-0" />
                      )}
                      <div>
                        <div className="font-label text-sm font-bold text-on-surface">{product.name}</div>
                        {product.badge && (
                          <div className="font-label text-[9px] tracking-widest text-primary uppercase mt-0.5">{product.badge}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-label text-xs text-outline tracking-widest">{product.sku}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                      {CATEGORY_LABELS[product.category] || product.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-headline font-bold text-sm text-primary">{formatCOP(product.price)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-label text-[10px] tracking-widest uppercase px-2 py-1 border ${STATUS_COLORS[product.status]}`}>
                      {STATUS_LABELS[product.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleFeatured(product)}
                      disabled={togglingId === product.id}
                      className="transition-transform hover:scale-110 active:scale-95 disabled:opacity-40"
                    >
                      <span className={`material-symbols-outlined text-[22px] ${product.featured ? "text-primary" : "text-outline hover:text-primary"}`}>
                        {product.featured ? "star" : "star_outline"}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex items-center gap-1 px-3 py-1.5 font-label text-[10px] tracking-widest uppercase border border-outline-variant/40 text-outline hover:text-on-surface hover:border-outline transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="flex items-center gap-1 px-3 py-1.5 font-label text-[10px] tracking-widest uppercase border border-error/30 text-error/60 hover:text-error hover:border-error transition-colors disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-4xl text-outline mb-2 block">inventory_2</span>
            <p className="font-label text-xs text-outline tracking-widest uppercase">No hay productos</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {products.length === 0 ? (
          <div className="py-16 text-center bg-surface-container-low border border-outline-variant/20">
            <span className="material-symbols-outlined text-4xl text-outline mb-2 block">inventory_2</span>
            <p className="font-label text-xs text-outline tracking-widest uppercase">No hay productos</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-surface-container-low border border-outline-variant/20 p-4">
              <div className="flex items-start gap-3 mb-3">
                {product.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0].src} alt={product.name} className="w-14 h-14 object-cover bg-surface-container-high shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-label text-sm font-bold text-on-surface truncate">{product.name}</div>
                  <div className="font-label text-xs text-outline tracking-widest mt-0.5">{product.sku}</div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="font-headline font-bold text-sm text-primary">{formatCOP(product.price)}</span>
                    <span className={`font-label text-[10px] tracking-widest uppercase px-2 py-0.5 border ${STATUS_COLORS[product.status]}`}>
                      {STATUS_LABELS[product.status]}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleToggleFeatured(product)} disabled={togglingId === product.id} className="transition-transform active:scale-95 disabled:opacity-40 shrink-0">
                  <span className={`material-symbols-outlined text-[22px] ${product.featured ? "text-primary" : "text-outline"}`}>
                    {product.featured ? "star" : "star_outline"}
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/20">
                <Link href={`/admin/products/${product.id}/edit`} className="flex-1 flex items-center justify-center gap-1 py-2 font-label text-[10px] tracking-widest uppercase border border-outline-variant/40 text-outline hover:text-on-surface hover:border-outline transition-colors">
                  <span className="material-symbols-outlined text-[14px]">edit</span>Editar
                </Link>
                <button onClick={() => handleDelete(product.id, product.name)} disabled={deletingId === product.id} className="flex-1 flex items-center justify-center gap-1 py-2 font-label text-[10px] tracking-widest uppercase border border-error/30 text-error/60 hover:text-error hover:border-error transition-colors disabled:opacity-40">
                  <span className="material-symbols-outlined text-[14px]">delete</span>Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="font-label text-[10px] text-outline tracking-widest">
        {products.length} producto{products.length !== 1 ? "s" : ""} en el catálogo
      </p>
    </div>
  );
}
