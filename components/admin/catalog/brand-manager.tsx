"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { FormEventHandler, RefObject } from "react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { SideSheet } from "@/components/admin/catalog/side-sheet";
import { StatusToggleButton } from "@/components/admin/catalog/status-toggle-button";
import { EmptyState } from "@/components/shared/empty-state";
import { saveBrandAction } from "@/features/admin/catalog/mutations";
import type { AdminBrandListItem } from "@/features/admin/catalog/types";
import { type AdminBrandInput, adminBrandSchema } from "@/lib/validations/admin-catalog";

type BrandManagerProps = {
  items: AdminBrandListItem[];
};

const defaultValues: AdminBrandInput = {
  name: "",
  slug: "",
  isActive: true,
  existingLogoUrl: null,
};

export function BrandManager({ items }: BrandManagerProps) {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminBrandListItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AdminBrandInput>({
    resolver: zodResolver(adminBrandSchema) as never,
    defaultValues,
  });

  function openCreateSheet() {
    setEditingItem(null);
    setFeedback(null);
    form.reset(defaultValues);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
    setIsSheetOpen(true);
  }

  function openEditSheet(item: AdminBrandListItem) {
    setEditingItem(item);
    setFeedback(null);
    form.reset({
      id: item.id,
      name: item.name,
      slug: item.slug,
      isActive: item.isActive,
      existingLogoUrl: item.logoUrl,
    });
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
    setIsSheetOpen(true);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = form;

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const formData = new FormData();
      if (values.id) {
        formData.set("id", values.id);
      }
      formData.set("name", values.name);
      formData.set("slug", values.slug);
      formData.set("existingLogoUrl", values.existingLogoUrl ?? "");
      if (values.isActive) {
        formData.set("isActive", "on");
      }
      const file = logoInputRef.current?.files?.[0];
      if (file) {
        formData.set("logo", file);
      }

      const result = await saveBrandAction(formData);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              setError(key as keyof AdminBrandInput, { message: messages[0] });
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
              Criar marca
            </button>
          }
          description="Cadastre a primeira marca para enriquecer filtros e relacionamento dos produtos."
          title="Nenhuma marca cadastrada"
        />
        <BrandSheet
          editingItem={editingItem}
          errors={errors}
          feedback={feedback}
          isOpen={isSheetOpen}
          isPending={isPending}
          logoInputRef={logoInputRef}
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
            Criar marca
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <article className="rounded-card border border-default bg-background p-4" key={item.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-default bg-surface text-xs text-muted">
                    {item.logoUrl ? (
                      /* biome-ignore lint/performance/noImgElement: Admin preview needs to render arbitrary stored URLs without remote image configuration. */
                      <img
                        alt={item.name}
                        className="h-full w-full object-cover"
                        src={item.logoUrl}
                      />
                    ) : (
                      <span>Sem logo</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted">/{item.slug}</p>
                    <p className="mt-2 text-xs text-muted">
                      {item.productCount} produto(s) vinculados
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <StatusToggleButton id={item.id} isActive={item.isActive} table="brands" />
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

      <BrandSheet
        editingItem={editingItem}
        errors={errors}
        feedback={feedback}
        isOpen={isSheetOpen}
        isPending={isPending}
        logoInputRef={logoInputRef}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={onSubmit}
        register={register}
      />
    </>
  );
}

type BrandSheetProps = {
  editingItem: AdminBrandListItem | null;
  isOpen: boolean;
  isPending: boolean;
  feedback: string | null;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: ReturnType<typeof useForm<AdminBrandInput>>["register"];
  errors: ReturnType<typeof useForm<AdminBrandInput>>["formState"]["errors"];
  logoInputRef: RefObject<HTMLInputElement | null>;
};

function BrandSheet({
  editingItem,
  isOpen,
  isPending,
  feedback,
  onClose,
  onSubmit,
  register,
  errors,
  logoInputRef,
}: BrandSheetProps) {
  return (
    <SideSheet
      description="Use a logo da marca quando ela ajudar a leitura operacional e os filtros públicos."
      onClose={onClose}
      open={isOpen}
      title={editingItem ? "Editar marca" : "Criar marca"}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <input type="hidden" {...register("id")} />
        <input type="hidden" {...register("existingLogoUrl")} />
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Nome</span>
          <input className={fieldClassName} placeholder="GranPlus" {...register("name")} />
          {errors.name?.message ? (
            <span className="text-sm text-error">{errors.name.message}</span>
          ) : null}
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Slug</span>
          <input className={fieldClassName} placeholder="granplus" {...register("slug")} />
          {errors.slug?.message ? (
            <span className="text-sm text-error">{errors.slug.message}</span>
          ) : null}
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Logo</span>
          <input
            accept="image/png,image/jpeg,image/webp"
            className={fieldClassName}
            ref={logoInputRef}
            type="file"
          />
          <span className="text-xs text-muted">
            Envie uma nova logo para substituir a atual. Se não enviar nada, a referência salva
            continua a mesma.
          </span>
        </label>
        <label className="flex items-center gap-3 rounded-card border border-default bg-background px-4 py-3 text-sm font-medium text-foreground">
          <input className="size-4 accent-primary" type="checkbox" {...register("isActive")} />
          Marca ativa
        </label>

        {feedback ? <p className="text-sm text-muted">{feedback}</p> : null}

        <div className="flex justify-end">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:opacity-70"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Salvando..." : "Salvar marca"}
          </button>
        </div>
      </form>
    </SideSheet>
  );
}

const fieldClassName =
  "min-h-12 w-full rounded-card border border-default bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/40";
