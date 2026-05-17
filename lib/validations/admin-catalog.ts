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

const emptyStringToNullish = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (value === "") {
      return null;
    }

    return value;
  }, schema.nullable());

const emptyStringToUndefinedSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return value;
  }, schema.optional());

const slugSchema = z
  .string()
  .trim()
  .min(1, "Informe o slug.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens.");

const uuidOrNullSchema = emptyStringToNullish(z.string().uuid());
const optionalUuidSchema = emptyStringToUndefinedSchema(z.string().uuid());

export const petTypeOptions = [
  { value: "dog", label: "Cachorro" },
  { value: "cat", label: "Gato" },
  { value: "both", label: "Cães e gatos" },
] as const;

export const ageGroupOptions = [
  { value: "puppy", label: "Filhote" },
  { value: "adult", label: "Adulto" },
  { value: "senior", label: "Sênior" },
  { value: "all", label: "Todas as idades" },
] as const;

export const sizeGroupOptions = [
  { value: "small", label: "Pequeno porte" },
  { value: "medium", label: "Médio porte" },
  { value: "large", label: "Grande porte" },
  { value: "all", label: "Todos os portes" },
] as const;

export const stockStatusOptions = [
  { value: "available", label: "Disponível" },
  { value: "consult", label: "Sob consulta" },
  { value: "unavailable", label: "Indisponível" },
] as const;

export const adminProductFiltersSchema = z.object({
  q: emptyStringToUndefined.optional(),
  status: z.enum(["all", "active", "inactive"]).optional().default("all"),
  category: emptyStringToUndefined.optional(),
  brand: emptyStringToUndefined.optional(),
  promotion: z.enum(["all", "only"]).optional().default("all"),
  featured: z.enum(["all", "only"]).optional().default("all"),
});

export type AdminProductFiltersInput = z.infer<typeof adminProductFiltersSchema>;

export function parseAdminProductFilters(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return adminProductFiltersSchema.parse({
    q: getSingleValue(searchParams.q),
    status: getSingleValue(searchParams.status),
    category: getSingleValue(searchParams.category),
    brand: getSingleValue(searchParams.brand),
    promotion: getSingleValue(searchParams.promotion),
    featured: getSingleValue(searchParams.featured),
  });
}

export const adminProductSchema = z.object({
  id: optionalUuidSchema,
  name: z.string().trim().min(1, "Informe o nome do produto."),
  slug: slugSchema,
  shortDescription: emptyStringToNull,
  description: emptyStringToNull,
  categoryId: uuidOrNullSchema,
  brandId: uuidOrNullSchema,
  petType: z.enum(["dog", "cat", "both"], {
    message: "Selecione o tipo de pet.",
  }),
  ageGroup: z.enum(["puppy", "adult", "senior", "all"], {
    message: "Selecione a faixa etária.",
  }),
  sizeGroup: z.enum(["small", "medium", "large", "all"], {
    message: "Selecione o porte.",
  }),
  sortOrder: z.coerce.number().int("Use um número inteiro.").min(0, "Use zero ou mais."),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isPromotion: z.boolean(),
  existingImageUrl: emptyStringToNullish(z.string().trim()).optional(),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;

export const adminVariantSchema = z
  .object({
    id: optionalUuidSchema,
    productId: z.string().uuid("Produto inválido."),
    name: z.string().trim().min(1, "Informe o nome da variante."),
    sku: emptyStringToNull,
    weight: emptyStringToNull,
    flavor: emptyStringToNull,
    price: z.coerce.number().min(0, "O preço deve ser zero ou maior."),
    promotionalPrice: emptyStringToNullish(z.coerce.number()),
    stockStatus: z.enum(["available", "consult", "unavailable"], {
      message: "Selecione o status de estoque.",
    }),
    sortOrder: z.coerce.number().int("Use um número inteiro.").min(0, "Use zero ou mais."),
    isActive: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.promotionalPrice !== null && value.promotionalPrice > value.price) {
      context.addIssue({
        code: "custom",
        path: ["promotionalPrice"],
        message: "O preço promocional deve ser menor ou igual ao preço principal.",
      });
    }
  });

export type AdminVariantInput = z.infer<typeof adminVariantSchema>;

export const adminCategorySchema = z.object({
  id: optionalUuidSchema,
  name: z.string().trim().min(1, "Informe o nome da categoria."),
  slug: slugSchema,
  description: emptyStringToNull,
  icon: emptyStringToNull,
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6})$/, "Use uma cor hexadecimal no formato #RRGGBB."),
  sortOrder: z.coerce.number().int("Use um número inteiro.").min(0, "Use zero ou mais."),
  isActive: z.boolean(),
});

export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;

export const adminBrandSchema = z.object({
  id: optionalUuidSchema,
  name: z.string().trim().min(1, "Informe o nome da marca."),
  slug: slugSchema,
  isActive: z.boolean(),
  existingLogoUrl: emptyStringToNullish(z.string().trim()).optional(),
});

export type AdminBrandInput = z.infer<typeof adminBrandSchema>;

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
