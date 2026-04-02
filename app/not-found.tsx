import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="font-label text-[10px] tracking-[0.4em] uppercase text-primary mb-4">
        Error 404
      </span>
      <h1 className="font-headline font-black text-[8rem] leading-none tracking-tighter text-outline/20 select-none">
        404
      </h1>
      <p className="font-headline font-black text-2xl uppercase tracking-tight text-on-surface mt-2 mb-2">
        Página no encontrada
      </p>
      <p className="font-body text-sm text-outline max-w-sm mb-8">
        La página que buscas no existe o fue movida. Revisa la URL o vuelve a la tienda.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 font-headline font-black text-sm tracking-widest uppercase hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">home</span>
          Ir al inicio
        </Link>
        <Link
          href="/catalog"
          className="flex items-center gap-2 border border-outline-variant/40 text-on-surface px-6 py-3 font-headline font-black text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">grid_view</span>
          Ver catálogo
        </Link>
      </div>
    </main>
  );
}
