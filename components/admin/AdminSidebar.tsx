"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/orders/pending-count")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.count === "number") setPendingCount(data.count);
      })
      .catch(() => {});
  }, [pathname]);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/admin", icon: "dashboard", label: "Dashboard", exact: true, badge: 0 },
    { href: "/admin/products", icon: "inventory_2", label: "Productos", exact: false, badge: 0 },
    { href: "/admin/orders", icon: "local_shipping", label: "Pedidos", exact: false, badge: pendingCount },
  ];

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-surface-container-low border-b border-outline-variant/20 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-on-surface hover:text-primary transition-colors"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-[26px]">menu</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-headline font-black text-[9px] tracking-[0.2em] text-outline uppercase">
              BUNKER FORCE BELLO
            </div>
            <div className="font-headline font-black text-sm tracking-tight text-primary uppercase">
              ADMIN
            </div>
          </div>
          {pendingCount > 0 && (
            <Link href="/admin/orders">
              <span className="bg-error text-on-error font-headline font-black text-[10px] min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1">
                {pendingCount}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-surface-container-low border-r border-outline-variant/20 flex flex-col shrink-0",
          // Desktop: static in flow
          "md:w-64 md:min-h-screen md:static md:translate-x-0",
          // Mobile: fixed drawer
          "fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Mobile drawer header */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
          <div className="font-headline font-black text-sm tracking-tight text-primary uppercase">
            ADMIN PANEL
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-on-surface hover:text-primary transition-colors"
            aria-label="Cerrar menú"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Brand — desktop only */}
        <div className="hidden md:block px-6 py-6 border-b border-outline-variant/20">
          <div className="font-headline font-black text-xs tracking-[0.25em] text-outline uppercase mb-1">
            BUNKER FORCE BELLO
          </div>
          <div className="font-headline font-black text-lg tracking-tight text-primary uppercase">
            ADMIN PANEL
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 font-label text-sm font-medium tracking-widest uppercase transition-all",
                  active
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-outline hover:text-on-surface hover:bg-surface-container-high border-l-2 border-transparent"
                )}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-error text-on-error font-headline font-black text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-outline-variant/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full font-label text-sm font-medium tracking-widest uppercase text-outline hover:text-error hover:bg-error/10 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Cerrar sesión
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-3 w-full font-label text-sm font-medium tracking-widest uppercase text-outline hover:text-on-surface hover:bg-surface-container-high transition-all mt-1"
          >
            <span className="material-symbols-outlined text-[20px]">
              storefront
            </span>
            Ver tienda
          </Link>
        </div>
      </aside>
    </>
  );
}
