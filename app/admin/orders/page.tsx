"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  processing: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  delivered: "text-tertiary bg-tertiary/10 border-tertiary/30",
  cancelled: "text-error bg-error/10 border-error/30",
};

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="font-label text-xs tracking-widest text-outline uppercase animate-pulse">
          Cargando pedidos...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="font-label text-xs tracking-[0.25em] text-primary uppercase">
            Gestión de despacho
          </span>
          <h1 className="font-headline font-black text-3xl md:text-4xl uppercase tracking-tighter mt-1">
            Pedidos
          </h1>
        </div>
        <span className="font-label text-xs text-outline tracking-widest">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {(
          ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const
        ).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 font-label text-[10px] tracking-widest uppercase border transition-all ${
              filter === s
                ? "bg-primary text-on-primary border-primary"
                : "border-outline-variant/40 text-outline hover:border-primary hover:text-primary"
            }`}
          >
            {s === "all" ? "Todos" : STATUS_LABELS[s]}
            {s !== "all" && (
              <span className="ml-1.5 opacity-60">
                ({orders.filter((o) => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-surface-container-low border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20">
                {["Pedido", "Fecha", "Cliente", "Teléfono", "Items", "Estado", "Total", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-label text-[10px] tracking-[0.2em] uppercase text-outline whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-surface-container-high transition-colors"
                >
                  <td className="px-4 py-4">
                    <span className="font-label text-xs font-bold text-primary tracking-widest">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-label text-xs text-outline whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-label text-sm text-on-surface">
                      {order.customer.name}
                    </span>
                    <div className="font-label text-xs text-outline mt-0.5">
                      {order.customer.city}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-label text-xs text-on-surface-variant">
                      {order.customer.phone}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-label text-xs text-outline">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} uds
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`font-label text-[10px] tracking-widest uppercase px-2 py-1 border whitespace-nowrap ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-headline font-bold text-sm text-primary whitespace-nowrap">
                      {formatCOP(order.total)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center gap-1 px-3 py-1.5 font-label text-[10px] tracking-widest uppercase border border-outline-variant/40 text-outline hover:text-on-surface hover:border-outline transition-colors whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        visibility
                      </span>
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-4xl text-outline mb-2 block">
              local_shipping
            </span>
            <p className="font-label text-xs text-outline tracking-widest uppercase">
              {filter === "all" ? "No hay pedidos" : `No hay pedidos con estado "${STATUS_LABELS[filter as OrderStatus]}"`}
            </p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-surface-container-low border border-outline-variant/20">
            <span className="material-symbols-outlined text-4xl text-outline mb-2 block">
              local_shipping
            </span>
            <p className="font-label text-xs text-outline tracking-widest uppercase">
              {filter === "all" ? "No hay pedidos" : `Sin pedidos "${STATUS_LABELS[filter as OrderStatus]}"`}
            </p>
          </div>
        ) : (
          filtered.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block bg-surface-container-low border border-outline-variant/20 p-4 hover:bg-surface-container-high transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-label text-xs font-bold text-primary tracking-widest block">
                    {order.id}
                  </span>
                  <span className="font-label text-xs text-outline">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <span
                  className={`font-label text-[10px] tracking-widest uppercase px-2 py-1 border whitespace-nowrap ${STATUS_COLORS[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-label text-sm text-on-surface font-medium">
                    {order.customer.name}
                  </div>
                  <div className="font-label text-xs text-outline mt-0.5">
                    {order.customer.phone} · {order.customer.city}
                  </div>
                  <div className="font-label text-xs text-outline mt-0.5">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} unidades
                  </div>
                </div>
                <div className="flex items-center gap-1 text-outline">
                  <span className="font-headline font-bold text-base text-primary">
                    {formatCOP(order.total)}
                  </span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
