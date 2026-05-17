import type { CatalogPublicationStatus } from "@/features/catalog/publication-rules";

export type AdminOptionItem = {
  id: string;
  label: string;
  slug: string;
  isActive: boolean;
};

export type AdminCatalogVariantItem = {
  id: string;
  name: string;
  sku: string | null;
  weight: string | null;
  flavor: string | null;
  price: number;
  promotionalPrice: number | null;
  stockStatus: "available" | "consult" | "unavailable";
  sortOrder: number;
  isActive: boolean;
  isPurchasable: boolean;
  updatedAt: string;
};

export type AdminCatalogProductListItem = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  category: AdminOptionItem | null;
  brand: AdminOptionItem | null;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  isPromotion: boolean;
  updatedAt: string;
  publicationStatus: CatalogPublicationStatus;
  variantCount: number;
  validVariantCount: number;
};

export type AdminCatalogProductDetail = AdminCatalogProductListItem & {
  description: string | null;
  shortDescription: string | null;
  petType: "dog" | "cat" | "both";
  ageGroup: "puppy" | "adult" | "senior" | "all";
  sizeGroup: "small" | "medium" | "large" | "all";
  variants: AdminCatalogVariantItem[];
};

export type AdminCategoryListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  updatedAt: string;
};

export type AdminBrandListItem = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isActive: boolean;
  productCount: number;
  updatedAt: string;
};

export type AdminProductListData = {
  items: AdminCatalogProductListItem[];
  categoryOptions: AdminOptionItem[];
  brandOptions: AdminOptionItem[];
};
