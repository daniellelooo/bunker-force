import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Devoluciones y Garantías",
  description:
    "Política de devoluciones, cambios y garantía de Bunker Force Bello. Conoce tus derechos como consumidor conforme a la Ley 1480 de Colombia.",
  robots: { index: true, follow: true },
};

export default function DevolucionesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      {/* Header */}
      <div>
        <span className="font-label text-xs tracking-[0.25em] text-primary uppercase">
          Información legal
        </span>
        <h1 className="font-headline font-black text-4xl uppercase tracking-tighter mt-2">
          Devoluciones y Garantías
        </h1>
        <p className="font-body text-sm text-outline mt-2">
          Última actualización: marzo de 2026
        </p>
      </div>

      {/* Resumen visual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "undo", label: "Retracto", value: "5 días hábiles" },
          { icon: "swap_horiz", label: "Cambios", value: "15 días" },
          { icon: "verified_user", label: "Garantía", value: "6 meses" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-surface-container-low border border-outline-variant/20 p-5 text-center"
          >
            <span className="material-symbols-outlined text-3xl text-primary mb-2 block">
              {item.icon}
            </span>
            <p className="font-label text-[10px] tracking-widest uppercase text-outline mb-1">
              {item.label}
            </p>
            <p className="font-headline font-black text-lg text-on-surface">{item.value}</p>
          </div>
        ))}
      </div>

      <Section title="1. Derecho de retracto (Ley 1480)">
        <p>
          Si compraste por nuestra tienda web, tienes <strong>5 días hábiles</strong> a partir
          de la fecha en que recibiste el producto para arrepentirte de la compra sin necesidad
          de dar explicaciones, conforme al Artículo 47 del Estatuto del Consumidor de Colombia.
        </p>
        <p>
          Para ejercer este derecho el producto debe:
        </p>
        <ul>
          <li>Estar sin usar y en perfectas condiciones</li>
          <li>Conservar las etiquetas originales</li>
          <li>Estar en su empaque original (si aplica)</li>
        </ul>
        <p>
          <strong>No aplica</strong> para prendas que hayan sido usadas, lavadas o alteradas.
        </p>
      </Section>

      <Section title="2. Cambios de talla o color">
        <p>
          Aceptamos cambios de talla o color dentro de los <strong>15 días calendario</strong>{" "}
          siguientes a la entrega, siempre que:
        </p>
        <ul>
          <li>El producto no haya sido usado</li>
          <li>Conserve sus etiquetas y empaque</li>
          <li>Tengamos disponibilidad en la talla/color solicitado</li>
        </ul>
        <p>
          Los cambios de productos comprados en <strong>tienda física</strong> deben realizarse
          directamente en nuestro local en Bello, Antioquia, dentro del mismo plazo.
        </p>
      </Section>

      <Section title="3. Garantía por defecto de fabricación">
        <p>
          Todos nuestros productos tienen <strong>6 meses de garantía</strong> contra defectos
          de fabricación (costuras rotas, cremalleras defectuosas, telas con falla de origen,
          etc.).
        </p>
        <p>
          La garantía <strong>no cubre</strong> el desgaste normal por uso, daños por mal
          manejo, ni alteraciones realizadas al producto.
        </p>
      </Section>

      <Section title="4. Proceso para solicitar devolución o cambio">
        <ol>
          <li>
            Contáctanos por WhatsApp con tu <strong>número de pedido</strong> y una foto del
            producto.
          </li>
          <li>Te indicaremos el punto de entrega o coordinaremos la recolección.</li>
          <li>
            Una vez recibido y verificado el estado del producto, procesamos el cambio o
            reembolso en un plazo máximo de <strong>5 días hábiles</strong>.
          </li>
        </ol>
        <p>
          Los costos de envío para devoluciones por garantía o defecto corren por nuestra
          cuenta. Para cambios voluntarios (talla, color) el costo de envío corre por cuenta
          del cliente.
        </p>
      </Section>

      <Section title="5. Reembolsos">
        <p>
          Los reembolsos se realizan por el mismo medio de pago utilizado (transferencia, Nequi,
          Daviplata o efectivo según el caso) dentro de los <strong>5 días hábiles</strong>{" "}
          siguientes a la aprobación de la devolución.
        </p>
      </Section>

      <div className="bg-surface-container-low border border-primary/30 p-6">
        <p className="font-label text-xs tracking-widest uppercase text-primary mb-2">
          ¿Tienes un problema con tu pedido?
        </p>
        <p className="font-body text-sm text-on-surface-variant mb-4">
          Escríbenos por WhatsApp y te ayudamos de inmediato. También puedes revisar las{" "}
          <Link href="/faq" className="text-primary hover:underline">
            preguntas frecuentes
          </Link>
          .
        </p>
        <a
          href="https://wa.me/573001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-3 font-headline font-black text-xs tracking-widest uppercase hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">chat</span>
          Contactar por WhatsApp
        </a>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-headline font-black text-lg uppercase tracking-widest text-primary">
        {title}
      </h2>
      <div className="font-body text-sm text-on-surface-variant leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_strong]:text-on-surface">
        {children}
      </div>
    </section>
  );
}
