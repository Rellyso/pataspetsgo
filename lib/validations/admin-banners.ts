import { z } from "zod";

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

const emptyStringToUndefined = z.preprocess(
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

const optionalUuidSchema = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return value;
  },
  z.string().uuid().optional(),
);

const bannerDestinationSchema = z
  .string()
  .trim()
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//.test(value),
    "Informe um destino válido.",
  );

export const adminBannerSchema = z
  .object({
    id: optionalUuidSchema,
    title: z.string().trim().min(1, "Informe o título do banner."),
    subtitle: emptyStringToNull,
    ctaLabel: emptyStringToNull,
    ctaUrl: z.preprocess(
      (value) => {
        if (value === "" || value === null || value === undefined) {
          return null;
        }

        return value;
      },
      bannerDestinationSchema.nullable(),
    ),
    position: z.coerce.number().int("Use um número inteiro.").min(0, "Use zero ou mais."),
    isActive: z.boolean(),
    existingImageUrl: emptyStringToUndefined.optional(),
  })
  .superRefine((value, context) => {
    const hasCtaLabel = Boolean(value.ctaLabel);
    const hasCtaUrl = Boolean(value.ctaUrl);
    const hasImage = Boolean(value.existingImageUrl);

    if (hasCtaLabel !== hasCtaUrl) {
      context.addIssue({
        code: "custom",
        path: hasCtaLabel ? ["ctaUrl"] : ["ctaLabel"],
        message: "CTA precisa de rótulo e destino juntos.",
      });
    }

    if (value.isActive && !hasImage) {
      context.addIssue({
        code: "custom",
        path: ["existingImageUrl"],
        message: "Banner ativo precisa de imagem.",
      });
    }

    if (value.isActive && !hasCtaLabel) {
      context.addIssue({
        code: "custom",
        path: ["ctaLabel"],
        message: "Banner ativo precisa de CTA.",
      });
    }

    if (value.isActive && !hasCtaUrl) {
      context.addIssue({
        code: "custom",
        path: ["ctaUrl"],
        message: "Banner ativo precisa de destino válido.",
      });
    }
  });

export type AdminBannerInput = z.infer<typeof adminBannerSchema>;

export const adminBannerCtaPreviewSchema = z.object({
  title: z.string(),
  ctaLabel: emptyStringToNull,
  ctaUrl: emptyStringToNull,
});
