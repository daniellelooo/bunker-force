import { NextRequest } from "next/server";
import { adminGetAllProducts, adminCreateProduct } from "@/lib/products";
import { validateProduct } from "@/lib/validation";
import { isAdminRequest, unauthorizedResponse } from "@/lib/auth";
import type { Product } from "@/lib/types";

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();
  const products = await adminGetAllProducts();
  return Response.json(products);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo de la solicitud no es JSON válido" }, { status: 400 });
  }

  const validation = validateProduct(body);
  if (!validation.ok) return validation.toResponse();

  try {
    const newProduct = await adminCreateProduct(body as Omit<Product, "id">);
    return Response.json(newProduct, { status: 201 });
  } catch {
    return Response.json({ error: "Error al crear el producto" }, { status: 500 });
  }
}
