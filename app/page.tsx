import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { BrandStory } from "@/components/home/BrandStory";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedCarousel products={featuredProducts} />
      <BrandStory />
    </>
  );
}
