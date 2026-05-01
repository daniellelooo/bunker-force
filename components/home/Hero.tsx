import Image from "next/image";
import Link from "next/link";
import { HeroVideo } from "./HeroVideo";
import { getSiteConfig } from "@/lib/site-config";

export async function Hero() {
  const config = await getSiteConfig();
  return (
    <section className="relative h-[921px] w-full overflow-hidden flex items-center">
      <div className="absolute top-6 right-8 z-10 opacity-20 hidden md:block pointer-events-none">
        <Image
          src="/logo.png"
          alt=""
          width={200}
          height={80}
          className="object-contain"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.heroMobileImage}
          alt="Chaqueta táctica Bunker Force Bello — equipamiento para campo y ciudad"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="md:hidden absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "grayscale(0.4) brightness(0.5)" }}
        />
        {config.heroVideo ? (
          <HeroVideo src={config.heroVideo} />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={config.heroDesktopImage}
            alt=""
            className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: "grayscale(0.4) brightness(0.5)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-6 md:px-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-12 h-[2px] bg-primary" />
          <span className="font-label text-sm tracking-[0.3em] uppercase text-tertiary">
            BUNKER-LA TIENDA TÁCTICA DEL NORTE
          </span>
        </div>
        <h1 className="font-headline text-5xl md:text-8xl font-black leading-none mb-8 tracking-wide">
          REFORZADO PARA <br />
          EL CAMPO. <br />
          <span className="text-primary text-glow">
            DISEÑADO PARA LA CIUDAD.
          </span>
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="/catalog"
            className="bg-primary hover:bg-on-primary-container text-on-primary font-headline font-bold px-10 py-5 text-xl transition-all active:scale-95 flex items-center gap-3"
          >
            COMPRAR AHORA
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <Link
            href="/catalog"
            className="border-2 border-outline-variant hover:border-primary text-on-surface font-headline font-bold px-10 py-5 text-xl transition-all"
          >
            VER CATÁLOGO
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 font-label text-[10px] text-outline tracking-tighter opacity-50 hidden md:block">
        LOC: 45.3221° N, 122.6765° W<br />
        ALT: 1,420M / LVL: CRITICAL
      </div>
    </section>
  );
}
