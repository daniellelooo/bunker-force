import { getAllProducts } from "@/lib/products";

export async function GET() {
  const products = await getAllProducts();
  return Response.json(products);
}
