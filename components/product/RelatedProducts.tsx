import { getRelatedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ui/ProductCard";

interface RelatedProductsProps {
  currentId: string;
  category: string;
}

export async function RelatedProducts({ currentId, category }: RelatedProductsProps) {
  const related = await getRelatedProducts(currentId, category);

  if (related.length === 0) return null;

  return (
    <section className="mt-24 border-t border-outline-variant/20 pt-16">
      <div className="flex items-center gap-4 mb-10">
        <span className="w-8 h-[2px] bg-primary" />
        <h2 className="font-headline text-3xl md:text-4xl font-black uppercase tracking-wide">
          TAMBIÉN TE PUEDE <span className="text-primary">INTERESAR</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} variant="grid" />
        ))}
      </div>
    </section>
  );
}
