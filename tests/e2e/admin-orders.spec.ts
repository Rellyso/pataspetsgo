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
const adminEmail = `e2e-orders-admin-${suffix}@example.com`;
const password = "secret123";
const appOrigin = "http://127.0.0.1:3000";

let adminUserId = "";
let orderId = "";
let orderNumber = "";

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

  const { error: promoteError } = await serviceClient
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", adminUserId);

  if (promoteError) {
    throw promoteError;
  }

  const { data: variant, error: variantError } = await serviceClient
    .from("product_variants")
    .select("id, product_id, name, price, promotional_price")
    .eq("sku", "GRANPLUS-ADULTO-20KG")
    .maybeSingle();

  if (variantError || !variant) {
    throw variantError ?? new Error("Missing seed variant for orders E2E.");
  }

  const unitPrice = variant.promotional_price ?? variant.price;

  const { data: createdOrder, error: createOrderError } = await serviceClient.rpc(
    "create_order_with_items",
    {
      p_address: "Rua E2E, 456",
      p_customer_name: `Cliente E2E ${suffix}`,
      p_customer_phone: "5585999992222",
      p_delivery_type: "delivery",
      p_items: [
        {
          product_id: variant.product_id,
          product_name: "GranPlus Adulto",
          product_variant_id: variant.id,
          quantity: 2,
          total_price: unitPrice * 2,
          unit_price: unitPrice,
          variant_name: variant.name,
        },
      ],
      p_notes: "Tocar interfone",
      p_total_estimated: unitPrice * 2,
      p_whatsapp_message: `Pedido E2E ${suffix}`,
    },
  );

  if (createOrderError || !createdOrder?.[0]) {
    throw createOrderError ?? new Error("Could not create E2E order.");
  }

  orderId = createdOrder[0].order_id;
  orderNumber = createdOrder[0].order_number;
});

test.afterAll(async () => {
  if (orderId) {
    await serviceClient.from("orders").delete().eq("id", orderId);
  }

  if (adminUserId) {
    await serviceClient.auth.admin.deleteUser(adminUserId);
  }
});

test("lists an order and opens its persisted detail in the admin", async ({ page }) => {
  const signInResult = await serviceClient.auth.signInWithPassword({
    email: adminEmail,
    password,
  });

  if (signInResult.error || !signInResult.data.session) {
    throw signInResult.error ?? new Error("Could not sign in admin user for E2E.");
  }

  const sessionCookieValue = toBase64UrlJson(signInResult.data.session);

  await page.context().addCookies([
    {
      name: "sb-127-auth-token",
      value: `base64-${sessionCookieValue}`,
      url: appOrigin,
      sameSite: "Lax",
      httpOnly: false,
    },
  ]);

  await page.goto(`/admin/pedidos?q=${encodeURIComponent(orderNumber)}`);

  await expect(page.getByRole("heading", { name: "Pedidos" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver detalhes" }).first()).toBeVisible();

  await page.getByRole("link", { name: "Ver detalhes" }).first().click();

  await expect(page).toHaveURL(new RegExp(`/admin/pedidos\\?q=.*&id=${orderId}`));
  await expect(page.getByRole("heading", { name: `Pedido ${orderNumber}` })).toBeVisible();
  await expect(page.getByText("Mensagem salva")).toBeVisible();
  await expect(page.getByText("Tocar interfone")).toBeVisible();
  await expect(page.getByLabel("Status operacional")).toHaveValue("pending");
});

function toBase64UrlJson(value: unknown) {
  return Buffer.from(JSON.stringify(value))
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}
