"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { FormEventHandler, RefObject } from "react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { SideSheet } from "@/components/admin/catalog/side-sheet";
import { StatusToggleButton } from "@/components/admin/catalog/status-toggle-button";
import { EmptyState } from "@/components/shared/empty-state";
import { saveBannerAction } from "@/features/admin/banners/mutations";
import type { AdminBannerListItem } from "@/features/admin/banners/types";
import { type AdminBannerInput, adminBannerSchema } from "@/lib/validations/admin-banners";

type BannerManagerProps = {
  items: AdminBannerListItem[];
};

const defaultValues: AdminBannerInput = {
  title: "",
  subtitle: null,
  ctaLabel: null,
  ctaUrl: null,
  position: 0,
  isActive: false,
  existingImageUrl: undefined,
};

export function BannerManager({ items }: BannerManagerProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminBannerListItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AdminBannerInput>({
    resolver: zodResolver(adminBannerSchema) as never,
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = form;

  function resetImageInput() {
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function openCreateSheet() {
    setEditingItem(null);
    setFeedback(null);
    form.reset(defaultValues);
    resetImageInput();
    setIsSheetOpen(true);
  }

  function openEditSheet(item: AdminBannerListItem) {
    setEditingItem(item);
    setFeedback(null);
    form.reset({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      ctaLabel: item.ctaLabel,
      ctaUrl: item.ctaUrl,
      position: item.position,
      isActive: item.isActive,
      existingImageUrl: item.imageUrl,
    });
    resetImageInput();
    setIsSheetOpen(true);
  }

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const formData = new FormData();

      if (values.id) {
        formData.set("id", values.id);
      }

      formData.set("title", values.title);
      formData.set("subtitle", values.subtitle ?? "");
      formData.set("ctaLabel", values.ctaLabel ?? "");
      formData.set("ctaUrl", values.ctaUrl ?? "");
      formData.set("position", String(values.position));
      formData.set("existingImageUrl", values.existingImageUrl ?? "");

      if (values.isActive) {
        formData.set("isActive", "on");
      }

      const file = imageInputRef.current?.files?.[0];
      if (file) {
        formData.set("image", file);
      }

      const result = await saveBannerAction(formData);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              setError(key as keyof AdminBannerInput, {
                message: messages[0],
              });
            }
          }
        }

        setFeedback(result.message);
        return;
      }

      setFeedback(result.message);
      setIsSheetOpen(false);
      router.refresh();
    });
  });

  if (items.length === 0) {
    return (
      <>
        <EmptyState
          action={
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
              onClick={openCreateSheet}
              type="button"
            >
              Criar banner
            </button>
          }
          description="Crie o primeiro banner para destacar promoções leves e atalhos de navegação na home."
          title="Nenhum banner cadastrado"
        />
        <BannerSheet
          editingItem={editingItem}
          errors={errors}
          feedback={feedback}
          imageInputRef={imageInputRef}
          isOpen={isSheetOpen}
          isPending={isPending}
          onClose={() => setIsSheetOpen(false)}
          onSubmit={onSubmit}
          register={register}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
            onClick={openCreateSheet}
            type="button"
          >
            Criar banner
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <article className="rounded-card border border-default bg-background p-4" key={item.id}>
              <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-default bg-surface text-xs text-muted">
                    {/* biome-ignore lint/performance/noImgElement: Admin preview uses arbitrary Supabase URLs without next/image config. */}
                    <img alt={item.title} className="h-full w-full object-cover" src={item.imageUrl} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    {item.subtitle ? (
                      <p className="mt-1 text-sm leading-6 text-muted">{item.subtitle}</p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                      <span>Posição {item.position}</span>
                      <span>{item.ctaLabel ?? "Sem CTA"}</span>
                    </div>
                    {item.ctaUrl ? (
                      <p className="mt-1 break-all text-xs text-muted">{item.ctaUrl}</p>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-card border border-default bg-surface p-4 text-sm text-muted">
                  <p className="font-medium text-foreground">Fluxo do upload</p>
                  <p className="mt-2 leading-6">
                    Escolher uma nova imagem substitui a atual apenas quando o registro for salvo.
                  </p>
                </div>

                <div className="flex items-start gap-4 xl:justify-end">
                  <StatusToggleButton id={item.id} isActive={item.isActive} table="banners" />
                  <button
                    className="text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
                    onClick={() => openEditSheet(item)}
                    type="button"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <BannerSheet
        editingItem={editingItem}
        errors={errors}
        feedback={feedback}
        imageInputRef={imageInputRef}
        isOpen={isSheetOpen}
        isPending={isPending}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={onSubmit}
        register={register}
      />
    </>
  );
}

type BannerSheetProps = {
  editingItem: AdminBannerListItem | null;
  isOpen: boolean;
  isPending: boolean;
  feedback: string | null;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: ReturnType<typeof useForm<AdminBannerInput>>["register"];
  errors: ReturnType<typeof useForm<AdminBannerInput>>["formState"]["errors"];
  imageInputRef: RefObject<HTMLInputElement | null>;
};

function BannerSheet({
  editingItem,
  isOpen,
  isPending,
  feedback,
  onClose,
  onSubmit,
  register,
  errors,
  imageInputRef,
}: BannerSheetProps) {
  return (
    <SideSheet
      description="Use imagens claras, CTA objetivo e posição simples para manter a home leve e orientada."
      onClose={onClose}
      open={isOpen}
      title={editingItem ? "Editar banner" : "Criar banner"}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <input type="hidden" {...register("id")} />
        <input type="hidden" {...register("existingImageUrl")} />

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Título</span>
          <input className={fieldClassName} placeholder="Promoções da semana" {...register("title")} />
          {errors.title?.message ? (
            <span className="text-sm text-error">{errors.title.message}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Subtítulo</span>
          <textarea
            className={`${fieldClassName} min-h-28 resize-y`}
            placeholder="Resumo curto para apoiar a navegação."
            {...register("subtitle")}
          />
          {errors.subtitle?.message ? (
            <span className="text-sm text-error">{errors.subtitle.message}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Imagem</span>
          <input
            accept="image/png,image/jpeg,image/webp"
            className={fieldClassName}
            ref={imageInputRef}
            type="file"
          />
          <span className="text-xs text-muted">
            Envie uma nova imagem para substituir a atual. O upload só vira banner publicado após
            salvar o registro.
          </span>
          {errors.existingImageUrl?.message ? (
            <span className="text-sm text-error">{errors.existingImageUrl.message}</span>
          ) : null}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Rótulo do CTA</span>
            <input className={fieldClassName} placeholder="Explorar ofertas" {...register("ctaLabel")} />
            {errors.ctaLabel?.message ? (
              <span className="text-sm text-error">{errors.ctaLabel.message}</span>
            ) : null}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Posição</span>
            <input className={fieldClassName} min="0" type="number" {...register("position")} />
            {errors.position?.message ? (
              <span className="text-sm text-error">{errors.position.message}</span>
            ) : null}
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Destino do CTA</span>
          <input
            className={fieldClassName}
            placeholder="/catalogo?promotion=1 ou https://..."
            {...register("ctaUrl")}
          />
          <span className="text-xs text-muted">
            Use uma rota interna começando com <code>/</code> ou URL completa com <code>http</code>.
          </span>
          {errors.ctaUrl?.message ? (
            <span className="text-sm text-error">{errors.ctaUrl.message}</span>
          ) : null}
        </label>

        <label className="flex items-center gap-3 rounded-card border border-default bg-background px-4 py-3 text-sm font-medium text-foreground">
          <input className="size-4 accent-primary" type="checkbox" {...register("isActive")} />
          Banner ativo
        </label>

        {feedback ? <p className="text-sm text-muted">{feedback}</p> : null}

        <div className="flex justify-end">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:opacity-70"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Salvando..." : "Salvar banner"}
          </button>
        </div>
      </form>
    </SideSheet>
  );
}

const fieldClassName =
  "min-h-12 w-full rounded-card border border-default bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/40";
