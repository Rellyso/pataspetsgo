import { cache } from "react";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CatalogFiltersInput } from "@/lib/validations/catalog";
import type { Tables } from "@/types/database";

import type {
  CatalogAvailableFilters,
  CatalogFilterOption,
  CatalogPageData,
  HomeCatalogData,
  PublicBanner,
  PublicBrandSummary,
  PublicCatalogItem,
  PublicCategorySummary,
  PublicProductDetail,
  PublicProductVariant,
  StoreSummary,
} from "./types";

type ProductVariantRow = Pick<
  Tables<"product_variants">,
  | "id"
  | "name"
  | "weight"
  | "flavor"
  | "price"
  | "promotional_price"
  | "stock_status"
  | "sort_order"
  | "is_active"
>;
type CategoryRow = Pick<
  Tables<"categories">,
  "id" | "name" | "slug" | "color" | "sort_order" | "is_active"
>;
type BrandRow = Pick<Tables<"brands">, "id" | "name" | "slug" | "logo_url" | "is_active">;
type BannerRow = Pick<
  Tables<"banners">,
  "id" | "title" | "subtitle" | "image_url" | "cta_label" | "cta_url" | "position" | "is_active"
>;
type StoreSettingsRow = Tables<"store_settings">;

type ProductWithRelations = Pick<
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
  | "category_id"
  | "brand_id"
> & {
  categories: CategoryRow | null;
  brands: BrandRow | null;
  product_variants: ProductVariantRow[] | null;
};

export const getHomeCatalogData = cache(async (): Promise<HomeCatalogData> => {
  const [storeSummary, activeBanners, publicProducts] = await Promise.all([
    getStoreSummary(),
    getActiveBanners(),
    getPublicProducts(),
  ]);

  const featuredProducts = publicProducts.filter((product) => product.isFeatured).slice(0, 6);
  const promotionProducts = publicProducts.filter(isPromotionProduct).slice(0, 6);

  const featuredCategories = Array.from(
    new Map(
      publicProducts
        .map((product) => product.category)
        .filter((category): category is PublicCategorySummary => category !== null)
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map((category) => [category.id, category]),
    ).values(),
  ).slice(0, 6);

  return {
    storeSummary,
    activeBanners,
    featuredCategories,
    featuredProducts,
    promotionProducts,
  };
});

export async function getCatalogPageData(filters: CatalogFiltersInput): Promise<CatalogPageData> {
  const publicProducts = await getPublicProducts();
  const items = applyCatalogFilters(publicProducts, filters);

  return {
    items,
    availableFilters: buildAvailableFilters(publicProducts),
    appliedFilters: {
      q: filters.q,
      category: filters.category,
      brand: filters.brand,
      pet: filters.pet,
      age: filters.age,
      size: filters.size,
      promotion: filters.promotion,
    },
    total: items.length,
    sort: filters.sort,
    page: filters.page,
  };
}

export async function getPublicProductBySlug(slug: string): Promise<PublicProductDetail | null> {
  const publicProducts = await getPublicProducts();
  return publicProducts.find((product) => product.slug === slug) ?? null;
}

const getPublicProducts = cache(async (): Promise<PublicCatalogItem[]> => {
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
        category_id,
        brand_id,
        categories (
          id,
          name,
          slug,
          color,
          sort_order,
          is_active
        ),
        brands (
          id,
          name,
          slug,
          logo_url,
          is_active
        ),
        product_variants (
          id,
          name,
          weight,
          flavor,
          price,
          promotional_price,
          stock_status,
          sort_order,
          is_active
        )
      `,
    )
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to load public catalog: ${error.message}`);
  }

  return (data satisfies ProductWithRelations[])
    .map(mapPublicProduct)
    .filter((product): product is PublicCatalogItem => product !== null)
    .sort(sortPublicProducts);
});

export const getStoreSummary = cache(async (): Promise<StoreSummary | null> => {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select("store_name, description, whatsapp_phone, delivery_enabled, pickup_enabled")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load store settings: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const row = data satisfies Pick<
    StoreSettingsRow,
    "store_name" | "description" | "whatsapp_phone" | "delivery_enabled" | "pickup_enabled"
  >;

  return {
    storeName: row.store_name,
    description: row.description,
    whatsappPhone: row.whatsapp_phone,
    deliveryEnabled: row.delivery_enabled,
    pickupEnabled: row.pickup_enabled,
  };
});

async function getActiveBanners(): Promise<PublicBanner[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("banners")
    .select("id, title, subtitle, image_url, cta_label, cta_url, position, is_active")
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error) {
    throw new Error(`Failed to load public banners: ${error.message}`);
  }

  return (data satisfies BannerRow[])
    .filter(
      (banner) =>
        banner.image_url && banner.title && (banner.cta_url === null || banner.cta_url.length > 0),
    )
    .map((banner) => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.image_url,
      ctaLabel: banner.cta_label,
      ctaUrl: banner.cta_url,
      position: banner.position,
    }));
}

function mapPublicProduct(product: ProductWithRelations): PublicCatalogItem | null {
  if (!isActiveRelationValid(product.categories, product.category_id)) {
    return null;
  }

  if (!isActiveRelationValid(product.brands, product.brand_id)) {
    return null;
  }

  const variants = (product.product_variants ?? [])
    .filter(isPublicVariant)
    .sort(
      (left, right) =>
        left.sort_order - right.sort_order || left.name.localeCompare(right.name, "pt-BR"),
    )
    .map(mapPublicVariant);

  if (variants.length === 0) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.short_description,
    petType: product.pet_type,
    ageGroup: product.age_group,
    sizeGroup: product.size_group,
    imageUrl: product.image_url,
    isFeatured: product.is_featured,
    isPromotion: product.is_promotion,
    sortOrder: product.sort_order,
    category: product.categories ? mapPublicCategory(product.categories) : null,
    brand: product.brands ? mapPublicBrand(product.brands) : null,
    variants,
    primaryVariant: variants[0],
  };
}

function isActiveRelationValid<T extends { is_active: boolean }>(
  relation: T | null,
  relationId: string | null,
) {
  return relationId === null || relation?.is_active === true;
}

function isPublicVariant(variant: ProductVariantRow) {
  return (
    variant.is_active &&
    variant.price >= 0 &&
    ["available", "consult"].includes(variant.stock_status)
  );
}

function mapPublicVariant(variant: ProductVariantRow): PublicProductVariant {
  return {
    id: variant.id,
    name: variant.name,
    weight: variant.weight,
    flavor: variant.flavor,
    price: variant.price,
    promotionalPrice: variant.promotional_price,
    stockStatus: variant.stock_status as "available" | "consult",
    sortOrder: variant.sort_order,
  };
}

function mapPublicCategory(category: CategoryRow): PublicCategorySummary {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    color: category.color,
    sortOrder: category.sort_order,
  };
}

function mapPublicBrand(brand: BrandRow): PublicBrandSummary {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logoUrl: brand.logo_url,
  };
}

function sortPublicProducts(left: PublicCatalogItem, right: PublicCatalogItem) {
  if (left.isFeatured !== right.isFeatured) {
    return left.isFeatured ? -1 : 1;
  }

  return left.sortOrder - right.sortOrder || left.name.localeCompare(right.name, "pt-BR");
}

function isPromotionProduct(product: PublicCatalogItem) {
  return (
    product.isPromotion && product.variants.some((variant) => variant.promotionalPrice !== null)
  );
}

function applyCatalogFilters(items: PublicCatalogItem[], filters: CatalogFiltersInput) {
  const filteredItems = items.filter((item) => {
    if (filters.q) {
      const haystack = `${item.name} ${item.shortDescription ?? ""}`.toLocaleLowerCase("pt-BR");
      if (!haystack.includes(filters.q.toLocaleLowerCase("pt-BR"))) {
        return false;
      }
    }

    if (filters.category && item.category?.slug !== filters.category) {
      return false;
    }

    if (filters.brand && item.brand?.slug !== filters.brand) {
      return false;
    }

    if (filters.pet && item.petType !== filters.pet) {
      return false;
    }

    if (filters.age && item.ageGroup !== filters.age) {
      return false;
    }

    if (filters.size && item.sizeGroup !== filters.size) {
      return false;
    }

    if (filters.promotion && !isPromotionProduct(item)) {
      return false;
    }

    return true;
  });

  if (filters.sort === "name") {
    return filteredItems.sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
  }

  return filteredItems.sort(sortPublicProducts);
}

function buildAvailableFilters(items: PublicCatalogItem[]): CatalogAvailableFilters {
  return {
    categories: buildOptionCounts(
      items,
      (item) => item.category?.slug,
      (item) => item.category?.name,
    ),
    brands: buildOptionCounts(
      items,
      (item) => item.brand?.slug,
      (item) => item.brand?.name,
    ),
    petTypes: buildOptionCounts(
      items,
      (item) => item.petType,
      (item) => item.petType,
    ),
    ageGroups: buildOptionCounts(
      items,
      (item) => item.ageGroup,
      (item) => item.ageGroup,
    ),
    sizeGroups: buildOptionCounts(
      items,
      (item) => item.sizeGroup,
      (item) => item.sizeGroup,
    ),
    promotionAvailable: items.some(isPromotionProduct),
  };
}

function buildOptionCounts(
  items: PublicCatalogItem[],
  getValue: (item: PublicCatalogItem) => string | undefined,
  getLabel: (item: PublicCatalogItem) => string | undefined,
): CatalogFilterOption[] {
  const counts = new Map<string, CatalogFilterOption>();

  for (const item of items) {
    const value = getValue(item);
    const label = getLabel(item);

    if (!value || !label) {
      continue;
    }

    const existing = counts.get(value);
    if (existing) {
      existing.count += 1;
      continue;
    }

    counts.set(value, { label, value, count: 1 });
  }

  return Array.from(counts.values()).sort((left, right) =>
    left.label.localeCompare(right.label, "pt-BR"),
  );
}
