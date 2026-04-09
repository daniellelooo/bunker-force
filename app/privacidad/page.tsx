import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Conoce cómo Bunker Force Bello recolecta, usa y protege tus datos personales conforme a la Ley 1581 de Colombia.",
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      {/* Header */}
      <div>
        <span className="font-label text-xs tracking-[0.25em] text-primary uppercase">
          Información legal
        </span>
        <h1 className="font-headline font-black text-4xl uppercase tracking-tighter mt-2">
          Política de Privacidad
        </h1>
        <p className="font-body text-sm text-outline mt-2">
          Última actualización: marzo de 2026
        </p>
      </div>

      <Section title="1. ¿Quién recolecta tus datos?">
        <p>
          <strong>Bunker Force Bello</strong>, tienda de equipamiento táctico ubicada en Bello,
          Antioquia, Colombia, es responsable del tratamiento de los datos personales que nos
          proporcionas al realizar una compra o contactarnos.
        </p>
        <p>
          Para ejercer cualquier derecho sobre tus datos puedes escribirnos a través del botón
          de WhatsApp en nuestra página o llamarnos al número de contacto indicado en el footer.
        </p>
      </Section>

      <Section title="2. ¿Qué datos recolectamos?">
        <p>Al realizar un pedido recolectamos únicamente los datos necesarios para procesarlo:</p>
        <ul>
          <li>Nombre completo</li>
          <li>Número de teléfono / WhatsApp</li>
          <li>Correo electrónico (opcional)</li>
          <li>Dirección de entrega</li>
          <li>Ciudad</li>
        </ul>
        <p>
          No recolectamos datos bancarios, contraseñas ni información sensible. Los pagos se
          coordinan directamente entre el cliente y nuestra tienda por medios como transferencia,
          Nequi, Daviplata o efectivo.
        </p>
      </Section>

      <Section title="3. ¿Para qué usamos tus datos?">
        <ul>
          <li>Procesar y coordinar la entrega de tu pedido</li>
          <li>Contactarte por WhatsApp o llamada para confirmar disponibilidad y pago</li>
          <li>Resolver dudas o inconvenientes relacionados con tu compra</li>
        </ul>
        <p>
          <strong>No compartimos</strong> tus datos con terceros ni los usamos para publicidad
          sin tu consentimiento.
        </p>
      </Section>

      <Section title="4. Tus derechos (Ley 1581 de 2012)">
        <p>
          Conforme a la Ley de Protección de Datos Personales de Colombia, tienes derecho a:
        </p>
        <ul>
          <li><strong>Conocer</strong> qué datos tuyos tenemos almacenados</li>
          <li><strong>Actualizar</strong> o corregir tu información</li>
          <li><strong>Solicitar la eliminación</strong> de tus datos de nuestros registros</li>
          <li><strong>Revocar</strong> tu autorización de tratamiento en cualquier momento</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos contáctanos por WhatsApp indicando tu nombre
          y número de pedido.
        </p>
      </Section>

      <Section title="5. Seguridad">
        <p>
          Tomamos medidas razonables para proteger tu información. Sin embargo, ningún sistema es
          100% seguro. Si detectas un uso indebido de tus datos, comunícate con nosotros de
          inmediato.
        </p>
      </Section>

      <Section title="6. Cambios a esta política">
        <p>
          Podemos actualizar esta política ocasionalmente. La fecha de "última actualización" al
          inicio de la página siempre indicará cuándo fue modificada por última vez.
        </p>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-headline font-black text-lg uppercase tracking-widest text-primary">
        {title}
      </h2>
      <div className="font-body text-sm text-on-surface-variant leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-on-surface">
        {children}
      </div>
    </section>
  );
}
