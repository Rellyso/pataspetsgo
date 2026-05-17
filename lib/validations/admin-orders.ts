import { z } from "zod";

const optionalString = z.preprocess(
  (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return value;
  },
  z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : undefined)),
);

const optionalDateString = optionalString.refine(
  (value) => value === undefined || /^\d{4}-\d{2}-\d{2}$/.test(value),
  "Use uma data no formato AAAA-MM-DD.",
);

export const adminOrderStatusOptions = [
  { value: "pending", label: "Pendente" },
  { value: "sent_to_whatsapp", label: "Enviado ao WhatsApp" },
  { value: "confirmed", label: "Confirmado" },
  { value: "canceled", label: "Cancelado" },
] as const;

export const adminDeliveryTypeOptions = [
  { value: "pickup", label: "Retirada" },
  { value: "delivery", label: "Entrega" },
  { value: "arrange", label: "Combinar" },
] as const;

const adminOrderStatusValues = ["pending", "sent_to_whatsapp", "confirmed", "canceled"] as const;
const adminOrderFilterStatusValues = [
  "all",
  "pending",
  "sent_to_whatsapp",
  "confirmed",
  "canceled",
] as const;
const adminDeliveryTypeValues = ["pickup", "delivery", "arrange"] as const;
const adminOrderFilterDeliveryTypeValues = ["all", "pickup", "delivery", "arrange"] as const;

export const adminOrderStatusSchema = z.enum(adminOrderStatusValues, {
  message: "Selecione um status válido.",
});

export const adminDeliveryTypeSchema = z.enum(adminDeliveryTypeValues, {
  message: "Selecione um tipo de atendimento válido.",
});

export const adminOrderFiltersSchema = z.object({
  q: optionalString.optional(),
  status: z.enum(adminOrderFilterStatusValues).optional().default("all"),
  deliveryType: z.enum(adminOrderFilterDeliveryTypeValues).optional().default("all"),
  from: optionalDateString.optional(),
  to: optionalDateString.optional(),
});

export const adminOrderIdSearchSchema = z.object({
  id: z.string().uuid().optional(),
});

export const adminOrderStatusUpdateSchema = z.object({
  orderId: z.string().uuid("Pedido inválido."),
  status: adminOrderStatusSchema,
});

export type AdminOrderFiltersInput = z.infer<typeof adminOrderFiltersSchema>;
export type AdminOrderStatus = z.infer<typeof adminOrderStatusSchema>;
export type AdminDeliveryType = z.infer<typeof adminDeliveryTypeSchema>;
export type AdminOrderStatusUpdateInput = z.infer<typeof adminOrderStatusUpdateSchema>;

export function parseAdminOrderFilters(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return adminOrderFiltersSchema.parse({
    q: getSingleValue(searchParams.q),
    status: getSingleValue(searchParams.status),
    deliveryType: getSingleValue(searchParams.deliveryType),
    from: getSingleValue(searchParams.from),
    to: getSingleValue(searchParams.to),
  });
}

export function parseAdminOrderId(searchParams: Record<string, string | string[] | undefined>) {
  const parsed = adminOrderIdSearchSchema.safeParse({
    id: getSingleValue(searchParams.id),
  });

  if (!parsed.success) {
    return null;
  }

  return parsed.data.id ?? null;
}

export function getAdminOrderStatusLabel(status: AdminOrderStatus) {
  return adminOrderStatusOptions.find((option) => option.value === status)?.label ?? status;
}

export function getAdminDeliveryTypeLabel(deliveryType: AdminDeliveryType) {
  return (
    adminDeliveryTypeOptions.find((option) => option.value === deliveryType)?.label ?? deliveryType
  );
}

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
