"use client";

import { useState } from "react";
import Link from "next/link";

const navSections = [
  {
    label: "ROPA",
    items: [
      { href: "/catalog?category=jackets", label: "Chaquetas" },
      { href: "/catalog?category=pants", label: "Pantalones" },
      { href: "/catalog?category=boots", label: "Botas" },
    ],
  },
];

const navLinks = [
  { href: "/", label: "INICIO" },
  { href: "/catalog?category=accessories", label: "ACCESORIOS" },
  { href: "/catalog", label: "CATÁLOGO" },
  { href: "/sobre-nosotros", label: "SOBRE NOSOTROS" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [ropaOpen, setRopaOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-high transition-all"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative ml-auto w-72 h-full bg-surface-container-low border-l border-outline-variant flex flex-col p-8 overflow-y-auto">
            <button
              className="self-end p-2 text-on-surface-variant hover:bg-surface-container-high mb-8"
              onClick={() => setOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-xl font-headline font-black text-primary mb-8">
              BUNKER FORCE BELLO
            </div>
            <nav className="flex flex-col gap-2">
              {/* Links directos primero */}
              <Link
                href="/"
                className="font-headline font-bold uppercase text-on-surface-variant hover:text-primary transition-colors tracking-tight py-2"
                onClick={() => setOpen(false)}
              >
                INICIO
              </Link>

              {/* ROPA expandable */}
              <button
                className="flex items-center justify-between font-headline font-bold uppercase text-on-surface-variant hover:text-primary transition-colors tracking-tight py-2"
                onClick={() => setRopaOpen(!ropaOpen)}
              >
                ROPA
                <span
                  className={`material-symbols-outlined text-sm transition-transform ${ropaOpen ? "rotate-180" : ""}`}
                >
                  expand_more
                </span>
              </button>
              {ropaOpen && (
                <div className="flex flex-col gap-1 pl-4 mb-2">
                  {navSections[0].items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="font-label text-sm text-on-surface-variant hover:text-primary transition-colors py-1"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-headline font-bold uppercase text-on-surface-variant hover:text-primary transition-colors tracking-tight py-2"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
