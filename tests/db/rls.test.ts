import { beforeAll, describe, expect, it } from "vitest";
import { createAnonClient } from "./supabase";

describe("rls defaults", () => {
  let client: ReturnType<typeof createAnonClient>;

  beforeAll(() => {
    client = createAnonClient();
  });

  it("blocks anonymous reads from orders", async () => {
    const { data, error } = await client.from("orders").select("id").limit(1);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("blocks anonymous writes to products", async () => {
    const { error } = await client.from("products").insert({
      name: "Produto teste",
      slug: "produto-teste",
      pet_type: "dog",
      age_group: "adult",
      size_group: "small",
      sort_order: 0,
      is_active: true,
      is_featured: false,
      is_promotion: false,
    });

    expect(error).not.toBeNull();
  });
});
