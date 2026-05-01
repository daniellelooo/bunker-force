"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { OrderCustomer } from "@/lib/types";

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyCustomer: OrderCustomer = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  notes: "",
};

type FieldErrors = Partial<Record<keyof OrderCustomer, string>>;

function validateField(key: keyof OrderCustomer, value: string): string {
  switch (key) {
    case "name":
      if (!value.trim()) return "El nombre es obligatorio";
      if (value.trim().length < 2) return "Mínimo 2 caracteres";
      if (value.trim().length > 100) return "Máximo 100 caracteres";
      return "";
    case "phone":
      if (!value.trim()) return "El teléfono es obligatorio";
      if (!PHONE_RE.test(value.trim())) return "Ingresa un número válido (ej: 3001234567)";
      return "";
    case "email":
      if (value.trim() && !EMAIL_RE.test(value.trim())) return "Correo inválido";
      return "";
    case "address":
      if (!value.trim()) return "La dirección es obligatoria";
      if (value.trim().length < 5) return "Ingresa una dirección completa";
      return "";
    case "city":
      if (!value.trim()) return "La ciudad es obligatoria";
      if (value.trim().length < 2) return "Mínimo 2 caracteres";
      return "";
    default:
      return "";
  }
}

function validateAll(customer: OrderCustomer): FieldErrors {
  const errors: FieldErrors = {};
  (Object.keys(customer) as (keyof OrderCustomer)[]).forEach((key) => {
    const msg = validateField(key, customer[key] ?? "");
    if (msg) errors[key] = msg;
  });
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch, cartSubtotal, cartTax, cartTotal } = useCart();
  const [customer, setCustomer] = useState<OrderCustomer>(emptyCustomer);
  const [touched, setTouched] = useState<Partial<Record<keyof OrderCustomer, boolean>>>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function setField(key: keyof OrderCustomer, value: string) {
    setCustomer((prev) => ({ ...prev, [key]: value }));
    // Limpiar error del campo mientras escribe si ya estaba tocado
    if (touched[key]) {
      const msg = validateField(key, value);
      setFieldErrors((prev) => ({ ...prev, [key]: msg }));
    }
  }

  function handleBlur(key: keyof OrderCustomer) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const msg = validateField(key, customer[key] ?? "");
    setFieldErrors((prev) => ({ ...prev, [key]: msg }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.items.length === 0) return;

    // Marcar todos los campos como tocados y validar
    const allTouched = Object.fromEntries(
      (Object.keys(emptyCustomer) as (keyof OrderCustomer)[]).map((k) => [k, true])
    ) as Record<keyof OrderCustomer, boolean>;
    setTouched(allTouched);

    const errors = validateAll(customer);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setServerError("");

    const orderPayload = {
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || undefined,
        address: customer.address.trim(),
        city: customer.city.trim(),
        notes: customer.notes?.trim() || undefined,
      },
      items: state.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        price: item.price,
        image: item.image,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
      })),
      subtotal: cartSubtotal,
      tax: cartTax,
      total: cartTotal,
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    if (res.ok) {
      const order = await res.json();
      dispatch({ type: "CLEAR_CART" });
      router.push(`/checkout/success?id=${order.id}`);
    } else {
      const data = await res.json().catch(() => ({}));
      const firstDetail = Array.isArray(data.details) && data.details[0]?.message;
      setServerError(firstDetail || data.error || "Hubo un error al procesar tu pedido. Por favor intenta de nuevo.");
    }
    setSubmitting(false);
  }

  if (state.items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-24 text-center">
        <p className="font-label text-xs text-outline tracking-widest uppercase mb-4">
          Tu carrito está vacío
        </p>
        <button
          onClick={() => router.push("/catalog")}
          className="font-label text-xs text-primary hover:underline tracking-widest uppercase"
        >
          ← Ver catálogo
        </button>
      </div>
    );
  }

  const hasErrors = Object.values(fieldErrors).some(Boolean);

  function inputCls(key: keyof OrderCustomer) {
    const hasError = touched[key] && fieldErrors[key];
    return [
      "w-full bg-surface-container px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline/50 focus:outline-none transition-colors border",
      hasError
        ? "border-error focus:border-error"
        : "border-outline-variant/40 focus:border-primary",
    ].join(" ");
  }

  const labelCls = "block font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-1.5";
  const errorCls = "mt-1.5 font-label text-[10px] tracking-widest text-error flex items-center gap-1";

  function FieldError({ field }: { field: keyof OrderCustomer }) {
    if (!touched[field] || !fieldErrors[field]) return null;
    return (
      <p className={errorCls}>
        <span className="material-symbols-outlined text-[12px]">error</span>
        {fieldErrors[field]}
      </p>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <header className="mb-12">
        <span className="font-label text-primary tracking-[0.2em] text-xs font-bold uppercase block mb-2">
          Confirmación de pedido
        </span>
        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
          Checkout
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="bg-surface-container-low border border-outline-variant/20 p-6 space-y-5">
            <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline">
              Datos de entrega
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label className={labelCls}>Nombre completo *</label>
                <input
                  className={inputCls("name")}
                  value={customer.name}
                  onChange={(e) => setField("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="Juan García"
                  autoComplete="name"
                />
                <FieldError field="name" />
              </div>

              {/* Teléfono */}
              <div>
                <label className={labelCls}>Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  className={inputCls("phone")}
                  value={customer.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="3001234567"
                  maxLength={20}
                  autoComplete="tel"
                />
                <FieldError field="phone" />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className={labelCls}>Email (opcional)</label>
                <input
                  type="email"
                  className={inputCls("email")}
                  value={customer.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                />
                <FieldError field="email" />
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className={labelCls}>Dirección de entrega *</label>
                <input
                  className={inputCls("address")}
                  value={customer.address}
                  onChange={(e) => setField("address", e.target.value)}
                  onBlur={() => handleBlur("address")}
                  placeholder="Calle 123 #45-67, Barrio..."
                  autoComplete="street-address"
                />
                <FieldError field="address" />
              </div>

              {/* Ciudad */}
              <div>
                <label className={labelCls}>Ciudad *</label>
                <input
                  className={inputCls("city")}
                  value={customer.city}
                  onChange={(e) => setField("city", e.target.value)}
                  onBlur={() => handleBlur("city")}
                  placeholder="Medellín"
                  autoComplete="address-level2"
                />
                <FieldError field="city" />
              </div>

              {/* Notas */}
              <div>
                <label className={labelCls}>Notas adicionales</label>
                <input
                  className={inputCls("notes")}
                  value={customer.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  placeholder="Instrucciones especiales para la entrega..."
                />
              </div>
            </div>
          </div>

          {serverError && (
            <div className="bg-error/10 border border-error/30 px-4 py-3 flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-error mt-0.5">error</span>
              <p className="font-label text-xs text-error tracking-widest">{serverError}</p>
            </div>
          )}

          <div className="bg-surface-container-low border border-outline-variant/20 p-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-outline mt-0.5">
                info
              </span>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                Recibirás confirmación de tu pedido vía{" "}
                <strong className="text-on-surface">WhatsApp o llamada</strong>.
                El pago se coordina directamente con nuestro equipo (transferencia,
                Nequi, Daviplata o efectivo).
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || (Object.keys(touched).length > 0 && hasErrors)}
            className="w-full bg-primary hover:bg-primary-container text-on-primary py-5 px-8 font-headline font-black tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between group text-sm"
          >
            <span>{submitting ? "PROCESANDO..." : "CONFIRMAR PEDIDO"}</span>
            {!submitting && (
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            )}
          </button>
        </form>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="bg-surface-container-low border border-outline-variant/20 p-6 sticky top-24">
            <h2 className="font-headline font-black text-sm uppercase tracking-widest text-outline mb-5">
              Tu pedido
            </h2>

            <div className="space-y-4 mb-6">
              {state.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover bg-surface-container-high shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-label text-xs font-bold text-on-surface leading-tight">
                      {item.name}
                    </div>
                    <div className="font-label text-[10px] text-outline mt-0.5 tracking-widest">
                      {item.selectedSize && `TALLA ${item.selectedSize} · `}
                      CANT {item.quantity}
                    </div>
                  </div>
                  <div className="font-label text-xs font-bold text-primary shrink-0">
                    {formatCOP(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-outline-variant/20 pt-4">
              <div className="flex justify-between font-label text-xs">
                <span className="text-outline uppercase tracking-widest">Subtotal</span>
                <span>{formatCOP(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between border-t border-outline-variant/20 pt-2 mt-2">
                <span className="font-headline font-black text-xs uppercase tracking-widest">Total</span>
                <span className="font-headline font-black text-xl text-primary">
                  {formatCOP(cartTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
