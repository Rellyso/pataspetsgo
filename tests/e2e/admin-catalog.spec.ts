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
const adminEmail = `e2e-catalog-admin-${suffix}@example.com`;
const password = "secret123";
const categoryName = `Categoria ${suffix}`;
const brandName = `Marca ${suffix}`;
const productName = `Produto ${suffix}`;
const variantName = `Variante ${suffix}`;

let adminUserId = "";

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
  if (adminUserId) {
    await serviceClient.auth.admin.deleteUser(adminUserId);
  }
});

test("creates category, brand, product and variant in the admin catalog flow", async ({ page }) => {
  await page.goto("/auth/login");

  await page.getByLabel("Email").fill(adminEmail);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: /Entrar no admin/i }).click();

  await expect(page).toHaveURL(/\/admin$/);

  await page.goto("/admin/categorias");
  await page.getByRole("button", { name: "Criar categoria" }).click();
  await page.getByLabel("Nome").fill(categoryName);
  await page.getByLabel("Slug").fill(`categoria-${suffix}`);
  await page.getByLabel("Cor").fill("#00A9C8");
  await page.getByRole("button", { name: "Salvar categoria" }).click();
  await expect(page.getByText(categoryName)).toBeVisible();

  await page.goto("/admin/marcas");
  await page.getByRole("button", { name: "Criar marca" }).click();
  await page.getByLabel("Nome").fill(brandName);
  await page.getByLabel("Slug").fill(`marca-${suffix}`);
  await page.getByRole("button", { name: "Salvar marca" }).click();
  await expect(page.getByText(brandName)).toBeVisible();

  await page.goto("/admin/produtos/novo");
  await page.getByLabel("Nome").fill(productName);
  await page.getByLabel("Slug").fill(`produto-${suffix}`);
  await page.getByLabel("Categoria").selectOption({ label: categoryName });
  await page.getByLabel("Marca").selectOption({ label: brandName });
  await page.getByRole("button", { name: "Criar produto" }).click();

  await expect(page).toHaveURL(/\/admin\/produtos\//);
  await expect(page.getByText("Falta variante válida")).toBeVisible();

  await page.getByRole("button", { name: "Criar variante" }).click();
  await page.getByLabel("Nome").fill(variantName);
  await page.getByLabel("Preço").fill("99.9");
  await page.getByRole("button", { name: "Salvar variante" }).click();

  await expect(page.getByText("Pronto para vitrine")).toBeVisible();
  await expect(page.getByText(variantName)).toBeVisible();
});
