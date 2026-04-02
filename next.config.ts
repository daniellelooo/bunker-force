import type { NextConfig } from "next";

const securityHeaders = [
  // Evita que la página se cargue dentro de un iframe (protege contra clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Evita que el navegador adivine el tipo de archivo (protege contra ataques MIME)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Controla qué información se envía al navegar a otro sitio
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desactiva funciones del navegador que no se usan
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
