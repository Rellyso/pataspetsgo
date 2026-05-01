import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServiceRoleClient } from "./supabase";

describe("database constraints", () => {
  let client: ReturnType<typeof createServiceRoleClient>;

  beforeAll(() => {
    client = createServiceRoleClient();
  });

  afterAll(async () => {
    await client.auth.signOut();
  });

  it("rejects invalid product variant price", async () => {
    const { data: products, error: productsError } = await client
      .from("products")
      .select("id")
      .limit(1);

    expect(productsError).toBeNull();
    expect(products?.length).toBeGreaterThan(0);

    const productId = products?.[0]?.id;

    const { error } = await client.from("product_variants").insert({
      product_id: productId,
      name: "Invalid price",
      price: -1,
      stock_status: "available",
      sort_order: 0,
      is_active: true,
    });

    expect(error).not.toBeNull();
  });

  it("rejects promotional price greater than price", async () => {
    const { data: products } = await client.from("products").select("id").limit(1);
    const productId = products?.[0]?.id;

    const { error } = await client.from("product_variants").insert({
      product_id: productId,
      name: "Invalid promo",
      price: 10,
      promotional_price: 15,
      stock_status: "available",
      sort_order: 0,
      is_active: true,
    });

    expect(error).not.toBeNull();
  });
});
