import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { effectiveStatus } from "@/lib/status";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { RelatedProducts } from "@/components/product/RelatedProducts";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bunkerforcebello.com";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "No encontrado" };

  const price = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(product.price);

  const description = `Compra ${product.name} en Colombia — ${price}. ${product.specs[0]?.description ?? "Ropa táctica y equipamiento militar de alta calidad. Envíos a todo el país."}`.trim();
  const image = product.images[0]?.src;

  return {
    title: `${product.name} — Ropa Táctica Colombia`,
    description,
    alternates: {
      canonical: `${SITE_URL}/product/${product.slug}`,
    },
    keywords: [
      product.name,
      `${product.name} Colombia`,
      `${product.name} precio`,
      "ropa táctica Colombia",
      "equipamiento táctico",
      "tienda táctica online",
    ],
    openGraph: {
      type: "website",
      title: `${product.name} | Ropa Táctica Colombia | BUNKER FORCE BELLO`,
      description,
      images: image ? [{ url: image, alt: product.images[0].alt || product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Ropa Táctica Colombia | BUNKER FORCE BELLO`,
      description,
      images: image ? [image] : [],
    },
  };
}

const statusLabels: Record<string, string> = {
  available: "DISPONIBLE",
  "low-stock": "ÚLTIMAS UNIDADES",
  "out-of-stock": "AGOTADO",
};

const featureCards = [
  {
    icon: "inventory_2",
    title: "ALMACENAMIENTO MODULAR",
    desc: "Distribución interna para equipos integrados y 6 bolsillos externos de acceso rápido.",
  },
  {
    icon: "thermostat",
    title: "REGULACIÓN TÉRMICA",
    desc: "Ventilación axilar transpirable y forro micro-polar para retención de calor en entornos de baja temperatura.",
  },
  {
    icon: "visibility",
    title: "BAJA VISIBILIDAD",
    desc: "Tela de acabado mate que reduce la reflexión de luz y la firma infrarroja en operaciones de campo.",
  },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.specs[0]?.description ?? product.name,
    image: product.images.map((img) => img.src),
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Bunker Force Bello",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: product.price,
      availability:
        effectiveStatus(product) === "out-of-stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${SITE_URL}/product/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "Bunker Force Bello",
      },
    },
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
    />
    <div className="min-h-screen pt-8 md:pt-12 pb-16 md:pb-24 px-4 md:px-12 max-w-7xl mx-auto">
      {/* Migas de pan */}
      <div className="flex items-center gap-2 mb-8 font-label text-[10px] tracking-[0.2em] uppercase text-outline">
        <a href="/" className="hover:text-primary transition-colors">INICIO</a>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <a href="/catalog" className="hover:text-primary transition-colors">CATÁLOGO</a>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-primary">{product.name.toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Izquierda: Galería */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} badge={product.badge} />
        </div>

        {/* Derecha: Detalles */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-2">
            <span className="font-label text-xs tracking-[0.3em] text-tertiary font-bold">
              SKU: {product.sku}
            </span>
          </div>
          <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-none">
            {product.name.split(" ").slice(0, -1).join(" ")} <br />
            <span className="text-primary">
              {product.name.split(" ").slice(-1)[0]}
            </span>
          </h1>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-headline text-3xl font-light text-on-surface">
              {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(product.price)}
            </span>
            <span className={`px-3 py-1 font-label text-[10px] tracking-widest border uppercase ${
              effectiveStatus(product) === "out-of-stock"
                ? "border-error/30 bg-error/10 text-error"
                : effectiveStatus(product) === "low-stock"
                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                : "border-outline-variant/50 bg-surface-container-highest text-on-surface"
            }`}>
              {statusLabels[effectiveStatus(product)] ?? effectiveStatus(product)}
            </span>
          </div>

          <ProductSpecs specs={product.specs} />
          <AddToCartButton product={product} />
        </div>
      </div>

      <RelatedProducts currentId={product.id} category={product.category} />

      {/* Tarjetas de características secundarias */}
      {product.specs.length === 0 && (
        <section className="mt-32">
          <h2 className="font-headline text-3xl font-black tracking-tighter mb-12 uppercase border-l-8 border-primary pl-6">
            Características del Producto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map((item) => (
              <div key={item.title} className="bg-surface-container p-8 border border-outline-variant/20">
                <div className="text-primary mb-4">
                  <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                </div>
                <h4 className="font-headline text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-outline leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
    </>
  );
}
