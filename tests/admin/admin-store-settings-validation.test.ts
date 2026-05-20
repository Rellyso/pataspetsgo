import { describe, expect, it } from "vitest";

import { adminStoreSettingsSchema } from "@/lib/validations/admin-store-settings";

describe("admin store settings validation", () => {
  it("accepts a valid payload and normalizes optional blanks", () => {
    const parsed = adminStoreSettingsSchema.safeParse({
      id: crypto.randomUUID(),
      storeName: "Patas Pets",
      description: "",
      whatsappPhone: "(85) 99999-0000",
      instagramUrl: "",
      address: "",
      openingHours: "",
      googleMapsUrl: "",
      deliveryEnabled: true,
      pickupEnabled: false,
    });

    expect(parsed.success).toBe(true);

    if (!parsed.success) {
      return;
    }

    expect(parsed.data.description).toBeNull();
    expect(parsed.data.instagramUrl).toBeNull();
    expect(parsed.data.address).toBeNull();
    expect(parsed.data.openingHours).toBeNull();
    expect(parsed.data.googleMapsUrl).toBeNull();
    expect(parsed.data.whatsappPhone).toBe("85999990000");
  });

  it("rejects an invalid whatsapp phone", () => {
    const parsed = adminStoreSettingsSchema.safeParse({
      id: crypto.randomUUID(),
      storeName: "Patas Pets",
      description: null,
      whatsappPhone: "999999999",
      instagramUrl: null,
      address: null,
      openingHours: null,
      googleMapsUrl: null,
      deliveryEnabled: true,
      pickupEnabled: true,
    });

    expect(parsed.success).toBe(false);
    expect(parsed.error?.flatten().fieldErrors.whatsappPhone?.[0]).toBe(
      "Informe um WhatsApp válido com DDD.",
    );
  });

  it("rejects an optional url without protocol", () => {
    const parsed = adminStoreSettingsSchema.safeParse({
      id: crypto.randomUUID(),
      storeName: "Patas Pets",
      description: null,
      whatsappPhone: "85999990000",
      instagramUrl: "instagram.com/pataspets",
      address: null,
      openingHours: null,
      googleMapsUrl: null,
      deliveryEnabled: true,
      pickupEnabled: true,
    });

    expect(parsed.success).toBe(false);
    expect(parsed.error?.flatten().fieldErrors.instagramUrl?.[0]).toBe("Informe uma URL válida.");
  });
});
