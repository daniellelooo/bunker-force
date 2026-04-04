"use client";

import { useState } from "react";
import Link from "next/link";
import type { Order, Product } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente", processing: "Procesando", shipped: "Enviado",
  delivered: "Entregado", cancelled: "Cancelado",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  processing: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  delivered: "text-tertiary bg-tertiary/10 border-tertiary/30",
  cancelled: "text-error bg-error/10 border-error/30",
};
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function formatCOP(v: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v);
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export function DashboardClient({ initialOrders, initialProducts }: { initialOrders: Order[]; initialProducts: Product[] }) {
  const [orders] = useState<Order[]>(initialOrders);
  const [products] = useState<Product[]>(initialProducts);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [filterActive, setFilterActive] = useState(false);

  const availableYears = Array.from(new Set(orders.map((o) => new Date(o.createdAt).getFullYear()))).sort((a, b) => b - a);
  if (!availableYears.includes(now.getFullYear())) availableYears.unshift(now.getFullYear());

  const filteredOrders = filterActive
    ? orders.filter((o) => { const d = new Date(o.createdAt); return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear; })
    : orders;

  const totalRevenue = filteredOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total, 0);
  const statusCounts = filteredOrders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  const productSales: Record<string, { name: string; qty: number }> = {};
  filteredOrders.filter((o) => o.status === "delivered").forEach((o) =>
    o.items.forEach((item) => {
      if (!productSales[item.productId]) productSales[item.productId] = { name: item.name, qty: 0 };
      productSales[item.productId].qty += item.quantity;
    })
  );
  const topProducts = Object.entries(productSales).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);
  const maxQty = topProducts[0]?.[1].qty || 1;
  const recentOrders = filteredOrders.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-label text-xs tracking-[0.25em] text-primary uppercase">Panel de control</span>
          <h1 className="font-headline font-black text-3xl md:text-4xl uppercase tracking-tighter mt-1">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {filterActive && (
            <button onClick={() => setFilterActive(false)} className="flex items-center gap-1 px-3 py-2 font-label text-[10px] tracking-widest uppercase border border-primary/40 text-primary hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-[14px]">close</span>Ver todo
            </button>
          )}
          <select value={selectedMonth} onChange={(e) => { setSelectedMonth(Number(e.target.value)); setFilterActive(true); }} className="bg-surface-container border border-outline-variant/40 px-3 py-2 font-label text-xs tracking-widest text-on-surface focus:outline-none focus:border-primary">
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={selectedYear} onChange={(e) => { setSelectedYear(Number(e.target.value)); setFilterActive(true); }} className="bg-surface-container border border-outline-variant/40 px-3 py-2 font-label text-xs tracking-widest text-on-surface focus:outline-none focus:border-primary">
            {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={() => setFilterActive(true)} className="flex items-center gap-1 px-4 py-2 font-label text-[10px] tracking-widest uppercase bg-primary text-on-primary hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined text-[14px]">filter_list</span>Filtrar
          </button>
        </div>
      </div>

      {filterActive && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 w-fit">
          <span className="material-symbols-outlined text-[14px] text-primary">calendar_month</span>
          <span className="font-label text-xs tracking-widest uppercase text-primary">Mostrando: {MONTHS[selectedMonth]} {selectedYear}</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="receipt_long" label="Total pedidos" value={filteredOrders.length.toString()} />
        <StatCard icon="payments" label="Ingresos (entregados)" value={formatCOP(totalRevenue)} small />
        <StatCard icon="schedule" label="Pendientes" value={(statusCounts.pending || 0).toString()} accent="text-yellow-400" />
        <StatCard icon="check_circle" label="Entregados" value={(statusCounts.delivered || 0).toString()} accent="text-tertiary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-low border border-outline-variant/20 p-6">
          <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline mb-5">Estado de pedidos</h2>
          <div className="space-y-3">
            {(["pending","processing","shipped","delivered","cancelled"] as const).map((status) => {
              const count = statusCounts[status] || 0;
              const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">{STATUS_LABELS[status]}</span>
                    <span className="font-label text-xs font-bold text-on-surface">{count}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest">
                    <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/20 p-6">
          <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline mb-5">Productos más vendidos</h2>
          {topProducts.length === 0 ? (
            <p className="font-label text-xs text-outline tracking-widest uppercase">Sin datos de ventas aún</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map(([, data], i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-label text-xs text-on-surface-variant truncate max-w-[70%]">{data.name}</span>
                    <span className="font-label text-xs font-bold text-primary">{data.qty} uds</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-highest">
                    <div className="h-full bg-primary transition-all" style={{ width: `${(data.qty / maxQty) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/20">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
          <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline">Pedidos recientes</h2>
          <Link href="/admin/orders" className="font-label text-xs tracking-widest uppercase text-primary hover:text-on-primary-container transition-colors">Ver todos →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <span className="font-label text-xs text-outline tracking-widest uppercase">No hay pedidos aún</span>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-surface-container-high transition-colors">
                <div>
                  <div className="font-label text-xs font-bold text-on-surface tracking-widest">{order.id}</div>
                  <div className="font-label text-xs text-outline mt-0.5">{order.customer.name} · {formatDate(order.createdAt)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-label text-[10px] tracking-widest uppercase px-2 py-1 border ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                  <span className="font-headline font-bold text-sm text-primary">{formatCOP(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="inventory_2" label="Total productos" value={products.length.toString()} />
        <StatCard icon="warning" label="Stock bajo" value={products.filter((p) => p.status === "low-stock").length.toString()} accent="text-yellow-400" />
        <StatCard icon="block" label="Sin stock" value={products.filter((p) => p.status === "out-of-stock").length.toString()} accent="text-error" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent = "text-primary", small = false }: { icon: string; label: string; value: string; accent?: string; small?: boolean }) {
  return (
    <div className="bg-surface-container-low border border-outline-variant/20 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className={`material-symbols-outlined text-[20px] ${accent}`}>{icon}</span>
        <span className="font-label text-[10px] tracking-[0.2em] uppercase text-outline">{label}</span>
      </div>
      <div className={`font-headline font-black tracking-tight ${accent} ${small ? "text-xl" : "text-3xl"}`}>{value}</div>
    </div>
  );
}
