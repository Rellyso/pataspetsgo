import "server-only";

import { requireAdmin } from "@/lib/server/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

import type { AdminStoreSettings } from "./types";

type StoreSettingsRow = Pick<
  Tables<"store_settings">,
  | "id"
  | "store_name"
  | "description"
  | "whatsapp_phone"
  | "instagram_url"
  | "address"
  | "opening_hours"
  | "google_maps_url"
  | "delivery_enabled"
  | "pickup_enabled"
  | "updated_at"
>;

export async function getAdminStoreSettings(): Promise<AdminStoreSettings | null> {
  await requireAdmin("/admin/configuracoes");
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select(
      "id, store_name, description, whatsapp_phone, instagram_url, address, opening_hours, google_maps_url, delivery_enabled, pickup_enabled, updated_at",
    )
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load store settings: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const row = data satisfies StoreSettingsRow;

  return {
    id: row.id,
    storeName: row.store_name,
    description: row.description,
    whatsappPhone: row.whatsapp_phone,
    instagramUrl: row.instagram_url,
    address: row.address,
    openingHours: row.opening_hours,
    googleMapsUrl: row.google_maps_url,
    deliveryEnabled: row.delivery_enabled,
    pickupEnabled: row.pickup_enabled,
    updatedAt: row.updated_at,
  };
}
