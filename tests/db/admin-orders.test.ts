import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createAnonClient, createServiceRoleClient } from "./supabase";

describe("admin orders access", () => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const adminEmail = `orders-admin-${suffix}@example.com`;
  const regularEmail = `orders-regular-${suffix}@example.com`;
  const password = "secret123";

  const serviceClient = createServiceRoleClient();
  const adminClient = createAnonClient();
  const regularClient = createAnonClient();

  let adminUserId = "";
  let regularUserId = "";
  let orderId = "";

  beforeAll(async () => {
    const [adminUserResult, regularUserResult] = await Promise.all([
      serviceClient.auth.admin.createUser({
        email: adminEmail,
        password,
        email_confirm: true,
      }),
      serviceClient.auth.admin.createUser({
        email: regularEmail,
        password,
        email_confirm: true,
      }),
    ]);

    expect(adminUserResult.error).toBeNull();
    expect(regularUserResult.error).toBeNull();

    adminUserId = adminUserResult.data.user?.id ?? "";
    regularUserId = regularUserResult.data.user?.id ?? "";

    const { error: promoteError } = await serviceClient
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", adminUserId);

    expect(promoteError).toBeNull();

    await Promise.all([
      adminClient.auth.signInWithPassword({ email: adminEmail, password }),
      regularClient.auth.signInWithPassword({ email: regularEmail, password }),
    ]);

    const { data: variant } = await serviceClient
      .from("product_variants")
      .select("id, product_id, name, price, promotional_price")
      .eq("sku", "GRANPLUS-ADULTO-20KG")
      .maybeSingle();

    expect(variant).toBeTruthy();

    const unitPrice = variant?.promotional_price ?? variant?.price ?? 0;

    const { data: createdOrder, error: createOrderError } = await serviceClient.rpc(
      "create_order_with_items",
      {
        p_address: "Rua dos Testes, 123",
        p_customer_name: "Cliente Operacional",
        p_customer_phone: "5585999991111",
        p_delivery_type: "delivery",
        p_items: [
          {
            product_id: variant?.product_id,
            product_name: "GranPlus Adulto",
            product_variant_id: variant?.id,
            quantity: 1,
            total_price: unitPrice,
            unit_price: unitPrice,
            variant_name: variant?.name,
          },
        ],
        p_notes: "Entregar no fim da tarde",
        p_total_estimated: unitPrice,
        p_whatsapp_message: "Pedido operacional",
      },
    );

    expect(createOrderError).toBeNull();
    orderId = createdOrder?.[0]?.order_id ?? "";
    expect(orderId).not.toBe("");
  });

  afterAll(async () => {
    await adminClient.auth.signOut();
    await regularClient.auth.signOut();

    if (orderId) {
      await serviceClient.from("orders").delete().eq("id", orderId);
    }

    await Promise.all([
      adminUserId ? serviceClient.auth.admin.deleteUser(adminUserId) : Promise.resolve(),
      regularUserId ? serviceClient.auth.admin.deleteUser(regularUserId) : Promise.resolve(),
    ]);
  });

  it("allows admins to read and update order status", async () => {
    const { data: orders, error: ordersError } = await adminClient
      .from("orders")
      .select("id, status")
      .eq("id", orderId);

    expect(ordersError).toBeNull();
    expect(orders).toHaveLength(1);
    expect(orders?.[0]?.status).toBe("pending");

    const { error: updateError } = await adminClient
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", orderId);

    expect(updateError).toBeNull();

    const { data: updatedOrder, error: updatedOrderError } = await adminClient
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .maybeSingle();

    expect(updatedOrderError).toBeNull();
    expect(updatedOrder?.status).toBe("confirmed");
  });

  it("preserves order item snapshots after status changes", async () => {
    const { data: orderItems, error } = await adminClient
      .from("order_items")
      .select("product_name, variant_name, quantity, unit_price, total_price")
      .eq("order_id", orderId);

    expect(error).toBeNull();
    expect(orderItems).toHaveLength(1);
    expect(orderItems?.[0]?.product_name).toBe("GranPlus Adulto");
    expect(orderItems?.[0]?.variant_name).toBeTruthy();
    expect(orderItems?.[0]?.quantity).toBe(1);
  });

  it("blocks non-admin users from reading or updating orders", async () => {
    const { data: orders, error: readError } = await regularClient
      .from("orders")
      .select("id, status");

    expect(readError).toBeNull();
    expect(orders).toEqual([]);

    const { error: updateError } = await regularClient
      .from("orders")
      .update({ status: "canceled" })
      .eq("id", orderId);

    expect(updateError).toBeNull();

    const { data: unchangedOrder, error: unchangedOrderError } = await serviceClient
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .maybeSingle();

    expect(unchangedOrderError).toBeNull();
    expect(unchangedOrder?.status).toBe("confirmed");
  });
});
