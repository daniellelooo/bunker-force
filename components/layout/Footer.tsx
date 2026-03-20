import Link from "next/link";

const footerLinks = [
  { href: "#", label: "GUÍAS TÁCTICAS" },
  { href: "#", label: "DEVOLUCIONES" },
  { href: "#", label: "TÉRMINOS DE SERVICIO" },
  { href: "#", label: "CONTACTO" },
  { href: "/sobre-nosotros", label: "SOBRE NOSOTROS" },
];

const socialLinks = [
  { href: "#", icon: "language", label: "Instagram" },
  { href: "#", icon: "language", label: "Facebook" },
  { href: "#", icon: "language", label: "TikTok" },
  { href: "#", icon: "language", label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Fila principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Marca */}
          <div className="md:col-span-1">
            <div className="text-xl font-headline font-black text-primary mb-4 uppercase">
              BUNKER FORCE BELLO
            </div>
            <p className="font-label text-xs text-outline leading-relaxed">
              Equipamiento táctico urbano fabricado en Bello, Antioquia.
              Construido para resistir. Diseñado para durar.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="font-label text-[10px] font-black tracking-widest text-primary uppercase mb-4">
              NAVEGACIÓN
            </p>
            <div className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-label text-xs tracking-widest uppercase text-tertiary hover:text-on-surface transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Horario */}
          <div>
            <p className="font-label text-[10px] font-black tracking-widest text-primary uppercase mb-4">
              HORARIO DE ATENCIÓN
            </p>
            <div className="space-y-2 font-label text-xs text-outline">
              <div className="flex justify-between gap-4">
                <span>Lun – Vie</span>
                <span className="text-on-surface-variant">8:00 am – 6:00 pm</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Sábado</span>
                <span className="text-on-surface-variant">9:00 am – 2:00 pm</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Domingo</span>
                <span className="text-outline">Cerrado</span>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant/30">
                <p className="text-[10px] tracking-wider">
                  📍 Bello, Antioquia, Colombia
                </p>
                <p className="text-[10px] tracking-wider mt-1">
                  📞 +57 (604) 000-0000
                </p>
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div>
            <p className="font-label text-[10px] font-black tracking-widest text-primary uppercase mb-4">
              SÍGUENOS
            </p>
            <div className="flex flex-col gap-3">
              {[
                { href: "#", name: "Instagram", handle: "@bunkerforce_bello" },
                { href: "#", name: "Facebook", handle: "Bunker Force Bello" },
                { href: "#", name: "TikTok", handle: "@bunkerforce" },
                { href: "#", name: "WhatsApp", handle: "+57 300 000 0000" },
              ].map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="group flex items-center gap-3"
                >
                  <span className="font-label text-[10px] tracking-widest uppercase text-outline w-20">
                    {social.name}
                  </span>
                  <span className="font-label text-xs text-tertiary group-hover:text-primary transition-colors">
                    {social.handle}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-label tracking-widest uppercase text-outline opacity-60">
            © 2024 BUNKER FORCE BELLO. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <p className="text-[10px] font-label tracking-widest uppercase text-outline opacity-40">
            EQUIPAMIENTO ESPECIFICADO — BELLO, ANT.
          </p>
        </div>
      </div>
    </footer>
  );
}
