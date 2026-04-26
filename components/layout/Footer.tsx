import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/faq", label: "PREGUNTAS FRECUENTES" },
  { href: "/devoluciones", label: "DEVOLUCIONES Y GARANTÍAS" },
  { href: "/privacidad", label: "POLÍTICA DE PRIVACIDAD" },
  { href: "/sobre-nosotros", label: "SOBRE NOSOTROS" },
];

export function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Fila principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Marca */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Bunker Force Bello"
                width={160}
                height={64}
                className="object-contain"
              />
            </div>
            <p className="font-label text-sm text-on-surface-variant leading-relaxed">
              La tienda táctica del norte
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="font-label text-xs font-black tracking-widest text-primary uppercase mb-4">
              NAVEGACIÓN
            </p>
            <div className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-label text-sm tracking-wide uppercase text-tertiary hover:text-on-surface transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Horario */}
          <div>
            <p className="font-label text-xs font-black tracking-widest text-primary uppercase mb-4">
              HORARIO DE ATENCIÓN
            </p>
            <div className="space-y-2 font-label text-sm text-on-surface-variant">
              <div className="flex justify-between gap-4">
                <span>Lun – Vie</span>
                <span className="text-on-surface-variant">10:30 am - 7:00 pm</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Sábado</span>
                <span className="text-on-surface-variant">10:30 am - 8:00 pm</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Domingo</span>
                <span className="text-on-surface-variant">Cerrado</span>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant/30">
                <p className="text-sm tracking-wide flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{fontSize:"14px"}}>location_on</span>
                  Calle 50A 50 56 Local 6, Bello, Antioquia
                </p>
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div>
            <p className="font-label text-xs font-black tracking-widest text-primary uppercase mb-4">
              SÍGUENOS
            </p>
            <div className="flex flex-col gap-3">
              {[
                { href: "https://www.instagram.com/bunkerforcebello/", name: "Instagram", handle: "@bunkerforcebello" },
                { href: "https://www.facebook.com/p/Bunker-Force-61557558009886/", name: "Facebook", handle: "Bunker Force Bello" },
                { href: "https://wa.me/573244283082", name: "WhatsApp", handle: "3244283082" },
              ].map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3"
                >
                  <span className="font-label text-xs tracking-widest uppercase text-on-surface-variant w-20">
                    {social.name}
                  </span>
                  <span className="font-label text-sm text-tertiary group-hover:text-primary transition-colors">
                    {social.handle}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-label tracking-widest uppercase text-on-surface-variant opacity-70">
            © 2024 BUNKER FORCE BELLO. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <p className="text-xs font-label tracking-widest uppercase text-on-surface-variant opacity-50">
            EQUIPAMIENTO ESPECIFICADO — BELLO, ANT.
          </p>
        </div>
      </div>
    </footer>
  );
}
