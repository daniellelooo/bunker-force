import { adminGetAllOrders } from "@/lib/orders";
import { adminGetAllProducts } from "@/lib/products";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [orders, products] = await Promise.all([
    adminGetAllOrders(),
    adminGetAllProducts(),
  ]);
  return <DashboardClient initialOrders={orders} initialProducts={products} />;
}
