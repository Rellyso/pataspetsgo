"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  adminOrderStatusUpdateSchema,
  getAdminOrderStatusLabel,
} from "@/lib/validations/admin-orders";
import type { TablesUpdate } from "@/types/database";

type UpdateOrderStatusResult = {
  success: boolean;
  message: string;
};

export async function updateOrderStatusAction(input: unknown): Promise<UpdateOrderStatusResult> {
  await requireAdmin("/admin/pedidos");
  const supabase = await getSupabaseServerClient();
  const parsed = adminOrderStatusUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Revise o status selecionado antes de salvar.",
    };
  }

  const { orderId, status } = parsed.data;

  const { data: currentOrder, error: currentOrderError } = await supabase
    .from("orders")
    .select("id, order_number, status")
    .eq("id", orderId)
    .maybeSingle();

  if (currentOrderError) {
    return {
      success: false,
      message: "Não foi possível carregar o pedido agora.",
    };
  }

  if (!currentOrder) {
    return {
      success: false,
      message: "Pedido não encontrado.",
    };
  }

  if (currentOrder.status === status) {
    return {
      success: true,
      message: `O pedido ${currentOrder.order_number} já está como ${getAdminOrderStatusLabel(status).toLowerCase()}.`,
    };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status,
    } satisfies TablesUpdate<"orders">)
    .eq("id", orderId);

  if (error) {
    return {
      success: false,
      message: "Não foi possível atualizar o status do pedido.",
    };
  }

  revalidatePath("/admin/pedidos");

  return {
    success: true,
    message: `Status do pedido ${currentOrder.order_number} atualizado para ${getAdminOrderStatusLabel(status).toLowerCase()}.`,
  };
}
