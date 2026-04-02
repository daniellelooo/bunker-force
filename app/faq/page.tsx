"use client";

import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    category: "PEDIDOS",
    items: [
      {
        q: "¿Cómo hago un pedido?",
        a: "Agrega los productos que quieres al carrito, elige la talla, y haz clic en 'Confirmar pedido'. Llenas tus datos de entrega y listo. Nuestro equipo te contactará por WhatsApp o llamada para coordinar el pago y la entrega.",
      },
      {
        q: "¿Puedo modificar o cancelar mi pedido?",
        a: "Sí, puedes modificar o cancelar tu pedido mientras no haya sido despachado. Contáctanos lo antes posible por WhatsApp con tu número de pedido y te ayudamos.",
      },
      {
        q: "¿Cómo sé si mi pedido fue recibido?",
        a: "Al completar el formulario de checkout verás una pantalla de confirmación con tu número de pedido (ej: BF-1234567890). Guárdalo. Además, nuestro equipo te contactará en las siguientes horas para confirmar.",
      },
    ],
  },
  {
    category: "PAGOS",
    items: [
      {
        q: "¿Cuáles son los métodos de pago?",
        a: "Aceptamos transferencia bancaria, Nequi, Daviplata y efectivo (para compras en tienda física o contra entrega según disponibilidad). El pago se coordina directamente con nuestro equipo por WhatsApp.",
      },
      {
        q: "¿Tienen pago contra entrega?",
        a: "Dependiendo de la ciudad y el monto del pedido. Consúltanos por WhatsApp antes de hacer tu pedido para confirmar disponibilidad.",
      },
      {
        q: "¿Es seguro comprar en su tienda?",
        a: "Sí. No almacenamos datos bancarios. Los pagos se realizan directamente entre tú y nuestra tienda por medios conocidos como Nequi y Daviplata. Puedes verificar nuestra identidad en nuestras redes sociales.",
      },
    ],
  },
  {
    category: "ENVÍOS",
    items: [
      {
        q: "¿Hacen envíos a toda Colombia?",
        a: "Sí, hacemos envíos a todo el país a través de transportadoras. El costo de envío varía según la ciudad y se te informa antes de confirmar el pedido.",
      },
      {
        q: "¿Cuánto demora el envío?",
        a: "Para Bello y municipios del Área Metropolitana de Medellín: 1 a 2 días hábiles. Para el resto de Colombia: 3 a 7 días hábiles dependiendo de la transportadora y el municipio.",
      },
      {
        q: "¿Puedo recoger mi pedido en la tienda?",
        a: "Sí. Tenemos tienda física en Bello, Antioquia. Puedes hacer tu pedido en línea y recogerlo sin costo de envío, o visitarnos directamente para ver los productos.",
      },
    ],
  },
  {
    category: "PRODUCTOS",
    items: [
      {
        q: "¿Cómo sé qué talla elegir?",
        a: "Nuestras prendas siguen la talla estándar colombiana. Si tienes dudas entre dos tallas, te recomendamos ir a la talla mayor para mayor comodidad táctica. También puedes escribirnos por WhatsApp y te asesoramos según tus medidas.",
      },
      {
        q: "¿Los productos son originales?",
        a: "Todos nuestros productos son fabricados o seleccionados directamente por Bunker Force Bello. No somos distribuidores de marcas externas, sino una marca propia de equipamiento táctico urbano hecho en Colombia.",
      },
      {
        q: "¿Tienen tienda física?",
        a: "Sí, estamos ubicados en Bello, Antioquia. Puedes visitarnos de lunes a viernes de 8:00 am a 6:00 pm y los sábados de 9:00 am a 2:00 pm. Escríbenos por WhatsApp para confirmar la dirección exacta.",
      },
      {
        q: "¿Puedo comprar al por mayor?",
        a: "Sí, manejamos precios especiales para compras por volumen (instituciones, uniformes corporativos, grupos, etc.). Contáctanos por WhatsApp con la cantidad y referencias que necesitas.",
      },
    ],
  },
  {
    category: "DEVOLUCIONES",
    items: [
      {
        q: "¿Puedo devolver un producto?",
        a: "Sí. Tienes 5 días hábiles desde que recibes tu pedido para ejercer el derecho de retracto (Ley 1480). El producto debe estar sin usar, con etiquetas y en su empaque original.",
      },
      {
        q: "¿Hacen cambios de talla?",
        a: "Sí, aceptamos cambios de talla dentro de los 15 días calendario siguientes a la entrega, sujeto a disponibilidad. El producto debe estar sin uso. Consulta nuestra política completa de devoluciones.",
      },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);

  function toggle(key: string) {
    setOpen((prev) => (prev === key ? null : key));
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      {/* Header */}
      <div>
        <span className="font-label text-xs tracking-[0.25em] text-primary uppercase">
          Ayuda
        </span>
        <h1 className="font-headline font-black text-4xl uppercase tracking-tighter mt-2">
          Preguntas Frecuentes
        </h1>
        <p className="font-body text-sm text-outline mt-3">
          ¿No encuentras lo que buscas?{" "}
          <a
            href="https://wa.me/573001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Escríbenos por WhatsApp
          </a>{" "}
          y te respondemos en minutos.
        </p>
      </div>

      {/* FAQs por categoría */}
      {FAQS.map((group) => (
        <div key={group.category} className="space-y-2">
          <p className="font-label text-[10px] tracking-[0.3em] uppercase text-primary mb-4">
            {group.category}
          </p>
          {group.items.map((item, i) => {
            const key = `${group.category}-${i}`;
            const isOpen = open === key;
            return (
              <div
                key={key}
                className="border border-outline-variant/20 bg-surface-container-low"
              >
                <button
                  onClick={() => toggle(key)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                >
                  <span className="font-label text-sm text-on-surface">
                    {item.q}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-primary shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="font-body text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-4">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* CTA */}
      <div className="bg-surface-container-low border border-outline-variant/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-headline font-black text-sm uppercase tracking-widest text-on-surface">
            ¿Sigues con dudas?
          </p>
          <p className="font-body text-xs text-outline mt-1">
            Nuestro equipo responde de lunes a sábado.
          </p>
        </div>
        <a
          href="https://wa.me/573001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-3 font-headline font-black text-xs tracking-widest uppercase hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">chat</span>
          Contactar por WhatsApp
        </a>
      </div>

      {/* Links legales */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-outline-variant/20">
        <Link
          href="/devoluciones"
          className="font-label text-xs tracking-widest uppercase text-primary hover:underline"
        >
          Política de devoluciones →
        </Link>
        <Link
          href="/privacidad"
          className="font-label text-xs tracking-widest uppercase text-primary hover:underline"
        >
          Política de privacidad →
        </Link>
      </div>
    </main>
  );
}
