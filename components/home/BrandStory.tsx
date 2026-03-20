const stats = [
  { value: "MIL-SPEC", label: "MATERIALES" },
  { value: "10 AÑOS", label: "GARANTÍA" },
  { value: "24/7", label: "SOPORTE TÉCNICO" },
  { value: "LOCAL", label: "FABRICACIÓN NACIONAL" },
];

export function BrandStory() {
  return (
    <section className="bg-surface-container-lowest py-32 relative overflow-hidden">
      {/* Decorative SVG Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#46473F"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-block bg-primary/10 border border-primary px-4 py-1 mb-8">
          <span className="font-label text-primary text-xs tracking-widest uppercase">
            FUNDADOS EN BELLO — DESDE 2024
          </span>
        </div>
        <h2 className="font-headline text-5xl md:text-7xl font-black uppercase mb-8 leading-tight">
          MÁS QUE EQUIPO.<br />ES UN BALUARTE.
        </h2>
        <p className="text-tertiary text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
          Bunker Force Bello no se limita a fabricar ropa. Construimos armaduras
          urbanas. Cada costura, cada cremallera y cada panel reforzado están
          diseñados para resistir las condiciones más extremas sin comprometer
          la movilidad ni la estética técnica.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-outline-variant/30">
          {stats.map((stat) => (
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
  );
}
