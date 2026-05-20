import { z } from "zod";

import { normalizePhoneDigits } from "@/lib/checkout-utils";

const emptyStringToNull = z.preprocess(
  (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return value;
  },
  z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : null)),
);

const optionalUrlSchema = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return value;
  },
  z
    .string()
    .trim()
    .url("Informe uma URL válida.")
    .refine((value) => /^https?:\/\//.test(value), "Use uma URL com http:// ou https://.")
    .nullable(),
);

const whatsappPhoneSchema = z
  .string()
  .trim()
  .min(8, "Informe o WhatsApp principal da loja.")
  .transform((value) => normalizePhoneDigits(value))
  .refine((value) => value.length >= 10, "Informe um WhatsApp válido com DDD.");

const optionalUuidSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return value;
}, z.string().uuid().optional());

export const adminStoreSettingsSchema = z.object({
  id: optionalUuidSchema,
  storeName: z.string().trim().min(1, "Informe o nome da loja."),
  description: emptyStringToNull,
  whatsappPhone: whatsappPhoneSchema,
  instagramUrl: optionalUrlSchema,
  address: emptyStringToNull,
  openingHours: emptyStringToNull,
  googleMapsUrl: optionalUrlSchema,
  deliveryEnabled: z.boolean(),
  pickupEnabled: z.boolean(),
});

export type AdminStoreSettingsInput = z.infer<typeof adminStoreSettingsSchema>;
