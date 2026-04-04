import { adminGetAllProducts } from "@/lib/products";
import { ProductsClient } from "@/components/admin/ProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await adminGetAllProducts();
  return <ProductsClient initialProducts={products} />;
}
