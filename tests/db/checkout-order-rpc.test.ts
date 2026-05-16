import { beforeAll, describe, expect, it } from "vitest";

import { createServiceRoleClient } from "./supabase";

describe("checkout order RPC", () => {
  let client: ReturnType<typeof createServiceRoleClient>;

  beforeAll(() => {
    client = createServiceRoleClient();
  });

  it("creates a pending order and its order_items in one call", async () => {
    const { data: variant } = await client
      .from("product_variants")
      .select("id, product_id, name, price, promotional_price")
      .eq("sku", "GRANPLUS-ADULTO-20KG")
      .maybeSingle();

    expect(variant).toBeTruthy();

    const unitPrice = variant?.promotional_price ?? variant?.price ?? 0;

    const { data, error } = await client.rpc("create_order_with_items", {
      p_address: null,
      p_customer_name: "Cliente Teste",
      p_customer_phone: "5585999990000",
      p_delivery_type: "pickup",
      p_items: [
        {
          product_id: variant?.product_id,
          product_name: "GranPlus Adulto",
          product_variant_id: variant?.id,
          quantity: 2,
          total_price: unitPrice * 2,
          unit_price: unitPrice,
          variant_name: variant?.name,
        },
      ],
      p_notes: "Sem observacoes",
      p_total_estimated: unitPrice * 2,
      p_whatsapp_message: "Pedido de teste",
    });

    expect(error).toBeNull();
    expect(data?.length).toBe(1);
    expect(data?.[0]?.order_number).toMatch(/^PP-\d{4}-\d{4}$/);

    const orderId = data?.[0]?.order_id;
    expect(orderId).toBeTruthy();

    const { data: order } = await client
      .from("orders")
      .select("status, total_estimated, whatsapp_message")
      .eq("id", orderId ?? "")
      .maybeSingle();

    const { data: orderItems } = await client
      .from("order_items")
      .select("quantity, unit_price, total_price")
      .eq("order_id", orderId ?? "");

    expect(order?.status).toBe("pending");
    expect(order?.total_estimated).toBe(unitPrice * 2);
    expect(order?.whatsapp_message).toBe("Pedido de teste");
    expect(orderItems).toHaveLength(1);
    expect(orderItems?.[0]?.quantity).toBe(2);
    expect(orderItems?.[0]?.unit_price).toBe(unitPrice);
    expect(orderItems?.[0]?.total_price).toBe(unitPrice * 2);
  });
});
