import Image from "next/image";
import Link from "next/link";
import { CartIcon } from "./CartIcon";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { SearchButton } from "./SearchButton";

const ropaItems = [
  { href: "/catalog?category=superior", label: "Ropa Superior" },
  { href: "/catalog?category=inferior", label: "Ropa Inferior" },
  { href: "/catalog?category=calzado", label: "Calzado" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface-container-low border-b border-outline-variant/20">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-none">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Bunker Force Bello"
            width={140}
            height={56}
            className="object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="font-headline font-bold uppercase text-base text-on-surface-variant hover:text-primary transition-colors tracking-widest"
          >
            INICIO
          </Link>
          <NavDropdown label="ROPA" items={ropaItems} />
          <Link
            href="/catalog?category=accessories"
            className="font-headline font-bold uppercase text-base text-on-surface-variant hover:text-primary transition-colors tracking-widest"
          >
            ACCESORIOS Y EQUIPO
          </Link>
          <Link
            href="/catalog"
            className="font-headline font-bold uppercase text-base text-on-surface-variant hover:text-primary transition-colors tracking-widest"
          >
            CATÁLOGO
          </Link>
          <Link
            href="/sobre-nosotros"
            className="font-headline font-bold uppercase text-base text-on-surface-variant hover:text-primary transition-colors tracking-widest"
          >
            SOBRE NOSOTROS
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <SearchButton />
          <Link
            href="/faq"
            className="p-2 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 active:scale-95"
            title="Ayuda"
          >
            <span className="material-symbols-outlined">help_outline</span>
          </Link>
          <CartIcon />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
