import { NextRequest } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Product } from "@/lib/types";
import { validateProduct } from "@/lib/validation";

const productsPath = join(process.cwd(), "data", "products.json");

function getProducts(): Product[] {
  return JSON.parse(readFileSync(productsPath, "utf-8"));
}

function saveProducts(products: Product[]) {
  writeFileSync(productsPath, JSON.stringify(products, null, 2), "utf-8");
}

export async function GET() {
  const products = getProducts();
  return Response.json(products);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo de la solicitud no es JSON válido" }, { status: 400 });
  }

  const validation = validateProduct(body);
  if (!validation.ok) return validation.toResponse();

  const products = getProducts();
  const newProduct: Product = {
    ...(body as Omit<Product, "id">),
    id: Date.now().toString(),
  };

  products.push(newProduct);
  saveProducts(products);

  return Response.json(newProduct, { status: 201 });
}
