"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/server/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { adminBannerSchema } from "@/lib/validations/admin-banners";
import type { TablesInsert, TablesUpdate } from "@/types/database";

type MutationResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function saveBannerAction(
  formData: FormData,
): Promise<MutationResult<{ id: string }>> {
  const accessState = await requireAdmin("/admin/banners");
  const supabase = await getSupabaseServerClient();
  const imageFile = getOptionalFile(formData, "image");

  const parsed = adminBannerSchema.safeParse({
    id: getOptionalString(formData, "id"),
    title: getRequiredString(formData, "title"),
    subtitle: getOptionalString(formData, "subtitle"),
    ctaLabel: getOptionalString(formData, "ctaLabel"),
    ctaUrl: getOptionalString(formData, "ctaUrl"),
    position: getRequiredString(formData, "position"),
    isActive: getCheckboxValue(formData, "isActive"),
    existingImageUrl:
      getOptionalString(formData, "existingImageUrl") ?? (imageFile ? "__new_upload__" : null),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Revise os campos do banner.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = parsed.data;
  let imageUrl = normalizeExistingImageUrl(input.existingImageUrl);

  if (imageFile) {
    const uploadResult = await uploadBannerAsset(supabase, {
      file: imageFile,
      pathPrefix: `${accessState.user.id}/${slugifyBannerTitle(input.title)}`,
    });

    if (!uploadResult.success) {
      return {
        success: false,
        message: uploadResult.message,
      };
    }

    imageUrl = uploadResult.data?.publicUrl ?? null;
  }

  if (!imageUrl) {
    return {
      success: false,
      message: "Envie uma imagem para o banner.",
      fieldErrors: {
        existingImageUrl: ["Envie uma imagem para o banner."],
      },
    };
  }

  const payload = {
    title: input.title,
    subtitle: input.subtitle,
    image_url: imageUrl,
    cta_label: input.ctaLabel,
    cta_url: input.ctaUrl,
    position: input.position,
    is_active: input.isActive,
  } satisfies TablesInsert<"banners">;

  const operation = input.id
    ? supabase
        .from("banners")
        .update(payload as TablesUpdate<"banners">)
        .eq("id", input.id)
        .select("id")
        .single()
    : supabase.from("banners").insert(payload).select("id").single();

  const { data, error } = await operation;

  if (error || !data) {
    return mapMutationError(error, "Não foi possível salvar o banner.");
  }

  revalidateBannerRoutes();

  return {
    success: true,
    message: input.id ? "Banner atualizado com sucesso." : "Banner criado com sucesso.",
    data: { id: data.id },
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
      message: "Já existe um registro com esse identificador único.",
    };
  }

  return {
    success: false,
    message: fallbackMessage,
  };
}

async function uploadBannerAsset(
  client: Awaited<ReturnType<typeof getSupabaseServerClient>>,
  input: {
    file: File;
    pathPrefix: string;
  },
): Promise<MutationResult<{ path: string; publicUrl: string }>> {
  const extension = getFileExtension(input.file.name);
  const path = `${input.pathPrefix}-${Date.now()}.${extension}`;

  const { error } = await client.storage.from("banners").upload(path, input.file, {
    upsert: true,
    contentType: input.file.type || undefined,
  });

  if (error) {
    return {
      success: false,
      message: "Não foi possível enviar a imagem agora.",
    };
  }

  const { data } = client.storage.from("banners").getPublicUrl(path);

  return {
    success: true,
    message: "Imagem enviada com sucesso.",
    data: {
      path,
      publicUrl: data.publicUrl,
    },
  };
}

function revalidateBannerRoutes() {
  revalidatePath("/admin/banners");
  revalidatePath("/");
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

function slugifyBannerTitle(value: string) {
  return value
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}

function normalizeExistingImageUrl(value: string | undefined) {
  if (!value || value === "__new_upload__") {
    return null;
  }

  return value;
}
