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
const adminEmail = `e2e-admin-${suffix}@example.com`;
const regularEmail = `e2e-regular-${suffix}@example.com`;
const password = "secret123";

let adminUserId = "";
let regularUserId = "";

function requireUserId(userId: string, label: string) {
  if (!userId) {
    throw new Error(`Missing ${label} user id`);
  }

  return userId;
}

test.beforeAll(async () => {
  const [adminResult, regularResult] = await Promise.all([
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

  if (adminResult.error || regularResult.error) {
    throw adminResult.error ?? regularResult.error;
  }

  if (!adminResult.data.user || !regularResult.data.user) {
    throw new Error("Expected admin.createUser() to return users");
  }

  adminUserId = adminResult.data.user.id;
  regularUserId = regularResult.data.user.id;

  const { error } = await serviceClient
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", adminUserId);

  if (error) {
    throw error;
  }
});

test.afterAll(async () => {
  await Promise.all([
    serviceClient.auth.admin.deleteUser(requireUserId(adminUserId, "admin")),
    serviceClient.auth.admin.deleteUser(requireUserId(regularUserId, "regular")),
  ]);
});

test("redirects anonymous users to the admin login", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByRole("heading", { name: "Entrar no admin" })).toBeVisible();
});

test("allows an admin user into the protected admin route", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByLabel("Email").fill(adminEmail);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByText(adminEmail)).toBeVisible();
  await expect(page.getByRole("link", { name: /produtos/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /configurações da loja/i })).toBeVisible();

  await page.getByRole("link", { name: /produtos/i }).click();
  await expect(page).toHaveURL(/\/admin\/produtos$/);
  await expect(page.getByRole("heading", { name: "Produtos" })).toBeVisible();

  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/auth\/login$/);
});

test("blocks a signed-in user without admin role", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByLabel("Email").fill(regularEmail);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/auth\/access-denied$/);
  await expect(
    page.getByRole("heading", { name: "Sua conta nao tem permissao de admin" }),
  ).toBeVisible();
});
