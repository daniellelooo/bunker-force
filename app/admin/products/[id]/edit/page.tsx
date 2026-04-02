"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((products: Product[]) => {
        const found = products.find((p) => p.id === id);
        if (found) setProduct(found);
        else setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="font-label text-xs tracking-widest text-outline uppercase animate-pulse">
          Cargando producto...
        </span>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="font-label text-xs text-error tracking-widest uppercase">
          Producto no encontrado
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="font-label text-xs tracking-[0.25em] text-primary uppercase">
          Gestión de inventario
        </span>
        <h1 className="font-headline font-black text-4xl uppercase tracking-tighter mt-1">
          Editar Producto
        </h1>
        <p className="font-label text-sm text-outline mt-2">{product.name}</p>
      </div>
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
}
