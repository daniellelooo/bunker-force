import { NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/admin-password";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { currentPassword, newPassword } = body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    return Response.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return Response.json(
      { error: "La nueva contraseña debe tener al menos 8 caracteres" },
      { status: 400 }
    );
  }

  // Verificar contraseña actual
  let currentValid = false;

  const { data } = await supabaseAdmin
    .from("admin_config")
    .select("value")
    .eq("key", "password_hash")
    .single();

  if (data?.value) {
    currentValid = await verifyPassword(currentPassword, data.value);
  } else {
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();
    currentValid = !!adminPassword && currentPassword.trim() === adminPassword;
  }

  if (!currentValid) {
    return Response.json({ error: "La contraseña actual es incorrecta" }, { status: 401 });
  }

  // Guardar nueva contraseña hasheada
  const newHash = await hashPassword(newPassword);

  const { error } = await supabaseAdmin
    .from("admin_config")
    .upsert({ key: "password_hash", value: newHash }, { onConflict: "key" });

  if (error) {
    return Response.json({ error: "Error al guardar la contraseña" }, { status: 500 });
  }

  return Response.json({ success: true });
}
