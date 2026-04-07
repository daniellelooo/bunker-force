import { NextRequest } from "next/server";
import { adminUpdateProduct, adminDeleteProduct } from "@/lib/products";
import { validateProduct } from "@/lib/validation";
import { isAdminRequest, unauthorizedResponse } from "@/lib/auth";
import type { Product } from "@/lib/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo de la solicitud no es JSON válido" }, { status: 400 });
  }

  const validation = validateProduct(body);
  if (!validation.ok) return validation.toResponse();

  try {
    const updated = await adminUpdateProduct(id, body as Product);
    return Response.json(updated);
  } catch {
    return Response.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest(request))) return unauthorizedResponse();
  const { id } = await params;

  try {
    await adminDeleteProduct(id);
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}
