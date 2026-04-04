import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-[921px] w-full overflow-hidden flex items-center">
      {/* Logo marca de agua táctica */}
      <div className="absolute top-6 right-8 z-10 opacity-20 hidden md:block pointer-events-none">
        <Image
          src="/logo.png"
          alt=""
          width={200}
          height={80}
          className="object-contain"
        />
      </div>

      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZPquL-MBgbGasicUx6eDJn0LkC92_6q-mWOEAkl9Y5eTOC9fSKcgYghKukgWivbuAMRWd99fhCBQUfwZI4ZFGDPdg9f7WoBS5_2KnyJsSLlRLj0tpFR7tzwsJi-HZrk3rxEdeRR6C9kYAtb2583d0W8x-snc9z0vifcd0zO-D80ltHsCyolkZgz0Z1rfrETWcqPNjv9motqVHdtazDbl4mEgdWCjFxPgt_J-SKZB28n_my8y6uP54fTj-huMjGAF1yQ4QHiOEvNc"
          alt="Tactical jacket in rugged mountain environment"
          fill
          className="object-cover object-center"
          style={{ filter: "grayscale(0.4) brightness(0.5)" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-6 md:px-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-12 h-[2px] bg-primary" />
          <span className="font-label text-sm tracking-[0.3em] uppercase text-tertiary">
            BUNKER-SPEC PHASE 01
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
