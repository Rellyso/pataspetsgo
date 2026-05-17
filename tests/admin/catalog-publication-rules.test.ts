import { describe, expect, it } from "vitest";

import { getCatalogPublicationStatus } from "@/features/catalog/publication-rules";

describe("catalog publication rules", () => {
  it("marks an active product with a valid variant as ready", () => {
    const status = getCatalogPublicationStatus({
      isActive: true,
      categoryId: null,
      category: null,
      brandId: null,
      brand: null,
      variants: [{ is_active: true, price: 10, stock_status: "available" }],
    });

    expect(status.code).toBe("ready");
  });

  it("marks an active product without a valid variant as missing_variant", () => {
    const status = getCatalogPublicationStatus({
      isActive: true,
      categoryId: null,
      category: null,
      brandId: null,
      brand: null,
      variants: [{ is_active: false, price: 10, stock_status: "available" }],
    });

    expect(status.code).toBe("missing_variant");
  });

  it("marks an active product with an inactive category as inactive_category", () => {
    const status = getCatalogPublicationStatus({
      isActive: true,
      categoryId: "category-1",
      category: { is_active: false },
      brandId: null,
      brand: null,
      variants: [{ is_active: true, price: 10, stock_status: "available" }],
    });

    expect(status.code).toBe("inactive_category");
  });

  it("marks an active product with an inactive brand as inactive_brand", () => {
    const status = getCatalogPublicationStatus({
      isActive: true,
      categoryId: null,
      category: null,
      brandId: "brand-1",
      brand: { is_active: false },
      variants: [{ is_active: true, price: 10, stock_status: "available" }],
    });

    expect(status.code).toBe("inactive_brand");
  });

  it("marks an inactive product as inactive_product", () => {
    const status = getCatalogPublicationStatus({
      isActive: false,
      categoryId: null,
      category: null,
      brandId: null,
      brand: null,
      variants: [{ is_active: true, price: 10, stock_status: "available" }],
    });

    expect(status.code).toBe("inactive_product");
  });
});
