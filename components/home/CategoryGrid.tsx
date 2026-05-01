import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";

export async function CategoryGrid() {
  const config = await getSiteConfig();
  return (
    <section className="py-24 bg-surface-container-low px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline text-4xl font-black uppercase tracking-tight">
              EXPLORAR CATEGORÍAS
            </h2>
            <div className="h-1 w-24 bg-primary mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px]">

          {/* ROPA SUPERIOR — tile grande */}
          <Link
            href="/catalog?category=superior"
            className="md:col-span-2 relative group cursor-pointer overflow-hidden h-[300px] md:h-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.categorySuperiorImage}
              alt="Ropa superior táctica"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-headline text-4xl font-black text-white mb-2">
                ROPA SUPERIOR
              </h3>
              <p className="text-tertiary font-label text-xs tracking-widest uppercase">
                CAMISETAS / CHAQUETAS / CHALECOS
              </p>
            </div>
          </Link>

          {/* Columna ROPA INFERIOR + CALZADO */}
          <div className="flex flex-col gap-4">
            <Link
              href="/catalog?category=inferior"
              className="h-[140px] md:h-1/2 relative group cursor-pointer overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.categoryInferiorImage}
                alt="Ropa inferior táctica"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-headline text-2xl font-black text-white">
                  ROPA INFERIOR
                </h3>
              </div>
            </Link>
            <Link
              href="/catalog?category=calzado"
              className="h-[140px] md:h-1/2 relative group cursor-pointer overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.categoryCalzadoImage}
                alt="Calzado táctico"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-headline text-2xl font-black text-white">
                  CALZADO
                </h3>
              </div>
            </Link>
          </div>

          {/* ACCESORIOS */}
          <Link
            href="/catalog?category=accessories"
            className="relative group cursor-pointer overflow-hidden h-[280px] md:h-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.categoryAccessoriesImage}
              alt="Accesorios tácticos"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-headline text-3xl font-black text-white">
                ACCESORIOS
              </h3>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
