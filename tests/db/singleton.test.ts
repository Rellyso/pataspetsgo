import { beforeAll, describe, expect, it } from "vitest";
import { createServiceRoleClient } from "./supabase";

describe("store_settings singleton", () => {
  let client: ReturnType<typeof createServiceRoleClient>;

  beforeAll(() => {
    client = createServiceRoleClient();
  });

  it("rejects a second store_settings row", async () => {
    const { error } = await client.from("store_settings").insert({
      store_name: "Outra loja",
      description: "",
      whatsapp_phone: "5511999999998",
      instagram_url: null,
      address: "Rua 2",
      opening_hours: "Seg a Sex",
      google_maps_url: null,
      delivery_enabled: true,
      pickup_enabled: true,
    });

    expect(error).not.toBeNull();
  });
});
