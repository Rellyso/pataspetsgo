import { beforeAll, describe, expect, it } from "vitest";
import { createServiceRoleClient } from "./supabase";

describe("order number generation", () => {
  let client: ReturnType<typeof createServiceRoleClient>;

  beforeAll(() => {
    client = createServiceRoleClient();
  });

  it("generates a PP-YYYY-XXXX order number", async () => {
    const { data, error } = await client
      .from("orders")
      .insert({
        customer_name: "Teste",
        customer_phone: "5511999999999",
        delivery_type: "pickup",
        address: null,
        notes: "",
        total_estimated: 10,
        whatsapp_message: "Mensagem",
        status: "pending",
      })
      .select("order_number");

    expect(error).toBeNull();
    expect(data?.length).toBe(1);
    expect(data?.[0]?.order_number).toMatch(/^PP-\d{4}-\d{4}$/);
  });
});
