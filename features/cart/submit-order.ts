"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { type DeliveryType, submitOrderPayloadSchema } from "@/lib/validations/checkout";
import { toWhatsappHref } from "@/lib/whatsapp";
import type { Tables } from "@/types/database";

type SubmitOrderSuccessResult = {
  ok: true;
  orderId: string;
  orderNumber: string;
  whatsappMessage: string;
  whatsappHref: string;
};

type SubmitOrderErrorResult = {
  ok: false;
  message: string;
  fieldErrors?: Partial<
    Record<
      "customerName" | "customerPhone" | "deliveryType" | "address" | "notes" | "items",
      string
    >
  >;
  cartIssue?: boolean;
};

export type SubmitOrderResult = SubmitOrderSuccessResult | SubmitOrderErrorResult;

type StoreSettingsRow = Pick<
  Tables<"store_settings">,
  "delivery_enabled" | "pickup_enabled" | "store_name" | "whatsapp_phone"
>;

type VariantRow = {
  id: string;
  name: string;
  price: number;
  promotional_price: number | null;
  stock_status: string;
  is_active: boolean;
  product_id: string;
  products: {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
  } | null;
};

export async function submitOrder(payload: unknown): Promise<SubmitOrderResult> {
  const parsedPayload = submitOrderPayloadSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      ok: false,
      message: "Revise os dados do pedido antes de continuar.",
      fieldErrors: flattenFieldErrors(parsedPayload.error.flatten().fieldErrors),
    };
  }

  const values = parsedPayload.data;
  const supabase = await getSupabaseServerClient();

  const { data: storeSettingsData, error: storeSettingsError } = await supabase
    .from("store_settings")
    .select("delivery_enabled, pickup_enabled, store_name, whatsapp_phone")
    .limit(1)
    .maybeSingle();

  if (storeSettingsError || !storeSettingsData) {
    return {
      ok: false,
      message: "Não foi possível carregar as configurações da loja agora.",
    };
  }

  const storeSettings = storeSettingsData satisfies StoreSettingsRow;
  const deliveryTypeError = validateDeliveryType(values.deliveryType, storeSettings);

  if (deliveryTypeError) {
    return {
      ok: false,
      message: deliveryTypeError,
      fieldErrors: {
        deliveryType: deliveryTypeError,
      },
    };
  }

  const variantIds = values.items.map((item) => item.productVariantId);
  const { data: variantData, error: variantsError } = await supabase
    .from("product_variants")
    .select(
      `
        id,
        name,
        price,
        promotional_price,
        stock_status,
        is_active,
        product_id,
        products!inner (
          id,
          name,
          slug,
          is_active
        )
      `,
    )
    .in("id", variantIds);

  if (variantsError) {
    return {
      ok: false,
      message: "Não foi possível validar os itens do pedido agora.",
    };
  }

  const variants = new Map(
    ((variantData ?? []) as VariantRow[]).map((variant) => [variant.id, variant]),
  );

  const invalidItem = values.items.find((item) => {
    const variant = variants.get(item.productVariantId);

    if (!variant?.products) {
      return true;
    }

    if (!variant.is_active || !variant.products.is_active) {
      return true;
    }

    if (variant.stock_status !== "available" && variant.stock_status !== "consult") {
      return true;
    }

    return false;
  });

  if (invalidItem) {
    return {
      ok: false,
      message: "Um dos itens do carrinho mudou e precisa ser revisado antes do envio.",
      cartIssue: true,
      fieldErrors: {
        items: "Revise os itens do carrinho antes de tentar novamente.",
      },
    };
  }

  const normalizedItems = values.items.map((item) => {
    const variant = variants.get(item.productVariantId);

    if (!variant?.products) {
      throw new Error("Missing validated variant while preparing order.");
    }

    const unitPrice = variant.promotional_price ?? variant.price;

    return {
      product_id: variant.products.id,
      product_variant_id: variant.id,
      product_name: variant.products.name,
      variant_name: variant.name,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: unitPrice * item.quantity,
    };
  });

  const estimatedTotal = normalizedItems.reduce((total, item) => total + item.total_price, 0);
  const whatsappMessage = buildWhatsappMessage({
    address: values.deliveryType === "delivery" ? values.address : "",
    customerName: values.customerName,
    customerPhone: values.customerPhone,
    deliveryType: values.deliveryType,
    estimatedTotal,
    items: normalizedItems,
    notes: values.notes,
    storeName: storeSettings.store_name,
  });

  const { data: orderData, error: orderError } = await supabase.rpc("create_order_with_items", {
    p_address: values.deliveryType === "delivery" ? values.address : null,
    p_customer_name: values.customerName,
    p_customer_phone: values.customerPhone,
    p_delivery_type: values.deliveryType,
    p_items: normalizedItems,
    p_notes: values.notes || null,
    p_total_estimated: estimatedTotal,
    p_whatsapp_message: whatsappMessage,
  });

  if (orderError || !orderData || orderData.length === 0) {
    return {
      ok: false,
      message: "Não foi possível salvar o pedido agora. Tente novamente em instantes.",
    };
  }

  const order = orderData[0];
  const whatsappHref = toWhatsappHref(storeSettings.whatsapp_phone, whatsappMessage);

  if (!whatsappHref) {
    return {
      ok: false,
      message: "O pedido foi salvo, mas o número de WhatsApp da loja está indisponível.",
    };
  }

  return {
    ok: true,
    orderId: order.order_id,
    orderNumber: order.order_number,
    whatsappMessage,
    whatsappHref,
  };
}

function flattenFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): SubmitOrderErrorResult["fieldErrors"] {
  const flattenedEntries = Object.entries(fieldErrors)
    .map(([field, errors]) => [field, errors?.[0]] as const)
    .filter((entry): entry is [string, string] => Boolean(entry[1]));

  return Object.fromEntries(flattenedEntries) as SubmitOrderErrorResult["fieldErrors"];
}

function validateDeliveryType(deliveryType: DeliveryType, storeSettings: StoreSettingsRow) {
  if (deliveryType === "pickup" && !storeSettings.pickup_enabled) {
    return "Retirada indisponível no momento.";
  }

  if (deliveryType === "delivery" && !storeSettings.delivery_enabled) {
    return "Entrega indisponível no momento.";
  }

  return null;
}

function buildWhatsappMessage(input: {
  address: string;
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  estimatedTotal: number;
  items: Array<{
    product_name: string;
    quantity: number;
    total_price: number;
    unit_price: number;
    variant_name: string;
  }>;
  notes: string;
  storeName: string;
}) {
  const lines = [
    `Ola, ${input.storeName}!`,
    "",
    "Pedido salvo no PatasGo.",
    `Nome: ${input.customerName}`,
    `Telefone: ${input.customerPhone}`,
    `Atendimento: ${getDeliveryTypeLabel(input.deliveryType)}`,
  ];

  if (input.deliveryType === "delivery" && input.address) {
    lines.push(`Endereço: ${input.address}`);
  }

  lines.push("", "Itens:");

  for (const item of input.items) {
    lines.push(
      `- ${item.quantity}x ${item.product_name} - ${item.variant_name} (${formatPrice(item.unit_price)} cada)`,
    );
  }

  lines.push("", `Total estimado: ${formatPrice(input.estimatedTotal)}`);

  if (input.notes) {
    lines.push(`Observações: ${input.notes}`);
  }

  lines.push("", "Aguardo a confirmação da loja.");

  return lines.join("\n");
}

function getDeliveryTypeLabel(deliveryType: DeliveryType) {
  switch (deliveryType) {
    case "pickup":
      return "Retirada";
    case "delivery":
      return "Entrega";
    default:
      return "Combinar com a loja";
  }
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value);
}
