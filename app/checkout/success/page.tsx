"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("id");

  return (
    <div className="max-w-[600px] mx-auto text-center space-y-8">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-tertiary/40 mx-auto">
        <span className="material-symbols-outlined text-4xl text-tertiary">
          check_circle
        </span>
      </div>

      {/* Heading */}
      <div>
        <span className="font-label text-xs tracking-[0.25em] text-primary uppercase block mb-3">
          Pedido registrado exitosamente
        </span>
        <h1 className="font-headline font-black text-5xl uppercase tracking-tighter leading-none">
          ¡Recibido!
        </h1>
      </div>

      {orderId && (
        <div className="bg-surface-container-low border border-outline-variant/20 py-4 px-6 inline-block">
          <div className="font-label text-[10px] tracking-[0.25em] uppercase text-outline mb-1">
            Número de pedido
          </div>
          <div className="font-headline font-black text-2xl text-primary tracking-widest">
            {orderId}
          </div>
        </div>
      )}

      <p className="font-body text-on-surface-variant leading-relaxed">
        Nuestro equipo se pondrá en contacto contigo pronto por{" "}
        <strong className="text-on-surface">WhatsApp o llamada</strong> para
        confirmar los detalles de pago y entrega.
      </p>

      <div className="bg-surface-container-low border border-outline-variant/20 p-5 text-left space-y-3">
        <div className="flex items-center gap-2 font-label text-xs tracking-widest uppercase text-outline">
          <span className="material-symbols-outlined text-[16px]">
            schedule
          </span>
          Próximos pasos
        </div>
        <ul className="space-y-2">
          {[
            "Te contactaremos para confirmar disponibilidad",
            "Coordinaremos el método de pago contigo",
            "Preparamos y despachamos tu pedido",
            "Te notificamos cuando esté en camino",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="font-headline font-black text-xs text-primary mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-body text-sm text-on-surface-variant">
                {step}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/catalog"
          className="flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary-container text-on-primary font-headline font-black text-sm tracking-widest uppercase transition-all"
        >
          Seguir comprando
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-4 border border-outline-variant/40 text-outline hover:text-on-surface hover:border-outline font-headline font-black text-sm tracking-widest uppercase transition-all"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-24">
      <Suspense>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
