import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}

const serviceClient = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
);

const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const adminEmail = `e2e-banners-admin-${suffix}@example.com`;
const password = "secret123";
const appOrigin = "http://127.0.0.1:3000";
const bannerTitle = `Banner ${suffix}`;

let adminUserId = "";
let bannerId = "";

test.beforeAll(async () => {
  const adminResult = await serviceClient.auth.admin.createUser({
    email: adminEmail,
    password,
    email_confirm: true,
  });

  if (adminResult.error) {
    throw adminResult.error;
  }

  adminUserId = adminResult.data.user?.id ?? "";

  const { error } = await serviceClient
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", adminUserId);

  if (error) {
    throw error;
  }
});

test.afterAll(async () => {
  if (bannerId) {
    await serviceClient.from("banners").delete().eq("id", bannerId);
  }

  if (adminUserId) {
    await serviceClient.auth.admin.deleteUser(adminUserId);
  }
});

test("admin sees a banner in the module and home renders its real image", async ({ page }) => {
  const signInResult = await serviceClient.auth.signInWithPassword({
    email: adminEmail,
    password,
  });

  if (signInResult.error || !signInResult.data.session) {
    throw signInResult.error ?? new Error("Could not sign in admin user for banner E2E.");
  }

  await page.context().addCookies([
    {
      name: "sb-127-auth-token",
      value: `base64-${toBase64UrlJson(signInResult.data.session)}`,
      url: appOrigin,
      sameSite: "Lax",
      httpOnly: false,
    },
  ]);

  const createBannerResult = await serviceClient
    .from("banners")
    .insert({
      title: bannerTitle,
      subtitle: "Oferta curta para a home",
      image_url: "https://example.com/banner.jpg",
      cta_label: "Explorar",
      cta_url: "/catalogo",
      position: 0,
      is_active: true,
    })
    .select("id")
    .single();

  if (createBannerResult.error || !createBannerResult.data?.id) {
    throw createBannerResult.error ?? new Error("Could not seed banner for E2E.");
  }

  bannerId = createBannerResult.data.id;

  await page.goto("/admin/banners");
  await expect(page.getByText(bannerTitle)).toBeVisible();

  await page.goto("/");
  await expect(page.getByText("Ofertas e recados")).toBeVisible();
  await expect(page.getByText(bannerTitle)).toBeVisible();
  await expect(page.getByRole("img", { name: bannerTitle })).toBeVisible();
});

function toBase64UrlJson(value: unknown) {
  return Buffer.from(JSON.stringify(value))
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}
