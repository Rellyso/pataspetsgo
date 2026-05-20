import { describe, expect, it } from "vitest";

import { adminBannerSchema } from "@/lib/validations/admin-banners";

describe("admin banners validation", () => {
  it("accepts a valid active banner payload", () => {
    const result = adminBannerSchema.safeParse({
      title: "Ofertas da semana",
      subtitle: "Rações e petiscos",
      ctaLabel: "Explorar",
      ctaUrl: "/catalogo?promotion=1",
      position: 0,
      isActive: true,
      existingImageUrl: "https://example.com/banner.jpg",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an active banner without CTA label", () => {
    const result = adminBannerSchema.safeParse({
      title: "Ofertas",
      subtitle: "",
      ctaLabel: "",
      ctaUrl: "/catalogo",
      position: 0,
      isActive: true,
      existingImageUrl: "https://example.com/banner.jpg",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an active banner without CTA URL", () => {
    const result = adminBannerSchema.safeParse({
      title: "Ofertas",
      subtitle: "",
      ctaLabel: "Explorar",
      ctaUrl: "",
      position: 0,
      isActive: true,
      existingImageUrl: "https://example.com/banner.jpg",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid position", () => {
    const result = adminBannerSchema.safeParse({
      title: "Ofertas",
      subtitle: "",
      ctaLabel: "Explorar",
      ctaUrl: "/catalogo",
      position: -1,
      isActive: false,
      existingImageUrl: "https://example.com/banner.jpg",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a malformed CTA destination", () => {
    const result = adminBannerSchema.safeParse({
      title: "Ofertas",
      subtitle: "",
      ctaLabel: "Explorar",
      ctaUrl: "catalogo",
      position: 0,
      isActive: false,
      existingImageUrl: "https://example.com/banner.jpg",
    });

    expect(result.success).toBe(false);
  });
});
