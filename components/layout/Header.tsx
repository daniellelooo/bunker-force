import Link from "next/link";
import { CartIcon } from "./CartIcon";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { SearchButton } from "./SearchButton";

const ropaItems = [
  { href: "/catalog?category=jackets", label: "Chaquetas" },
  { href: "/catalog?category=pants", label: "Pantalones" },
  { href: "/catalog?category=boots", label: "Botas" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface-container-low border-b border-outline-variant/20">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-none">
        <Link
          href="/"
          className="text-2xl font-headline font-black tracking-tighter text-primary uppercase"
        >
          BUNKER FORCE BELLO
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="font-headline font-bold uppercase text-sm text-on-surface-variant hover:text-primary transition-colors tracking-tight"
          >
            INICIO
          </Link>
          <NavDropdown label="ROPA" items={ropaItems} />
          <Link
            href="/catalog?category=accessories"
            className="font-headline font-bold uppercase text-sm text-on-surface-variant hover:text-primary transition-colors tracking-tight"
          >
            ACCESORIOS
          </Link>
          <Link
            href="/catalog"
            className="font-headline font-bold uppercase text-sm text-on-surface-variant hover:text-primary transition-colors tracking-tight"
          >
            CATÁLOGO
          </Link>
          <Link
            href="/sobre-nosotros"
            className="font-headline font-bold uppercase text-sm text-on-surface-variant hover:text-primary transition-colors tracking-tight"
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
