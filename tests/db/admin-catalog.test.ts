import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createAnonClient, createServiceRoleClient } from "./supabase";

describe("admin catalog access", () => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const adminEmail = `catalog-admin-${suffix}@example.com`;
  const regularEmail = `catalog-regular-${suffix}@example.com`;
  const password = "secret123";

  const serviceClient = createServiceRoleClient();
  const adminClient = createAnonClient();
  const regularClient = createAnonClient();

  let adminUserId = "";
  let regularUserId = "";
  let categoryId = "";
  let brandId = "";
  let uploadedProductPath = "";

  beforeAll(async () => {
    const [adminUserResult, regularUserResult] = await Promise.all([
      serviceClient.auth.admin.createUser({
        email: adminEmail,
        password,
        email_confirm: true,
      }),
      serviceClient.auth.admin.createUser({
        email: regularEmail,
        password,
        email_confirm: true,
      }),
    ]);

    expect(adminUserResult.error).toBeNull();
    expect(regularUserResult.error).toBeNull();

    adminUserId = adminUserResult.data.user?.id ?? "";
    regularUserId = regularUserResult.data.user?.id ?? "";

    const { error: promoteError } = await serviceClient
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", adminUserId);

    expect(promoteError).toBeNull();

    await Promise.all([
      adminClient.auth.signInWithPassword({ email: adminEmail, password }),
      regularClient.auth.signInWithPassword({ email: regularEmail, password }),
    ]);
  });

  afterAll(async () => {
    await adminClient.auth.signOut();
    await regularClient.auth.signOut();

    if (uploadedProductPath) {
      await serviceClient.storage.from("products").remove([uploadedProductPath]);
    }

    if (brandId) {
      await serviceClient.from("brands").delete().eq("id", brandId);
    }

    if (categoryId) {
      await serviceClient.from("categories").delete().eq("id", categoryId);
    }

    await Promise.all([
      adminUserId ? serviceClient.auth.admin.deleteUser(adminUserId) : Promise.resolve(),
      regularUserId ? serviceClient.auth.admin.deleteUser(regularUserId) : Promise.resolve(),
    ]);
  });

  it("allows an admin user to create category and brand records", async () => {
    const categorySlug = `categoria-${suffix}`;
    const brandSlug = `marca-${suffix}`;

    const categoryResult = await adminClient
      .from("categories")
      .insert({
        name: `Categoria ${suffix}`,
        slug: categorySlug,
        color: "#00A9C8",
        sort_order: 0,
        is_active: true,
      })
      .select("id")
      .single();

    const brandResult = await adminClient
      .from("brands")
      .insert({
        name: `Marca ${suffix}`,
        slug: brandSlug,
        is_active: true,
      })
      .select("id")
      .single();

    expect(categoryResult.error).toBeNull();
    expect(brandResult.error).toBeNull();

    categoryId = categoryResult.data?.id ?? "";
    brandId = brandResult.data?.id ?? "";

    expect(categoryId).not.toBe("");
    expect(brandId).not.toBe("");
  });

  it("blocks a signed-in non-admin user from creating categories", async () => {
    const { error } = await regularClient.from("categories").insert({
      name: `Bloqueada ${suffix}`,
      slug: `bloqueada-${suffix}`,
      color: "#00A9C8",
      sort_order: 0,
      is_active: true,
    });

    expect(error).not.toBeNull();
  });

  it("rejects duplicate slugs and invalid relationships for admin writes", async () => {
    const duplicateCategory = await adminClient.from("categories").insert({
      name: `Categoria duplicada ${suffix}`,
      slug: `categoria-${suffix}`,
      color: "#00A9C8",
      sort_order: 0,
      is_active: true,
    });

    expect(duplicateCategory.error).not.toBeNull();

    const invalidProduct = await adminClient.from("products").insert({
      name: `Produto inválido ${suffix}`,
      slug: `produto-invalido-${suffix}`,
      category_id: crypto.randomUUID(),
      brand_id: brandId,
      pet_type: "dog",
      age_group: "adult",
      size_group: "medium",
      sort_order: 0,
      is_active: true,
      is_featured: false,
      is_promotion: false,
    });

    expect(invalidProduct.error).not.toBeNull();
  });

  it("allows admin storage upload for product assets and blocks regular users", async () => {
    const adminUpload = await adminClient.storage
      .from("products")
      .upload(`tests/${suffix}.png`, new File(["asset"], "asset.png", { type: "image/png" }), {
        upsert: true,
      });

    expect(adminUpload.error).toBeNull();
    uploadedProductPath = adminUpload.data?.path ?? "";

    const regularUpload = await regularClient.storage
      .from("products")
      .upload(
        `tests/regular-${suffix}.png`,
        new File(["asset"], "asset.png", { type: "image/png" }),
        {
          upsert: true,
        },
      );

    expect(regularUpload.error).not.toBeNull();
  });
});
