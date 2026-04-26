import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { BrandStory } from "@/components/home/BrandStory";
import { getFeaturedProducts } from "@/lib/products";

async function FeaturedSection() {
  const featuredProducts = await getFeaturedProducts();
  return <FeaturedCarousel products={featuredProducts} />;
}

function FeaturedSkeleton() {
  return (
    <section className="py-24 bg-surface px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-64 bg-surface-container-high animate-pulse mb-16" />
        <div className="flex gap-8 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[320px] h-[480px] bg-surface-container animate-pulse shrink-0" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSection />
      </Suspense>
      <BrandStory />
    </>
  );
}
