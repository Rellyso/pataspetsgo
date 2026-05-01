import { beforeAll, describe, expect, it } from "vitest";
import { createServiceRoleClient } from "./supabase";

describe("seed data", () => {
  let client: ReturnType<typeof createServiceRoleClient>;

  beforeAll(() => {
    client = createServiceRoleClient();
  });

  it("creates a single store_settings row", async () => {
    const { count, error } = await client.from("store_settings").select("id", {
      count: "exact",
    });

    expect(error).toBeNull();
    expect(count).toBe(1);
  });

  it("populates at least one category and brand", async () => {
    const { count: categoryCount, error: categoryError } = await client
      .from("categories")
      .select("id", { count: "exact" });

    const { count: brandCount, error: brandError } = await client
      .from("brands")
      .select("id", { count: "exact" });

    expect(categoryError).toBeNull();
    expect(brandError).toBeNull();
    expect(categoryCount).toBeGreaterThan(0);
    expect(brandCount).toBeGreaterThan(0);
  });
});
