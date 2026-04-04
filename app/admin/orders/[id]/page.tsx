"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

const STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setLoading(false);
          return;
        }
        setOrder(data);
        setNewStatus(data.status);
        setLoading(false);
      });
  }, [id]);

  async function handleStatusUpdate() {
    if (!order) return;
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrder(updated);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="font-label text-xs tracking-widest text-outline uppercase animate-pulse">
          Cargando pedido...
        </span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <span className="font-label text-xs text-error tracking-widest uppercase">
          Pedido no encontrado
        </span>
        <Link
          href="/admin/orders"
          className="font-label text-xs text-primary hover:underline"
        >
          ← Volver a pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link
            href="/admin/orders"
            className="font-label text-xs text-outline hover:text-primary transition-colors tracking-widest uppercase"
          >
            ← Pedidos
          </Link>
          <span className="text-outline">/</span>
          <span className="font-label text-xs text-outline tracking-widest">
            {order.id}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="font-headline font-black text-2xl md:text-4xl uppercase tracking-tighter">
            {order.id}
          </h1>
          <span
            className={`font-label text-[10px] tracking-widest uppercase px-3 py-1.5 border ${STATUS_COLORS[order.status]}`}
          >
            {STATUS_LABELS[order.status]}
          </span>
        </div>
        <p className="font-label text-xs text-outline mt-2 tracking-widest">
          {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: customer + status */}
        <div className="space-y-4">
          {/* Customer info */}
          <div className="bg-surface-container-low border border-outline-variant/20 p-5 space-y-4">
            <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline">
              Datos del cliente
            </h2>
            <div className="space-y-3">
              <InfoRow icon="person" label="Nombre" value={order.customer.name} />
              <InfoRow
                icon="phone"
                label="Teléfono"
                value={
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="text-primary hover:underline"
                  >
                    {order.customer.phone}
                  </a>
                }
              />
              {order.customer.email && (
                <InfoRow
                  icon="email"
                  label="Email"
                  value={
                    <a
                      href={`mailto:${order.customer.email}`}
                      className="text-primary hover:underline"
                    >
                      {order.customer.email}
                    </a>
                  }
                />
              )}
              <InfoRow
                icon="location_on"
                label="Dirección"
                value={`${order.customer.address}, ${order.customer.city}`}
              />
              {order.customer.notes && (
                <InfoRow
                  icon="notes"
                  label="Notas"
                  value={order.customer.notes}
                />
              )}
            </div>

            {/* WhatsApp quick contact */}
            <a
              href={`https://wa.me/${order.customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${order.customer.name}, te contactamos desde BUNKER FORCE BELLO respecto a tu pedido ${order.id}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-label text-xs tracking-widest uppercase hover:bg-[#25D366]/20 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contactar por WhatsApp
            </a>
          </div>

          {/* Status update */}
          <div className="bg-surface-container-low border border-outline-variant/20 p-5 space-y-4">
            <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline">
              Actualizar estado
            </h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="w-full bg-surface-container border border-outline-variant/40 px-3 py-2.5 font-body text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={saving || newStatus === order.status}
              className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary font-headline font-black text-sm tracking-widest uppercase transition-all disabled:opacity-40"
            >
              {saving ? "GUARDANDO..." : "ACTUALIZAR ESTADO"}
            </button>
          </div>
        </div>

        {/* Right: order items + summary */}
        <div className="lg:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-surface-container-low border border-outline-variant/20">
            <div className="px-5 py-4 border-b border-outline-variant/20">
              <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline">
                Productos del pedido
              </h2>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover bg-surface-container-high shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-label text-sm font-bold text-on-surface">
                      {item.name}
                    </div>
                    <div className="font-label text-xs text-outline mt-0.5">
                      SKU: {item.sku}
                      {item.selectedSize && item.selectedSize !== "ÚNICA" && ` · Talla: ${item.selectedSize}`}
                      {item.selectedColor && ` · Color: ${item.selectedColor}`}
                    </div>
                    <div className="font-label text-xs text-on-surface-variant mt-1">
                      Cant. {item.quantity} × {formatCOP(item.price)}
                    </div>
                  </div>
                  <div className="font-headline font-bold text-sm text-primary shrink-0">
                    {formatCOP(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-surface-container-low border border-outline-variant/20 p-5 space-y-3">
            <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline mb-3">
              Resumen del pago
            </h2>
            <div className="flex justify-between font-label text-sm">
              <span className="text-outline uppercase tracking-widest text-xs">
                Subtotal
              </span>
              <span>{formatCOP(order.subtotal)}</span>
            </div>
            <div className="flex justify-between font-label text-sm">
              <span className="text-outline uppercase tracking-widest text-xs">
                IVA (19%)
              </span>
              <span>{formatCOP(order.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-outline-variant/20 pt-3">
              <span className="font-headline font-black text-sm uppercase tracking-widest">
                Total
              </span>
              <span className="font-headline font-black text-2xl text-primary">
                {formatCOP(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-1 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
        {label}
      </div>
      <div className="font-body text-sm text-on-surface pl-5">{value}</div>
    </div>
  );
}
