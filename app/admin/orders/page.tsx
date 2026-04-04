import { adminGetAllOrders } from "@/lib/orders";
import { OrdersClient } from "@/components/admin/OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await adminGetAllOrders();
  return <OrdersClient initialOrders={orders} />;
}
