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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo de la solicitud no es JSON válido" }, { status: 400 });
  }

  const validation = validateProduct(body);
  if (!validation.ok) return validation.toResponse();

  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return Response.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  products[index] = { ...(body as Product), id };
  saveProducts(products);

  return Response.json(products[index]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) {
    return Response.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  saveProducts(filtered);
  return Response.json({ success: true });
}
