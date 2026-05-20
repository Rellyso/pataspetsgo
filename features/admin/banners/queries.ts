import "server-only";

import { requireAdmin } from "@/lib/server/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

import type { AdminBannerListItem } from "./types";

type BannerRow = Pick<
  Tables<"banners">,
  | "id"
  | "title"
  | "subtitle"
  | "image_url"
  | "cta_label"
  | "cta_url"
  | "position"
  | "is_active"
  | "updated_at"
>;

export async function getAdminBanners(): Promise<AdminBannerListItem[]> {
  await requireAdmin("/admin/banners");
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("banners")
    .select("id, title, subtitle, image_url, cta_label, cta_url, position, is_active, updated_at")
    .order("position", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load admin banners: ${error.message}`);
  }

  return (data satisfies BannerRow[]).map((banner) => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle,
    imageUrl: banner.image_url,
    ctaLabel: banner.cta_label,
    ctaUrl: banner.cta_url,
    position: banner.position,
    isActive: banner.is_active,
    updatedAt: banner.updated_at,
  }));
}
