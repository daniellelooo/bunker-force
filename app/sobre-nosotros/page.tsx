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
    desc: "Diseñado con militares activos y veteranos. Cada detalle responde a una necesidad real, no a una tendencia de moda.",
  },
  {
    icon: "handshake",
    title: "COMPROMISO TOTAL",
    desc: "Garantía de 10 años en todos nuestros productos. Si falla en el campo, lo reemplazamos. Sin preguntas.",
  },
  {
    icon: "public",
    title: "PRODUCCIÓN LOCAL",
    desc: "Fabricado en Colombia con materiales de grado MIL-SPEC importados. Apoyamos la industria nacional con estándares globales.",
  },
];

const team = [
  {
    name: "Carlos Bello",
    role: "Fundador & Director Táctico",
    bio: "Exoficial del Ejército Nacional con 15 años de experiencia en operaciones especiales. Fundó Bunker Force Bello con la visión de traer equipamiento real al mercado civil.",
  },
  {
    name: "Daniela Ríos",
    role: "Directora de Diseño",
    bio: "Diseñadora industrial especializada en ergonomía de equipos de protección personal. Responsable de que cada prenda combine funcionalidad extrema con estética técnica.",
  },
  {
    name: "Andrés Morales",
    role: "Jefe de Producción",
    bio: "Ingeniero textil con experiencia en manufactura de equipamiento para fuerzas especiales latinoamericanas. Garantiza los estándares MIL-SPEC en cada costura.",
  },
];

const milestones = [
  { year: "2024", event: "Fundación de Bunker Force Bello en Bello, Antioquia." },
  { year: "2024", event: "Lanzamiento de la línea BELLO-01: chaquetas tácticas de grado MIL-SPEC." },
  { year: "2025", event: "Expansión al catálogo completo: pantalones, botas y accesorios de campo." },
  { year: "2025", event: "Más de 500 unidades vendidas a clientes en 12 ciudades de Colombia." },
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
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-[2px] bg-primary" />
            <span className="font-label text-sm tracking-[0.3em] uppercase text-tertiary">
              PROTOCOLO 0 — FUNDADO EN 2024
            </span>
          </div>
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
                Todo empezó en un taller en Bello, Antioquia, donde un exoficial del
                ejército decidió que los colombianos merecían equipamiento táctico de
                verdad — no réplicas baratas ni importaciones genéricas.
              </p>
              <p>
                Cada producto Bunker Force Bello es desarrollado junto a militares
                activos, primeros respondedores y entusiastas del outdoor que exigen
                más que estética. Exigen que su equipo no falle cuando más lo necesitan.
              </p>
              <p>
                Hoy operamos desde Bello con distribución a todo el país, pero nunca
                olvidamos de dónde venimos: del campo, de la calle, de la necesidad real.
              </p>
            </div>
          </div>

          {/* Línea de tiempo */}
          <div className="space-y-0">
            <h3 className="font-label text-xs tracking-widest font-bold mb-8 text-primary uppercase">
              LÍNEA DE TIEMPO
            </h3>
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 relative">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-primary bg-surface flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-primary" />
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-[2px] flex-1 bg-outline-variant/30 my-1" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="font-headline text-primary font-black text-sm tracking-widest">
                    {m.year}
                  </span>
                  <p className="text-on-surface-variant text-sm leading-relaxed mt-1">
                    {m.event}
                  </p>
                </div>
              </div>
            ))}
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

      {/* Equipo */}
      <section className="py-24 bg-surface px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-headline text-4xl font-black uppercase tracking-tight">
              EL EQUIPO
            </h2>
            <div className="h-1 w-24 bg-primary mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-surface-container-low p-8 border border-outline-variant/20 hover:border-primary/40 transition-colors"
              >
                <div className="w-16 h-16 bg-surface-container-high border border-outline-variant flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl text-primary">person</span>
                </div>
                <h3 className="font-headline text-xl font-black uppercase mb-1">
                  {member.name}
                </h3>
                <p className="font-label text-xs tracking-widest text-primary uppercase mb-4">
                  {member.role}
                </p>
                <p className="text-sm text-outline leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-surface-container-lowest px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-outline-variant/30">
            {[
              { value: "MIL-SPEC", label: "MATERIALES" },
              { value: "10 AÑOS", label: "GARANTÍA" },
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
