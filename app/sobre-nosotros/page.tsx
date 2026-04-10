import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | BUNKER FORCE BELLO",
  description:
    "Conoce la historia, misión y valores detrás de Bunker Force Bello — equipamiento táctico urbano diseñado para resistir.",
};

const values = [
  {
    icon: "shield",
    title: "PROTECCIÓN REAL",
    desc: "Cada producto pasa pruebas de resistencia extrema antes de llegar a tus manos. No vendemos apariencias, vendemos armadura.",
  },
  {
    icon: "construction",
    title: "INGENIERÍA DE CAMPO",
    desc: "Cada producto es verificado con militares veteranos. Cada detalle responde a una necesidad real, no a una tendencia de moda.",
  },
  {
    icon: "handshake",
    title: "COMPROMISO TOTAL",
    desc: "Garantía en todas nuestras prendas.",
  },
  {
    icon: "public",
    title: "PRODUCCIÓN LOCAL",
    desc: "Fabricado en Colombia con materiales de alta calidad. Apoyamos la industria nacional con estándares globales.",
  },
];

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 bg-surface-container-lowest overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-about" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#46473F" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-about)" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="font-headline text-6xl md:text-8xl font-black uppercase leading-none mb-8 -tracking-widest">
            FORJADOS EN <br />
            <span className="text-primary text-glow">BELLO.</span>
          </h1>
          <p className="text-tertiary text-xl leading-relaxed max-w-2xl">
            Bunker Force Bello nació de una pregunta simple: ¿por qué el equipamiento
            táctico de calidad real era tan difícil de conseguir en Colombia?
            La respuesta se convirtió en nuestra misión.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-24 bg-surface px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-primary/10 border border-primary px-4 py-1 mb-8">
              <span className="font-label text-primary text-xs tracking-widest uppercase">
                NUESTRA HISTORIA
              </span>
            </div>
            <h2 className="font-headline text-4xl font-black uppercase tracking-tight mb-6 leading-tight">
              MÁS QUE ROPA.<br />ES UN ESCUDO.
            </h2>
            <div className="space-y-4 text-on-surface-variant leading-relaxed">
              <p>
                Todo comenzó en Bello, Antioquia, donde nació la idea de crear una marca
                diferente. Un ex suboficial de la Armada identificó la necesidad de
                ofrecer a los colombianos un espacio confiable —tanto físico como
                virtual— donde pudieran acceder a equipamiento táctico de verdad,
                dejando atrás las réplicas baratas y las importaciones genéricas.
              </p>
              <p>
                Cada producto ofrecido en Bunker Force Bello es seleccionado con el
                objetivo de adaptarse a las necesidades reales de quienes lo usan.
                Pensamos en un público amplio: desde personal activo de las fuerzas
                armadas hasta civiles y entusiastas del outdoor, que buscan
                funcionalidad, resistencia y confianza en cada pieza. Nuestro enfoque
                está en ofrecer opciones que respondan a distintos entornos y
                exigencias, sin sacrificar calidad ni propósito.
              </p>
              <p>
                Hoy operamos desde Bello con distribución a todo el país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 bg-surface-container-low px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-headline text-4xl font-black uppercase tracking-tight">
              NUESTROS VALORES
            </h2>
            <div className="h-1 w-24 bg-primary mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {values.map((val) => (
              <div
                key={val.title}
                className="bg-surface-container p-8 border border-outline-variant/20 hover:border-primary transition-colors group"
              >
                <div className="text-primary mb-6">
                  <span className="material-symbols-outlined text-4xl">{val.icon}</span>
                </div>
                <h3 className="font-headline text-lg font-black uppercase mb-3 group-hover:text-primary transition-colors">
                  {val.title}
                </h3>
                <p className="text-sm text-outline leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-surface-container-lowest px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-outline-variant/30">
            {[
              { value: "3 MESES", label: "GARANTÍA" },
              { value: "500+", label: "CLIENTES" },
              { value: "BELLO", label: "FABRICADO EN" },
            ].map((stat) => (
              <div key={stat.value}>
                <div className="text-primary font-headline text-3xl font-black mb-2">
                  {stat.value}
                </div>
                <div className="text-xs font-label text-tertiary uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline text-4xl font-black uppercase text-on-primary mb-4 tracking-tight">
            ¿LISTO PARA EQUIPARTE?
          </h2>
          <p className="text-on-primary/80 mb-8 font-label">
            Explora nuestro catálogo completo de equipamiento táctico.
          </p>
          <a
            href="/catalog"
            className="inline-block bg-on-primary text-primary font-headline font-black px-10 py-5 uppercase tracking-widest hover:bg-primary-fixed transition-all active:scale-95"
          >
            VER CATÁLOGO
          </a>
        </div>
      </section>
    </div>
  );
}
