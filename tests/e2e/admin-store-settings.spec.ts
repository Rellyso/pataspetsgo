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
const adminEmail = `e2e-store-settings-admin-${suffix}@example.com`;
const password = "secret123";
const appOrigin = "http://127.0.0.1:3000";

let adminUserId = "";
let originalSettings: Record<string, unknown> | null = null;

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

  const { error: profileError } = await serviceClient
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", adminUserId);

  if (profileError) {
    throw profileError;
  }

  const { data: storeSettings, error: storeSettingsError } = await serviceClient
    .from("store_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (storeSettingsError || !storeSettings) {
    throw storeSettingsError ?? new Error("Could not load store_settings for E2E.");
  }

  originalSettings = storeSettings;
});

test.afterAll(async () => {
  if (originalSettings?.id) {
    await serviceClient
      .from("store_settings")
      .update({
        store_name: originalSettings.store_name,
        description: originalSettings.description,
        whatsapp_phone: originalSettings.whatsapp_phone,
        instagram_url: originalSettings.instagram_url,
        address: originalSettings.address,
        opening_hours: originalSettings.opening_hours,
        google_maps_url: originalSettings.google_maps_url,
        delivery_enabled: originalSettings.delivery_enabled,
        pickup_enabled: originalSettings.pickup_enabled,
      })
      .eq("id", String(originalSettings.id));
  }

  if (adminUserId) {
    await serviceClient.auth.admin.deleteUser(adminUserId);
  }
});

test("admin updates store settings and the public surfaces react immediately", async ({ page }) => {
  const signInResult = await serviceClient.auth.signInWithPassword({
    email: adminEmail,
    password,
  });

  if (signInResult.error || !signInResult.data.session) {
    throw signInResult.error ?? new Error("Could not sign in admin user for store settings E2E.");
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

  await page.goto("/admin/configuracoes");

  await page.getByLabel("Nome da loja").fill("Patas Pets Operação");
  await page.getByLabel("WhatsApp principal").fill("85988887777");
  await page.getByLabel("Descrição").fill("Atendimento rápido para pedido via WhatsApp.");
  await page.getByLabel("Horário de funcionamento").fill("Seg a Sáb, 8h às 18h");
  await page.getByLabel("Endereço").fill("Rua Silva Paulet, 100 - Aldeota");
  await page.getByLabel("Instagram").fill("https://instagram.com/pataspets");
  await page.getByLabel("Link do Google Maps").fill("https://maps.google.com/?q=Patas+Pets");
  await page.getByLabel("Entrega habilitada").uncheck();
  await page.getByRole("button", { name: "Salvar configurações" }).click();

  await expect(page.getByText("Configurações da loja atualizadas com sucesso.")).toBeVisible();

  await page.goto("/");
  await expect(page.getByText("Informações da loja")).toBeVisible();
  await expect(page.getByText("Seg a Sáb, 8h às 18h")).toBeVisible();
  await expect(page.getByRole("link", { name: "Instagram" })).toHaveAttribute(
    "href",
    "https://instagram.com/pataspets",
  );

  await page.goto("/pedido");
  await expect(page.getByText("Retirada: Rua Silva Paulet, 100 - Aldeota")).toBeVisible();
  await expect(page.getByRole("button", { name: /Retirada/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Combinar/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Entrega/ })).toHaveCount(0);
});

function toBase64UrlJson(value: unknown) {
  return Buffer.from(JSON.stringify(value))
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}
