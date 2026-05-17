"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import {
  type CatalogPublicationStatus,
  getCatalogPublicationStatus,
  isPublicVariant,
} from "@/features/catalog/publication-rules";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  adminBrandSchema,
  adminCategorySchema,
  adminProductSchema,
  adminVariantSchema,
} from "@/lib/validations/admin-catalog";
import type { Database, TablesInsert, TablesUpdate } from "@/types/database";

type MutationResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  fieldErrors?: Record<string, string[] | undefined>;
};

type ProductPublicationProbe = {
  id: string;
  is_active: boolean;
  category_id: string | null;
  brand_id: string | null;
  categories: { is_active: boolean } | null;
  brands: { is_active: boolean } | null;
  product_variants:
    | {
        is_active: boolean;
        price: number;
        stock_status: string;
      }[]
    | null;
};

export type SaveProductResult = MutationResult<{
  id: string;
  publicationStatus: CatalogPublicationStatus;
}>;

export type SaveVariantResult = MutationResult<{
  id: string;
  isPurchasable: boolean;
}>;

type TypedSupabaseClient = SupabaseClient<Database>;

export async function saveProductAction(formData: FormData): Promise<SaveProductResult> {
  const accessState = await requireAdmin();
  const supabase = await getSupabaseServerClient();

  const parsed = adminProductSchema.safeParse({
    id: getOptionalString(formData, "id"),
    name: getRequiredString(formData, "name"),
    slug: getRequiredString(formData, "slug"),
    shortDescription: getOptionalString(formData, "shortDescription"),
    description: getOptionalString(formData, "description"),
    categoryId: getOptionalString(formData, "categoryId"),
    brandId: getOptionalString(formData, "brandId"),
    petType: getRequiredString(formData, "petType"),
    ageGroup: getRequiredString(formData, "ageGroup"),
    sizeGroup: getRequiredString(formData, "sizeGroup"),
    sortOrder: getRequiredString(formData, "sortOrder"),
    isActive: getCheckboxValue(formData, "isActive"),
    isFeatured: getCheckboxValue(formData, "isFeatured"),
    isPromotion: getCheckboxValue(formData, "isPromotion"),
    existingImageUrl: getOptionalString(formData, "existingImageUrl"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Revise os campos do produto.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = parsed.data;
  const imageFile = getOptionalFile(formData, "image");
  let imageUrl = input.existingImageUrl ?? null;

  if (imageFile) {
    const uploadResult = await uploadCatalogAsset(supabase, {
      bucket: "products",
      file: imageFile,
      pathPrefix: `${accessState.user.id}/${input.slug}`,
    });

    if (!uploadResult.success) {
      return {
        success: false,
        message: uploadResult.message,
      };
    }

    imageUrl = uploadResult.data?.publicUrl ?? null;
  }

  const payload = {
    name: input.name,
    slug: input.slug,
    short_description: input.shortDescription,
    description: input.description,
    category_id: input.categoryId,
    brand_id: input.brandId,
    pet_type: input.petType,
    age_group: input.ageGroup,
    size_group: input.sizeGroup,
    sort_order: input.sortOrder,
    is_active: input.isActive,
    is_featured: input.isFeatured,
    is_promotion: input.isPromotion,
    image_url: imageUrl,
  } satisfies TablesInsert<"products">;

  const operation = input.id
    ? supabase
        .from("products")
        .update(payload as TablesUpdate<"products">)
        .eq("id", input.id)
        .select("id")
        .single()
    : supabase.from("products").insert(payload).select("id").single();

  const { data, error } = await operation;

  if (error || !data) {
    return mapMutationError(error, "Não foi possível salvar o produto.");
  }

  const publicationStatus = await getProductPublicationStatus(supabase, data.id);

  revalidateCatalogAdminRoutes(data.id);

  return {
    success: true,
    message: input.id ? "Produto atualizado com sucesso." : "Produto criado com sucesso.",
    data: {
      id: data.id,
      publicationStatus,
    },
  };
}

export async function saveVariantAction(formData: FormData): Promise<SaveVariantResult> {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();

  const promotionalPriceValue = getOptionalString(formData, "promotionalPrice");
  const parsed = adminVariantSchema.safeParse({
    id: getOptionalString(formData, "id"),
    productId: getRequiredString(formData, "productId"),
    name: getRequiredString(formData, "name"),
    sku: getOptionalString(formData, "sku"),
    weight: getOptionalString(formData, "weight"),
    flavor: getOptionalString(formData, "flavor"),
    price: getRequiredString(formData, "price"),
    promotionalPrice:
      promotionalPriceValue && promotionalPriceValue.trim().length > 0
        ? promotionalPriceValue
        : null,
    stockStatus: getRequiredString(formData, "stockStatus"),
    sortOrder: getRequiredString(formData, "sortOrder"),
    isActive: getCheckboxValue(formData, "isActive"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Revise os campos da variante.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = parsed.data;
  const payload = {
    product_id: input.productId,
    name: input.name,
    sku: input.sku,
    weight: input.weight,
    flavor: input.flavor,
    price: input.price,
    promotional_price: input.promotionalPrice,
    stock_status: input.stockStatus,
    sort_order: input.sortOrder,
    is_active: input.isActive,
  } satisfies TablesInsert<"product_variants">;

  const operation = input.id
    ? supabase
        .from("product_variants")
        .update(payload as TablesUpdate<"product_variants">)
        .eq("id", input.id)
        .select("id, is_active, price, stock_status")
        .single()
    : supabase
        .from("product_variants")
        .insert(payload)
        .select("id, is_active, price, stock_status")
        .single();

  const { data, error } = await operation;

  if (error || !data) {
    return mapMutationError(error, "Não foi possível salvar a variante.");
  }

  revalidateCatalogAdminRoutes(input.productId);

  return {
    success: true,
    message: input.id ? "Variante atualizada com sucesso." : "Variante criada com sucesso.",
    data: {
      id: data.id,
      isPurchasable: isPublicVariant(data),
    },
  };
}

export async function saveCategoryAction(
  formData: FormData,
): Promise<MutationResult<{ id: string }>> {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();

  const parsed = adminCategorySchema.safeParse({
    id: getOptionalString(formData, "id"),
    name: getRequiredString(formData, "name"),
    slug: getRequiredString(formData, "slug"),
    description: getOptionalString(formData, "description"),
    icon: getOptionalString(formData, "icon"),
    color: getRequiredString(formData, "color"),
    sortOrder: getRequiredString(formData, "sortOrder"),
    isActive: getCheckboxValue(formData, "isActive"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Revise os campos da categoria.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = parsed.data;
  const payload = {
    name: input.name,
    slug: input.slug,
    description: input.description,
    icon: input.icon,
    color: input.color,
    sort_order: input.sortOrder,
    is_active: input.isActive,
  } satisfies TablesInsert<"categories">;

  const operation = input.id
    ? supabase
        .from("categories")
        .update(payload as TablesUpdate<"categories">)
        .eq("id", input.id)
        .select("id")
        .single()
    : supabase.from("categories").insert(payload).select("id").single();

  const { data, error } = await operation;

  if (error || !data) {
    return mapMutationError(error, "Não foi possível salvar a categoria.");
  }

  revalidateCatalogAdminRoutes();

  return {
    success: true,
    message: input.id ? "Categoria atualizada com sucesso." : "Categoria criada com sucesso.",
    data: { id: data.id },
  };
}

export async function saveBrandAction(formData: FormData): Promise<MutationResult<{ id: string }>> {
  const accessState = await requireAdmin();
  const supabase = await getSupabaseServerClient();

  const parsed = adminBrandSchema.safeParse({
    id: getOptionalString(formData, "id"),
    name: getRequiredString(formData, "name"),
    slug: getRequiredString(formData, "slug"),
    isActive: getCheckboxValue(formData, "isActive"),
    existingLogoUrl: getOptionalString(formData, "existingLogoUrl"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Revise os campos da marca.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = parsed.data;
  const logoFile = getOptionalFile(formData, "logo");
  let logoUrl = input.existingLogoUrl ?? null;

  if (logoFile) {
    const uploadResult = await uploadCatalogAsset(supabase, {
      bucket: "brands",
      file: logoFile,
      pathPrefix: `${accessState.user.id}/${input.slug}`,
    });

    if (!uploadResult.success) {
      return {
        success: false,
        message: uploadResult.message,
      };
    }

    logoUrl = uploadResult.data?.publicUrl ?? null;
  }

  const payload = {
    name: input.name,
    slug: input.slug,
    logo_url: logoUrl,
    is_active: input.isActive,
  } satisfies TablesInsert<"brands">;

  const operation = input.id
    ? supabase
        .from("brands")
        .update(payload as TablesUpdate<"brands">)
        .eq("id", input.id)
        .select("id")
        .single()
    : supabase.from("brands").insert(payload).select("id").single();

  const { data, error } = await operation;

  if (error || !data) {
    return mapMutationError(error, "Não foi possível salvar a marca.");
  }

  revalidateCatalogAdminRoutes();

  return {
    success: true,
    message: input.id ? "Marca atualizada com sucesso." : "Marca criada com sucesso.",
    data: { id: data.id },
  };
}

export async function toggleEntityActiveAction(input: {
  table: "products" | "product_variants" | "categories" | "brands";
  id: string;
  nextValue: boolean;
  productId?: string;
}): Promise<MutationResult> {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from(input.table)
    .update({ is_active: input.nextValue })
    .eq("id", input.id);

  if (error) {
    return mapMutationError(error, "Não foi possível atualizar o status.");
  }

  revalidateCatalogAdminRoutes(input.productId);

  return {
    success: true,
    message: input.nextValue ? "Item ativado com sucesso." : "Item desativado com sucesso.",
  };
}

function mapMutationError<T = undefined>(
  error: { code?: string; message: string } | null,
  fallbackMessage: string,
): MutationResult<T> {
  if (!error) {
    return {
      success: false,
      message: fallbackMessage,
    };
  }

  if (error.code === "23505") {
    return {
      success: false,
      message: "Já existe um registro com esse slug ou identificador único.",
    };
  }

  if (error.code === "23503") {
    return {
      success: false,
      message: "O relacionamento informado não é válido.",
    };
  }

  return {
    success: false,
    message: fallbackMessage,
  };
}

async function getProductPublicationStatus(client: TypedSupabaseClient, productId: string) {
  const { data, error } = await client
    .from("products")
    .select(
      `
        id,
        is_active,
        category_id,
        brand_id,
        categories ( is_active ),
        brands ( is_active ),
        product_variants ( is_active, price, stock_status )
      `,
    )
    .eq("id", productId)
    .single();

  if (error || !data) {
    throw new Error("Não foi possível recalcular o status de publicação do produto.");
  }

  const product = data as ProductPublicationProbe;

  return getCatalogPublicationStatus({
    isActive: product.is_active,
    categoryId: product.category_id,
    category: product.categories,
    brandId: product.brand_id,
    brand: product.brands,
    variants: product.product_variants ?? [],
  });
}

async function uploadCatalogAsset(
  client: TypedSupabaseClient,
  input: {
    bucket: "products" | "brands";
    file: File;
    pathPrefix: string;
  },
): Promise<MutationResult<{ path: string; publicUrl: string }>> {
  const extension = getFileExtension(input.file.name);
  const path = `${input.pathPrefix}-${Date.now()}.${extension}`;

  const { error } = await client.storage.from(input.bucket).upload(path, input.file, {
    upsert: true,
    contentType: input.file.type || undefined,
  });

  if (error) {
    return {
      success: false,
      message: "Não foi possível enviar o arquivo agora.",
    };
  }

  const { data } = client.storage.from(input.bucket).getPublicUrl(path);

  return {
    success: true,
    message: "Arquivo enviado com sucesso.",
    data: {
      path,
      publicUrl: data.publicUrl,
    },
  };
}

function getOptionalFile(formData: FormData, name: string) {
  const value = formData.get(name);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function getRequiredString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function getOptionalString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : null;
}

function getCheckboxValue(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function getFileExtension(filename: string) {
  const sanitized = filename.toLowerCase();
  if (sanitized.endsWith(".png")) {
    return "png";
  }
  if (sanitized.endsWith(".webp")) {
    return "webp";
  }
  return "jpg";
}

function revalidateCatalogAdminRoutes(productId?: string) {
  revalidatePath("/admin/produtos");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/marcas");
  revalidatePath("/catalogo");
  revalidatePath("/");

  if (productId) {
    revalidatePath(`/admin/produtos/${productId}`);
  }
}
