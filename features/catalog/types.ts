export type PublicCategorySummary = {
  id: string;
  name: string;
  slug: string;
  color: string;
  sortOrder: number;
};

export type PublicBrandSummary = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
};

export type PublicProductVariant = {
  id: string;
  name: string;
  weight: string | null;
  flavor: string | null;
  price: number;
  promotionalPrice: number | null;
  stockStatus: "available" | "consult";
  sortOrder: number;
};

export type PublicCatalogItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  petType: string;
  ageGroup: string;
  sizeGroup: string;
  imageUrl: string | null;
  isFeatured: boolean;
  isPromotion: boolean;
  sortOrder: number;
  category: PublicCategorySummary | null;
  brand: PublicBrandSummary | null;
  variants: PublicProductVariant[];
  primaryVariant: PublicProductVariant;
};

export type PublicBanner = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
  position: number;
};

export type StoreSummary = {
  storeName: string;
  description: string | null;
  whatsappPhone: string;
  instagramUrl: string | null;
  address: string | null;
  openingHours: string | null;
  googleMapsUrl: string | null;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
};

export type HomeCatalogData = {
  storeSummary: StoreSummary | null;
  activeBanners: PublicBanner[];
  featuredCategories: PublicCategorySummary[];
  featuredProducts: PublicCatalogItem[];
  promotionProducts: PublicCatalogItem[];
};

export type CatalogFilterOption = {
  label: string;
  value: string;
  count: number;
};

export type CatalogAvailableFilters = {
  categories: CatalogFilterOption[];
  brands: CatalogFilterOption[];
  petTypes: CatalogFilterOption[];
  ageGroups: CatalogFilterOption[];
  sizeGroups: CatalogFilterOption[];
  promotionAvailable: boolean;
};

export type CatalogAppliedFilters = {
  q?: string;
  category?: string;
  brand?: string;
  pet?: string;
  age?: string;
  size?: string;
  promotion?: boolean;
};

export type CatalogPageData = {
  items: PublicCatalogItem[];
  availableFilters: CatalogAvailableFilters;
  appliedFilters: CatalogAppliedFilters;
  total: number;
  sort: "relevance" | "name";
  page: number;
};

export type PublicProductDetail = PublicCatalogItem;
