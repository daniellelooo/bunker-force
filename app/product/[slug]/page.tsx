import { notFound } from "next/navigation";
import { getAllSlugs, getProductBySlug } from "@/lib/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { RelatedProducts } from "@/components/product/RelatedProducts";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
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

  const description = `${product.name} — ${price}. ${product.specs[0]?.title ?? ""} ${product.specs[0]?.description ?? ""}`.trim();
  const image = product.images[0]?.src;

  return {
    title: product.name,
    description,
    openGraph: {
      type: "website",
      title: `${product.name} | BUNKER FORCE BELLO`,
      description,
      images: image ? [{ url: image, alt: product.images[0].alt || product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | BUNKER FORCE BELLO`,
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

  return (
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
            <span className="bg-surface-container-highest px-3 py-1 font-label text-[10px] tracking-widest border border-outline-variant/50 uppercase">
              {statusLabels[product.status] ?? product.status}
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
  );
}
