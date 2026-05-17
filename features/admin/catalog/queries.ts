import "server-only";

import { cache } from "react";

import { getCatalogPublicationStatus, isPublicVariant } from "@/features/catalog/publication-rules";
import { requireAdmin } from "@/lib/server/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminProductFiltersInput } from "@/lib/validations/admin-catalog";
import type { Tables } from "@/types/database";

import type {
  AdminBrandListItem,
  AdminCatalogProductDetail,
  AdminCatalogProductListItem,
  AdminCatalogVariantItem,
  AdminCategoryListItem,
  AdminOptionItem,
  AdminProductListData,
} from "./types";

type ProductVariantRow = Pick<
  Tables<"product_variants">,
  | "id"
  | "name"
  | "sku"
  | "weight"
  | "flavor"
  | "price"
  | "promotional_price"
  | "stock_status"
  | "sort_order"
  | "is_active"
  | "updated_at"
>;

type ProductRow = Pick<
  Tables<"products">,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "short_description"
  | "pet_type"
  | "age_group"
  | "size_group"
  | "image_url"
  | "sort_order"
  | "is_active"
  | "is_featured"
  | "is_promotion"
  | "updated_at"
  | "category_id"
  | "brand_id"
> & {
  categories: Pick<Tables<"categories">, "id" | "name" | "slug" | "is_active"> | null;
  brands: Pick<Tables<"brands">, "id" | "name" | "slug" | "is_active"> | null;
  product_variants: ProductVariantRow[] | null;
};

type CategoryRow = Pick<
  Tables<"categories">,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "icon"
  | "color"
  | "sort_order"
  | "is_active"
  | "updated_at"
>;

type BrandRow = Pick<
  Tables<"brands">,
  "id" | "name" | "slug" | "logo_url" | "is_active" | "updated_at"
>;

export async function getAdminProductList(
  filters: AdminProductFiltersInput,
): Promise<AdminProductListData> {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();
  const [productsResult, categoriesResult, brandsResult] = await Promise.all([
    supabase
      .from("products")
      .select(
        `
          id,
          name,
          slug,
          description,
          short_description,
          pet_type,
          age_group,
          size_group,
          image_url,
          sort_order,
          is_active,
          is_featured,
          is_promotion,
          updated_at,
          category_id,
          brand_id,
          categories ( id, name, slug, is_active ),
          brands ( id, name, slug, is_active ),
          product_variants (
            id,
            name,
            sku,
            weight,
            flavor,
            price,
            promotional_price,
            stock_status,
            sort_order,
            is_active,
            updated_at
          )
        `,
      )
      .order("sort_order", { ascending: true }),
    supabase.from("categories").select("id, name, slug, is_active").order("sort_order"),
    supabase.from("brands").select("id, name, slug, is_active").order("name"),
  ]);

  if (productsResult.error) {
    throw new Error(`Failed to load admin products: ${productsResult.error.message}`);
  }
  if (categoriesResult.error) {
    throw new Error(`Failed to load category options: ${categoriesResult.error.message}`);
  }
  if (brandsResult.error) {
    throw new Error(`Failed to load brand options: ${brandsResult.error.message}`);
  }

  const items = (productsResult.data satisfies ProductRow[])
    .map(mapAdminProduct)
    .filter((item) => matchesAdminProductFilters(item, filters))
    .sort(sortAdminProducts);

  return {
    items,
    categoryOptions: categoriesResult.data.map(mapOption),
    brandOptions: brandsResult.data.map(mapOption),
  };
}

export const getAdminProductFormOptions = cache(async () => {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();
  const [categoriesResult, brandsResult] = await Promise.all([
    supabase.from("categories").select("id, name, slug, is_active").order("sort_order"),
    supabase.from("brands").select("id, name, slug, is_active").order("name"),
  ]);

  if (categoriesResult.error || brandsResult.error) {
    throw new Error("Failed to load product form options.");
  }

  return {
    categories: categoriesResult.data.map(mapOption),
    brands: brandsResult.data.map(mapOption),
  };
});

export async function getAdminProductDetail(
  productId: string,
): Promise<AdminCatalogProductDetail | null> {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        slug,
        description,
        short_description,
        pet_type,
        age_group,
        size_group,
        image_url,
        sort_order,
        is_active,
        is_featured,
        is_promotion,
        updated_at,
        category_id,
        brand_id,
        categories ( id, name, slug, is_active ),
        brands ( id, name, slug, is_active ),
        product_variants (
          id,
          name,
          sku,
          weight,
          flavor,
          price,
          promotional_price,
          stock_status,
          sort_order,
          is_active,
          updated_at
        )
      `,
    )
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load admin product detail: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapAdminProduct(data satisfies ProductRow);
}

export async function getAdminCategories(): Promise<AdminCategoryListItem[]> {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();
  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, description, icon, color, sort_order, is_active, updated_at")
      .order("sort_order"),
    supabase.from("products").select("id, category_id"),
  ]);

  if (categoriesResult.error || productsResult.error) {
    throw new Error("Failed to load admin categories.");
  }

  const counts = new Map<string, number>();
  for (const product of productsResult.data) {
    if (!product.category_id) {
      continue;
    }
    counts.set(product.category_id, (counts.get(product.category_id) ?? 0) + 1);
  }

  return (categoriesResult.data satisfies CategoryRow[]).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    color: category.color,
    sortOrder: category.sort_order,
    isActive: category.is_active,
    productCount: counts.get(category.id) ?? 0,
    updatedAt: category.updated_at,
  }));
}

export async function getAdminBrands(): Promise<AdminBrandListItem[]> {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();
  const [brandsResult, productsResult] = await Promise.all([
    supabase.from("brands").select("id, name, slug, logo_url, is_active, updated_at").order("name"),
    supabase.from("products").select("id, brand_id"),
  ]);

  if (brandsResult.error || productsResult.error) {
    throw new Error("Failed to load admin brands.");
  }

  const counts = new Map<string, number>();
  for (const product of productsResult.data) {
    if (!product.brand_id) {
      continue;
    }
    counts.set(product.brand_id, (counts.get(product.brand_id) ?? 0) + 1);
  }

  return (brandsResult.data satisfies BrandRow[]).map((brand) => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logoUrl: brand.logo_url,
    isActive: brand.is_active,
    productCount: counts.get(brand.id) ?? 0,
    updatedAt: brand.updated_at,
  }));
}

function mapOption(item: {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}): AdminOptionItem {
  return {
    id: item.id,
    label: item.name,
    slug: item.slug,
    isActive: item.is_active,
  };
}

function mapAdminProduct(product: ProductRow): AdminCatalogProductDetail {
  const variants = (product.product_variants ?? [])
    .slice()
    .sort(
      (left, right) =>
        left.sort_order - right.sort_order || left.name.localeCompare(right.name, "pt-BR"),
    )
    .map(mapVariant);

  const publicationStatus = getCatalogPublicationStatus({
    isActive: product.is_active,
    categoryId: product.category_id,
    category: product.categories,
    brandId: product.brand_id,
    brand: product.brands,
    variants: product.product_variants ?? [],
  });

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    imageUrl: product.image_url,
    description: product.description,
    shortDescription: product.short_description,
    petType: product.pet_type as AdminCatalogProductDetail["petType"],
    ageGroup: product.age_group as AdminCatalogProductDetail["ageGroup"],
    sizeGroup: product.size_group as AdminCatalogProductDetail["sizeGroup"],
    category: product.categories ? mapOption(product.categories) : null,
    brand: product.brands ? mapOption(product.brands) : null,
    sortOrder: product.sort_order,
    isActive: product.is_active,
    isFeatured: product.is_featured,
    isPromotion: product.is_promotion,
    updatedAt: product.updated_at,
    publicationStatus,
    variantCount: variants.length,
    validVariantCount: variants.filter((variant) => variant.isPurchasable).length,
    variants,
  };
}

function mapVariant(variant: ProductVariantRow): AdminCatalogVariantItem {
  return {
    id: variant.id,
    name: variant.name,
    sku: variant.sku,
    weight: variant.weight,
    flavor: variant.flavor,
    price: variant.price,
    promotionalPrice: variant.promotional_price,
    stockStatus: variant.stock_status as AdminCatalogVariantItem["stockStatus"],
    sortOrder: variant.sort_order,
    isActive: variant.is_active,
    isPurchasable: isPublicVariant(variant),
    updatedAt: variant.updated_at,
  };
}

function matchesAdminProductFilters(
  item: AdminCatalogProductListItem,
  filters: AdminProductFiltersInput,
) {
  if (filters.q) {
    const haystack = `${item.name} ${item.slug}`.toLocaleLowerCase("pt-BR");
    if (!haystack.includes(filters.q.toLocaleLowerCase("pt-BR"))) {
      return false;
    }
  }

  if (filters.status === "active" && !item.isActive) {
    return false;
  }

  if (filters.status === "inactive" && item.isActive) {
    return false;
  }

  if (filters.category && item.category?.slug !== filters.category) {
    return false;
  }

  if (filters.brand && item.brand?.slug !== filters.brand) {
    return false;
  }

  if (filters.promotion === "only" && !item.isPromotion) {
    return false;
  }

  if (filters.featured === "only" && !item.isFeatured) {
    return false;
  }

  return true;
}

function sortAdminProducts(left: AdminCatalogProductListItem, right: AdminCatalogProductListItem) {
  return left.sortOrder - right.sortOrder || left.name.localeCompare(right.name, "pt-BR");
}
