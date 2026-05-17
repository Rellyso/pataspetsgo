import { describe, expect, it } from "vitest";

import {
  adminBrandSchema,
  adminCategorySchema,
  adminProductSchema,
  adminVariantSchema,
} from "@/lib/validations/admin-catalog";

describe("admin catalog validation", () => {
  it("accepts a valid product payload", () => {
    const result = adminProductSchema.safeParse({
      name: "Ração teste",
      slug: "racao-teste",
      shortDescription: "Resumo",
      description: "Descrição longa",
      categoryId: null,
      brandId: null,
      petType: "dog",
      ageGroup: "adult",
      sizeGroup: "medium",
      sortOrder: 1,
      isActive: true,
      isFeatured: false,
      isPromotion: true,
      existingImageUrl: "",
    });

    expect(result.success).toBe(true);
  });

  it("accepts null optional product descriptions from form defaults", () => {
    const result = adminProductSchema.safeParse({
      name: "Ração teste",
      slug: "racao-teste",
      shortDescription: null,
      description: null,
      categoryId: null,
      brandId: null,
      petType: "dog",
      ageGroup: "adult",
      sizeGroup: "medium",
      sortOrder: 1,
      isActive: true,
      isFeatured: false,
      isPromotion: false,
      existingImageUrl: null,
    });

    expect(result.success).toBe(true);
  });

  it("rejects a product with invalid slug", () => {
    const result = adminProductSchema.safeParse({
      name: "Ração teste",
      slug: "Ração Teste",
      shortDescription: "",
      description: "",
      categoryId: null,
      brandId: null,
      petType: "dog",
      ageGroup: "adult",
      sizeGroup: "medium",
      sortOrder: 1,
      isActive: true,
      isFeatured: false,
      isPromotion: false,
      existingImageUrl: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a variant with promotional price greater than price", () => {
    const result = adminVariantSchema.safeParse({
      productId: crypto.randomUUID(),
      name: "3 kg",
      sku: "",
      weight: "",
      flavor: "",
      price: 10,
      promotionalPrice: 11,
      stockStatus: "available",
      sortOrder: 0,
      isActive: true,
    });

    expect(result.success).toBe(false);
  });

  it("accepts null optional variant fields from form defaults", () => {
    const result = adminVariantSchema.safeParse({
      productId: crypto.randomUUID(),
      name: "3 kg",
      sku: null,
      weight: null,
      flavor: null,
      price: 10,
      promotionalPrice: null,
      stockStatus: "available",
      sortOrder: 0,
      isActive: true,
    });

    expect(result.success).toBe(true);
  });

  it("accepts a valid category payload", () => {
    const result = adminCategorySchema.safeParse({
      name: "Rações",
      slug: "racoes",
      description: "",
      icon: "bowl",
      color: "#00A9C8",
      sortOrder: 0,
      isActive: true,
    });

    expect(result.success).toBe(true);
  });

  it("accepts null optional category fields from form defaults", () => {
    const result = adminCategorySchema.safeParse({
      name: "Rações",
      slug: "racoes",
      description: null,
      icon: null,
      color: "#00A9C8",
      sortOrder: 0,
      isActive: true,
    });

    expect(result.success).toBe(true);
  });

  it("accepts empty optional ids from create forms", () => {
    const productResult = adminProductSchema.safeParse({
      id: "",
      name: "Ração teste",
      slug: "racao-teste",
      shortDescription: null,
      description: null,
      categoryId: null,
      brandId: null,
      petType: "dog",
      ageGroup: "adult",
      sizeGroup: "medium",
      sortOrder: 1,
      isActive: true,
      isFeatured: false,
      isPromotion: false,
      existingImageUrl: null,
    });

    const categoryResult = adminCategorySchema.safeParse({
      id: "",
      name: "Rações",
      slug: "racoes",
      description: null,
      icon: null,
      color: "#00A9C8",
      sortOrder: 0,
      isActive: true,
    });

    const brandResult = adminBrandSchema.safeParse({
      id: "",
      name: "GranPlus",
      slug: "granplus",
      isActive: true,
      existingLogoUrl: null,
    });

    const variantResult = adminVariantSchema.safeParse({
      id: "",
      productId: crypto.randomUUID(),
      name: "3 kg",
      sku: null,
      weight: null,
      flavor: null,
      price: 10,
      promotionalPrice: null,
      stockStatus: "available",
      sortOrder: 0,
      isActive: true,
    });

    expect(productResult.success).toBe(true);
    expect(categoryResult.success).toBe(true);
    expect(brandResult.success).toBe(true);
    expect(variantResult.success).toBe(true);
  });

  it("accepts a valid brand payload", () => {
    const result = adminBrandSchema.safeParse({
      name: "GranPlus",
      slug: "granplus",
      isActive: true,
      existingLogoUrl: "",
    });

    expect(result.success).toBe(true);
  });
});
