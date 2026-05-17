import "server-only";

import { requireAdmin } from "@/lib/server/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AdminDeliveryType,
  AdminOrderFiltersInput,
  AdminOrderStatus,
} from "@/lib/validations/admin-orders";
import type { Tables } from "@/types/database";

import type {
  AdminOrderDetail,
  AdminOrderItemSnapshot,
  AdminOrderListItem,
  AdminOrdersListData,
} from "./types";

type OrderListRow = Pick<
  Tables<"orders">,
  | "id"
  | "order_number"
  | "customer_name"
  | "customer_phone"
  | "delivery_type"
  | "status"
  | "total_estimated"
  | "created_at"
>;

type OrderDetailRow = OrderListRow &
  Pick<Tables<"orders">, "address" | "notes" | "whatsapp_message">;

type OrderItemRow = Pick<
  Tables<"order_items">,
  "id" | "product_name" | "variant_name" | "quantity" | "unit_price" | "total_price"
>;

export async function getAdminOrdersList(
  filters: AdminOrderFiltersInput,
): Promise<AdminOrdersListData> {
  await requireAdmin("/admin/pedidos");
  const supabase = await getSupabaseServerClient();

  let query = supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_phone, delivery_type, status, total_estimated, created_at",
    )
    .order("created_at", { ascending: false });

  if (filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.deliveryType !== "all") {
    query = query.eq("delivery_type", filters.deliveryType);
  }

  if (filters.q) {
    const escapedQuery = escapeLikeValue(filters.q);
    query = query.or(
      `order_number.ilike.%${escapedQuery}%,customer_name.ilike.%${escapedQuery}%,customer_phone.ilike.%${escapedQuery}%`,
    );
  }

  if (filters.from) {
    query = query.gte("created_at", `${filters.from}T00:00:00.000Z`);
  }

  if (filters.to) {
    query = query.lte("created_at", `${filters.to}T23:59:59.999Z`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load admin orders: ${error.message}`);
  }

  return {
    items: (data satisfies OrderListRow[]).map(mapAdminOrderListItem),
    filters,
  };
}

export async function getAdminOrderDetail(orderId: string): Promise<AdminOrderDetail | null> {
  await requireAdmin("/admin/pedidos");
  const supabase = await getSupabaseServerClient();

  const [{ data: orderData, error: orderError }, { data: itemsData, error: itemsError }] =
    await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, order_number, customer_name, customer_phone, delivery_type, status, total_estimated, created_at, address, notes, whatsapp_message",
        )
        .eq("id", orderId)
        .maybeSingle(),
      supabase
        .from("order_items")
        .select("id, product_name, variant_name, quantity, unit_price, total_price")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true }),
    ]);

  if (orderError) {
    throw new Error(`Failed to load admin order detail: ${orderError.message}`);
  }

  if (itemsError) {
    throw new Error(`Failed to load admin order items: ${itemsError.message}`);
  }

  if (!orderData) {
    return null;
  }

  return {
    ...mapAdminOrderListItem(orderData satisfies OrderDetailRow),
    address: orderData.address,
    notes: orderData.notes,
    whatsappMessage: orderData.whatsapp_message,
    items: ((itemsData ?? []) satisfies OrderItemRow[]).map(mapAdminOrderItem),
  };
}

function mapAdminOrderListItem(order: OrderListRow): AdminOrderListItem {
  return {
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    deliveryType: order.delivery_type as AdminDeliveryType,
    status: order.status as AdminOrderStatus,
    totalEstimated: order.total_estimated,
    createdAt: order.created_at,
  };
}

function mapAdminOrderItem(item: OrderItemRow): AdminOrderItemSnapshot {
  return {
    id: item.id,
    productName: item.product_name,
    variantName: item.variant_name,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    totalPrice: item.total_price,
  };
}

function escapeLikeValue(value: string) {
  return value.replaceAll("%", "\\%").replaceAll(",", " ");
}
