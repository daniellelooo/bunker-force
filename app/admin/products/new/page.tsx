import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = {
  title: "Nuevo Producto | Admin",
};

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="font-label text-xs tracking-[0.25em] text-primary uppercase">
          Gestión de inventario
        </span>
        <h1 className="font-headline font-black text-4xl uppercase tracking-tighter mt-1">
          Nuevo Producto
        </h1>
      </div>
      <ProductForm mode="new" />
    </div>
  );
}
