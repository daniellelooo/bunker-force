import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bunkerforce.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BUNKER FORCE BELLO | Equipamiento Táctico Urbano",
    template: "%s | BUNKER FORCE BELLO",
  },
  description:
    "Tienda de ropa y equipamiento táctico en Bello, Antioquia. Chaquetas, pantalones y accesorios militares. Reforzado para el campo, diseñado para la ciudad.",
  keywords: [
    "ropa táctica Bello",
    "equipamiento militar Colombia",
    "chaqueta táctica",
    "ropa militar Antioquia",
    "tienda táctica Medellín",
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
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
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
      </body>
    </html>
  );
}
