import { CartView } from "@/components/cart/CartView";

export const metadata = {
  title: "Carrito",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label text-primary tracking-[0.2em] text-xs font-bold uppercase block mb-2">
            Manifiesto de inventario
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            Mi Carrito
          </h1>
        </div>
        <div className="text-right">
          <span className="font-label text-outline text-xs uppercase tracking-widest">
            Estado del pedido:
          </span>
          <span className="font-label text-tertiary text-xs uppercase tracking-widest block font-bold">
            Pendiente de confirmación
          </span>
        </div>
      </header>
      <CartView />
    </div>
  );
}
