import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GrainyOverlay } from "@/components/ui/GrainyOverlay";
import { TacticalCorners } from "@/components/ui/TacticalCorners";
import { ShellWrapper } from "@/components/layout/ShellWrapper";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bunkerforcebello.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  title: {
    default: "BUNKER FORCE BELLO | Equipamiento Táctico Urbano",
    template: "%s | BUNKER FORCE BELLO",
  },
  description:
    "Tienda de ropa táctica y equipamiento militar en Colombia. Chaquetas tácticas, pantalones ranger, accesorios militares con envíos a todo el país. Bunker Force Bello — Antioquia.",
  keywords: [
    "ropa táctica Colombia",
    "ropa táctica",
    "equipamiento táctico Colombia",
    "tienda táctica online Colombia",
    "chaqueta táctica Colombia",
    "pantalón táctico Colombia",
    "ropa militar Colombia",
    "equipamiento militar Colombia",
    "tienda militar online",
    "ropa táctica Medellín",
    "ropa táctica Antioquia",
    "ropa táctica Bello",
    "accesorios tácticos Colombia",
    "Bunker Force Bello",
  ],
  authors: [{ name: "Bunker Force Bello" }],
  creator: "Bunker Force Bello",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "BUNKER FORCE BELLO",
    title: "BUNKER FORCE BELLO | Equipamiento Táctico Urbano",
    description:
      "Tienda de ropa y equipamiento táctico en Bello, Antioquia. Chaquetas, pantalones y accesorios militares.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bunker Force Bello — Equipamiento Táctico Urbano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BUNKER FORCE BELLO | Equipamiento Táctico Urbano",
    description:
      "Tienda de ropa y equipamiento táctico en Bello, Antioquia.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bunker Force Bello",
    url: "https://www.bunkerforcebello.com",
    logo: "https://www.bunkerforcebello.com/logo.png",
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Bunker Force Bello",
    description: "Tienda de ropa táctica y equipamiento militar en Colombia. Chaquetas, pantalones y accesorios militares con envíos a todo el país.",
    url: "https://www.bunkerforcebello.com",
    logo: "https://www.bunkerforcebello.com/logo.png",
    image: "https://www.bunkerforcebello.com/og-image.png",
    telephone: "+573024956498",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bello",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    areaServed: {
      "@type": "Country",
      name: "Colombia",
    },
    priceRange: "$$",
    sameAs: [
      "https://www.instagram.com/bunkerforcebello/",
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es-CO"
      className={`dark ${barlowCondensed.variable} ${dmSans.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/img-hero.webp" fetchPriority="high" type="image/webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-surface text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen flex flex-col">
        <Providers>
          <GrainyOverlay />
          <TacticalCorners />
          <ShellWrapper header={<Header />} footer={<Footer />}>
            {children}
          </ShellWrapper>
          <WhatsAppButton />
        </Providers>
        <Script
          id="material-symbols"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block';document.head.appendChild(l);})();`,
          }}
        />
      </body>
    </html>
  );
}
