import { Resend } from "resend";
import type { Order } from "@/lib/types";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function sendNewOrderNotification(order: Order) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail || !process.env.RESEND_API_KEY) return;

  const itemsHtml = order.items
    .map((item) => {
      const variant = [item.selectedSize, item.selectedColor]
        .filter(Boolean)
        .join(" / ");
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;">
            <strong style="color:#c8f135;">${item.name}</strong><br/>
            <span style="color:#888;font-size:13px;">${variant} · Cant: ${item.quantity}</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;text-align:right;color:#fff;">
            ${formatCOP(item.price * item.quantity)}
          </td>
        </tr>`;
    })
    .join("");

  const whatsappLink = `https://wa.me/${order.customer.phone.replace(/\D/g, "")}`;
  const adminPanelLink = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://bunkerforce.co"}/admin/orders/${order.id}`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"/></head>
    <body style="margin:0;padding:0;background:#0d0d0d;font-family:Arial,sans-serif;color:#fff;">
      <div style="max-width:600px;margin:0 auto;padding:32px 24px;">

        <div style="margin-bottom:32px;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;color:#888;text-transform:uppercase;">Bunker Force Bello</p>
          <h1 style="margin:0;font-size:28px;color:#c8f135;letter-spacing:-1px;">NUEVO PEDIDO</h1>
        </div>

        <div style="background:#1a1a1a;border:1px solid #2a2a2a;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;color:#888;text-transform:uppercase;">Pedido</p>
          <p style="margin:0;font-size:20px;font-weight:bold;color:#c8f135;">${order.id}</p>
          <p style="margin:6px 0 0;font-size:13px;color:#888;">${formatDate(order.createdAt)}</p>
        </div>

        <div style="background:#1a1a1a;border:1px solid #2a2a2a;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 16px;font-size:11px;letter-spacing:2px;color:#888;text-transform:uppercase;">Cliente</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="color:#888;font-size:13px;padding:3px 0;width:90px;">Nombre</td><td style="color:#fff;font-size:14px;">${order.customer.name}</td></tr>
            <tr><td style="color:#888;font-size:13px;padding:3px 0;">Teléfono</td><td style="font-size:14px;"><a href="${whatsappLink}" style="color:#25d366;text-decoration:none;">${order.customer.phone} (WhatsApp)</a></td></tr>
            ${order.customer.email ? `<tr><td style="color:#888;font-size:13px;padding:3px 0;">Email</td><td style="color:#fff;font-size:14px;">${order.customer.email}</td></tr>` : ""}
            <tr><td style="color:#888;font-size:13px;padding:3px 0;">Ciudad</td><td style="color:#fff;font-size:14px;">${order.customer.city}</td></tr>
            <tr><td style="color:#888;font-size:13px;padding:3px 0;">Dirección</td><td style="color:#fff;font-size:14px;">${order.customer.address}</td></tr>
            ${order.customer.notes ? `<tr><td style="color:#888;font-size:13px;padding:3px 0;">Notas</td><td style="color:#fff;font-size:14px;">${order.customer.notes}</td></tr>` : ""}
          </table>
        </div>

        <div style="background:#1a1a1a;border:1px solid #2a2a2a;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 16px;font-size:11px;letter-spacing:2px;color:#888;text-transform:uppercase;">Productos</p>
          <table style="width:100%;border-collapse:collapse;">
            ${itemsHtml}
          </table>
          <div style="margin-top:16px;padding-top:16px;border-top:1px solid #2a2a2a;display:flex;justify-content:space-between;">
            <span style="font-size:13px;color:#888;">TOTAL</span>
            <span style="font-size:22px;font-weight:bold;color:#c8f135;">${formatCOP(order.total)}</span>
          </div>
        </div>

        <div style="text-align:center;">
          <a href="${adminPanelLink}" style="display:inline-block;background:#c8f135;color:#0d0d0d;font-weight:bold;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:14px 28px;text-decoration:none;">
            VER EN PANEL ADMIN →
          </a>
        </div>

      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: "Bunker Force Bello <onboarding@resend.dev>",
    to: adminEmail,
    subject: `🛒 Nuevo pedido ${order.id} — ${formatCOP(order.total)}`,
    html,
  });
}
