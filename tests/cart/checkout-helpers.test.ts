import { describe, expect, it } from "vitest";

import {
  calculateEstimatedTotal,
  normalizeQuantity,
  upsertCartItem,
} from "@/features/cart/helpers";
import { checkoutFormSchema } from "@/lib/validations/checkout";

describe("cart helpers", () => {
  it("consolidates items with the same product_variant_id", () => {
    const baseItem = {
      imageUrl: null,
      productId: "11111111-1111-1111-1111-111111111111",
      productName: "GranPlus Adulto",
      productSlug: "granplus-adulto",
      productVariantId: "22222222-2222-2222-2222-222222222222",
      promotionalPriceSnapshot: 154.9,
      quantity: 1,
      stockStatusSnapshot: "available" as const,
      unitPriceSnapshot: 167.05,
      variantName: "Pacote 20kg",
    };

    const items = upsertCartItem([baseItem], {
      ...baseItem,
      quantity: 2,
    });

    expect(items).toHaveLength(1);
    expect(items[0]?.quantity).toBe(3);
  });

  it("calculates total using promotional price when available", () => {
    const total = calculateEstimatedTotal([
      {
        imageUrl: null,
        productId: "11111111-1111-1111-1111-111111111111",
        productName: "GranPlus Adulto",
        productSlug: "granplus-adulto",
        productVariantId: "22222222-2222-2222-2222-222222222222",
        promotionalPriceSnapshot: 154.9,
        quantity: 2,
        stockStatusSnapshot: "available",
        unitPriceSnapshot: 167.05,
        variantName: "Pacote 20kg",
      },
      {
        imageUrl: null,
        productId: "33333333-3333-3333-3333-333333333333",
        productName: "Snow Cat",
        productSlug: "snow-cat",
        productVariantId: "44444444-4444-4444-4444-444444444444",
        promotionalPriceSnapshot: null,
        quantity: 1,
        stockStatusSnapshot: "consult",
        unitPriceSnapshot: 65.5,
        variantName: "Pacote 10kg",
      },
    ]);

    expect(total).toBe(375.3);
  });

  it("normalizes invalid or fractional quantities", () => {
    expect(normalizeQuantity(0)).toBe(1);
    expect(normalizeQuantity(-3)).toBe(1);
    expect(normalizeQuantity(2.8)).toBe(2);
  });
});

describe("checkoutFormSchema", () => {
  it("requires address when delivery is selected", () => {
    const result = checkoutFormSchema.safeParse({
      address: "",
      customerName: "Maria",
      customerPhone: "(85) 99999-0000",
      deliveryType: "delivery",
      notes: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.address?.[0]).toBe(
      "Informe o endereco para entrega.",
    );
  });

  it("allows pickup without address", () => {
    const result = checkoutFormSchema.safeParse({
      address: "",
      customerName: "Maria",
      customerPhone: "(85) 99999-0000",
      deliveryType: "pickup",
      notes: "",
    });

    expect(result.success).toBe(true);
  });
});
