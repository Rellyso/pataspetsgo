import { z } from "zod";

const emptyToUndefined = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined));

export const catalogFiltersSchema = z.object({
  q: emptyToUndefined.optional(),
  category: emptyToUndefined.optional(),
  brand: emptyToUndefined.optional(),
  pet: z.enum(["dog", "cat", "both"]).optional(),
  age: z.enum(["puppy", "adult", "senior", "all"]).optional(),
  size: z.enum(["small", "medium", "large", "all"]).optional(),
  promotion: z
    .enum(["true", "1", "false", "0"])
    .transform((value) => value === "true" || value === "1")
    .optional(),
  sort: z.enum(["relevance", "name"]).optional().default("relevance"),
  page: z.coerce.number().int().positive().optional().default(1),
});

export type CatalogFiltersInput = z.infer<typeof catalogFiltersSchema>;

export function parseCatalogFilters(searchParams: Record<string, string | string[] | undefined>) {
  return catalogFiltersSchema.parse({
    q: getSingleValue(searchParams.q),
    category: getSingleValue(searchParams.category),
    brand: getSingleValue(searchParams.brand),
    pet: getSingleValue(searchParams.pet),
    age: getSingleValue(searchParams.age),
    size: getSingleValue(searchParams.size),
    promotion: getSingleValue(searchParams.promotion),
    sort: getSingleValue(searchParams.sort),
    page: getSingleValue(searchParams.page),
  });
}

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
