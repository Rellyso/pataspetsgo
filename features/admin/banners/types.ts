export type AdminBannerListItem = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  position: number;
  isActive: boolean;
  updatedAt: string;
};
