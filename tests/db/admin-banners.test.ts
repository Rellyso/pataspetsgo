import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createAnonClient, createServiceRoleClient } from "./supabase";

describe("admin banners access", () => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const adminEmail = `banners-admin-${suffix}@example.com`;
  const regularEmail = `banners-regular-${suffix}@example.com`;
  const password = "secret123";

  const serviceClient = createServiceRoleClient();
  const adminClient = createAnonClient();
  const regularClient = createAnonClient();

  let adminUserId = "";
  let regularUserId = "";
  let bannerId = "";
  let uploadedBannerPath = "";

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

    if (uploadedBannerPath) {
      await serviceClient.storage.from("banners").remove([uploadedBannerPath]);
    }

    if (bannerId) {
      await serviceClient.from("banners").delete().eq("id", bannerId);
    }

    await Promise.all([
      adminUserId ? serviceClient.auth.admin.deleteUser(adminUserId) : Promise.resolve(),
      regularUserId ? serviceClient.auth.admin.deleteUser(regularUserId) : Promise.resolve(),
    ]);
  });

  it("allows an admin to create and edit banners", async () => {
    const createResult = await adminClient
      .from("banners")
      .insert({
        title: `Banner ${suffix}`,
        subtitle: "Resumo operacional",
        image_url: "https://example.com/banner.jpg",
        cta_label: "Explorar",
        cta_url: "/catalogo",
        position: 0,
        is_active: true,
      })
      .select("id")
      .single();

    expect(createResult.error).toBeNull();
    bannerId = createResult.data?.id ?? "";
    expect(bannerId).not.toBe("");

    const updateResult = await adminClient
      .from("banners")
      .update({
        title: `Banner atualizado ${suffix}`,
        position: 2,
      })
      .eq("id", bannerId);

    expect(updateResult.error).toBeNull();
  });

  it("blocks non-admin users from writing banners", async () => {
    const { error } = await regularClient.from("banners").insert({
      title: `Bloqueado ${suffix}`,
      subtitle: null,
      image_url: "https://example.com/banner.jpg",
      cta_label: "Explorar",
      cta_url: "/catalogo",
      position: 1,
      is_active: true,
    });

    expect(error).not.toBeNull();
  });

  it("allows admin storage upload for banner assets and blocks regular users", async () => {
    const adminUpload = await adminClient.storage
      .from("banners")
      .upload(`tests/${suffix}.png`, new File(["asset"], "asset.png", { type: "image/png" }), {
        upsert: true,
      });

    expect(adminUpload.error).toBeNull();
    uploadedBannerPath = adminUpload.data?.path ?? "";

    const regularUpload = await regularClient.storage
      .from("banners")
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
