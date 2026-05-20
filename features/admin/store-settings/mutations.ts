"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/server/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  type AdminStoreSettingsInput,
  adminStoreSettingsSchema,
} from "@/lib/validations/admin-store-settings";
import type { TablesUpdate } from "@/types/database";

type SaveStoreSettingsResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function saveStoreSettingsAction(
  formData: FormData,
): Promise<SaveStoreSettingsResult> {
  await requireAdmin("/admin/configuracoes");
  const supabase = await getSupabaseServerClient();
  const parsed = adminStoreSettingsSchema.safeParse({
    id: getOptionalString(formData, "id"),
    storeName: getRequiredString(formData, "storeName"),
    description: getOptionalString(formData, "description"),
    whatsappPhone: getRequiredString(formData, "whatsappPhone"),
    instagramUrl: getOptionalString(formData, "instagramUrl"),
    address: getOptionalString(formData, "address"),
    openingHours: getOptionalString(formData, "openingHours"),
    googleMapsUrl: getOptionalString(formData, "googleMapsUrl"),
    deliveryEnabled: getCheckboxValue(formData, "deliveryEnabled"),
    pickupEnabled: getCheckboxValue(formData, "pickupEnabled"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Revise os dados da loja antes de salvar.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = parsed.data;

  if (!input.id) {
    return {
      success: false,
      message: "Configuração da loja não encontrada. Restaure o singleton antes de editar.",
    };
  }

  const { data: currentSettings, error: currentSettingsError } = await supabase
    .from("store_settings")
    .select("id")
    .eq("id", input.id)
    .maybeSingle();

  if (currentSettingsError) {
    return {
      success: false,
      message: "Não foi possível carregar a configuração da loja agora.",
    };
  }

  if (!currentSettings) {
    return {
      success: false,
      message:
        "A configuração da loja não existe mais. Restaure o singleton antes de tentar novamente.",
    };
  }

  const { error } = await supabase
    .from("store_settings")
    .update(toDatabasePayload(input) satisfies TablesUpdate<"store_settings">)
    .eq("id", input.id);

  if (error) {
    return {
      success: false,
      message: "Não foi possível salvar as configurações da loja.",
    };
  }

  revalidatePath("/admin/configuracoes");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/pedido");

  return {
    success: true,
    message: "Configurações da loja atualizadas com sucesso.",
  };
}

function toDatabasePayload(input: AdminStoreSettingsInput) {
  return {
    store_name: input.storeName,
    description: input.description,
    whatsapp_phone: input.whatsappPhone,
    instagram_url: input.instagramUrl,
    address: input.address,
    opening_hours: input.openingHours,
    google_maps_url: input.googleMapsUrl,
    delivery_enabled: input.deliveryEnabled,
    pickup_enabled: input.pickupEnabled,
  };
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
