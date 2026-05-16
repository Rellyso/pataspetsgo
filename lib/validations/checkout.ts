import { z } from "zod";

export const deliveryTypeSchema = z.enum(["pickup", "delivery", "arrange"]);

export const cartItemSchema = z.object({
  productId: z.uuid(),
  productVariantId: z.uuid(),
  productSlug: z.string().trim().min(1),
  productName: z.string().trim().min(1),
  variantName: z.string().trim().min(1),
  unitPriceSnapshot: z.number().nonnegative(),
  promotionalPriceSnapshot: z.number().nonnegative().nullable(),
  quantity: z.number().int().min(1),
  stockStatusSnapshot: z.enum(["available", "consult"]),
  imageUrl: z.url().nullable(),
});

export const checkoutFormSchema = z
  .object({
    customerName: z.string().trim().min(1, "Informe seu nome."),
    customerPhone: z
      .string()
      .trim()
      .min(8, "Informe um telefone válido.")
      .refine((value) => value.replace(/\D/g, "").length >= 10, "Informe um telefone válido."),
    deliveryType: deliveryTypeSchema,
    address: z.string().trim(),
    notes: z.string().trim(),
  })
  .superRefine((value, ctx) => {
    if (value.deliveryType === "delivery" && value.address.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Informe o endereço para entrega.",
        path: ["address"],
      });
    }
  });

export const submitOrderPayloadSchema = z.object({
  customerName: checkoutFormSchema.shape.customerName,
  customerPhone: checkoutFormSchema.shape.customerPhone,
  deliveryType: checkoutFormSchema.shape.deliveryType,
  address: checkoutFormSchema.shape.address,
  notes: checkoutFormSchema.shape.notes,
  items: z.array(cartItemSchema).min(1, "Adicione ao menos um item ao pedido."),
  estimatedTotal: z.number().nonnegative(),
});

export type DeliveryType = z.infer<typeof deliveryTypeSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
export type SubmitOrderPayload = z.infer<typeof submitOrderPayloadSchema>;
