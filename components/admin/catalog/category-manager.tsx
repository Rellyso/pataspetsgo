"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { FormEventHandler, ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import { type UseFormRegister, useForm } from "react-hook-form";

import { SideSheet } from "@/components/admin/catalog/side-sheet";
import { StatusToggleButton } from "@/components/admin/catalog/status-toggle-button";
import { EmptyState } from "@/components/shared/empty-state";
import { saveCategoryAction } from "@/features/admin/catalog/mutations";
import type { AdminCategoryListItem } from "@/features/admin/catalog/types";
import {
  type AdminCategoryInput,
  adminCategorySchema,
} from "@/lib/validations/admin-catalog";

type CategoryManagerProps = {
  items: AdminCategoryListItem[];
};

const defaultValues: AdminCategoryInput = {
  name: "",
  slug: "",
  description: null,
  icon: null,
  color: "#00A9C8",
  sortOrder: 0,
  isActive: true,
};

export function CategoryManager({ items }: CategoryManagerProps) {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminCategoryListItem | null>(
    null,
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AdminCategoryInput>({
    resolver: zodResolver(adminCategorySchema) as never,
    defaultValues,
  });

  const sortedItems = useMemo(
    () =>
      items
        .slice()
        .sort(
          (left, right) =>
            left.sortOrder - right.sortOrder ||
            left.name.localeCompare(right.name, "pt-BR"),
        ),
    [items],
  );

  function openCreateSheet() {
    setEditingItem(null);
    setFeedback(null);
    form.reset(defaultValues);
    setIsSheetOpen(true);
  }

  function openEditSheet(item: AdminCategoryListItem) {
    setEditingItem(item);
    setFeedback(null);
    form.reset({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      icon: item.icon,
      color: item.color,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
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
      appendCategoryFormData(formData, values);
      const result = await saveCategoryAction(formData);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              setError(key as keyof AdminCategoryInput, {
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
              Criar categoria
            </button>
          }
          description="Crie a primeira categoria para organizar a vitrine pública e os atalhos do catálogo."
          title="Nenhuma categoria cadastrada"
        />
        <CategorySheet
          errors={errors}
          feedback={feedback}
          isOpen={isSheetOpen}
          isPending={isPending}
          onClose={() => setIsSheetOpen(false)}
          onSubmit={onSubmit}
          register={register}
          title="Criar categoria"
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
            Criar categoria
          </button>
        </div>

        <div className="space-y-3 md:hidden">
          {sortedItems.map((item) => (
            <article
              className="rounded-card border border-default bg-background p-4"
              key={item.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex size-5 rounded-full border border-default"
                      style={{ backgroundColor: item.color }}
                    />
                    <h3 className="font-semibold text-foreground">
                      {item.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-muted">/{item.slug}</p>
                </div>
                <StatusToggleButton
                  id={item.id}
                  isActive={item.isActive}
                  table="categories"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
                <span>{item.productCount} produto(s)</span>
                <span>Ordem {item.sortOrder}</span>
              </div>
              <button
                className="mt-4 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
                onClick={() => openEditSheet(item)}
                type="button"
              >
                Editar categoria
              </button>
            </article>
          ))}
        </div>

        <div className="hidden md:block">
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <div
                className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,1fr)] items-start gap-4 rounded-card border border-default bg-background p-4"
                key={item.id}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex size-5 rounded-full border border-default"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted">/{item.slug}</p>
                    </div>
                  </div>
                  {item.description ? (
                    <p className="mt-2 text-sm text-muted">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <div className="text-sm text-muted">
                  <p>{item.productCount} produto(s)</p>
                  <p className="mt-1">Ordem {item.sortOrder}</p>
                </div>
                <StatusToggleButton
                  id={item.id}
                  isActive={item.isActive}
                  table="categories"
                />
                <div className="flex justify-end">
                  <button
                    className="text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
                    onClick={() => openEditSheet(item)}
                    type="button"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CategorySheet
        errors={errors}
        feedback={feedback}
        isOpen={isSheetOpen}
        isPending={isPending}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={onSubmit}
        register={register}
        title={editingItem ? "Editar categoria" : "Criar categoria"}
      />
    </>
  );
}

type CategorySheetProps = {
  title: string;
  isOpen: boolean;
  isPending: boolean;
  feedback: string | null;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<AdminCategoryInput>;
  errors: ReturnType<typeof useForm<AdminCategoryInput>>["formState"]["errors"];
};

function CategorySheet({
  title,
  isOpen,
  isPending,
  feedback,
  onClose,
  onSubmit,
  register,
  errors,
}: CategorySheetProps) {
  return (
    <SideSheet
      description="Use um formulário curto e direto para manter a organização do catálogo."
      onClose={onClose}
      open={isOpen}
      title={title}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <input type="hidden" {...register("id")} />
        <Field label="Nome" error={errors.name?.message}>
          <input
            className={fieldClassName}
            placeholder="Rações"
            {...register("name")}
          />
        </Field>
        <Field label="Slug" error={errors.slug?.message}>
          <input
            className={fieldClassName}
            placeholder="racoes"
            {...register("slug")}
          />
        </Field>
        <Field label="Descrição" error={errors.description?.message}>
          <textarea
            className={`${fieldClassName} min-h-28 resize-y`}
            placeholder="Resumo operacional da categoria."
            {...register("description")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ícone" error={errors.icon?.message}>
            <input
              className={fieldClassName}
              placeholder="bowl"
              {...register("icon")}
            />
          </Field>
          <Field label="Cor" error={errors.color?.message}>
            <input
              className={fieldClassName}
              placeholder="#00A9C8"
              {...register("color")}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ordem" error={errors.sortOrder?.message}>
            <input
              className={fieldClassName}
              min="0"
              type="number"
              {...register("sortOrder")}
            />
          </Field>
          <label className="flex items-center gap-3 rounded-card border border-default bg-background px-4 py-3 text-sm font-medium text-foreground">
            <input
              className="size-4 accent-primary"
              type="checkbox"
              {...register("isActive")}
            />
            Categoria ativa
          </label>
        </div>

        {feedback ? <p className="text-sm text-muted">{feedback}</p> : null}

        <div className="flex justify-end">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:opacity-70"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Salvando..." : "Salvar categoria"}
          </button>
        </div>
      </form>
    </SideSheet>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="text-sm text-error">{error}</span> : null}
    </div>
  );
}

const fieldClassName =
  "min-h-12 w-full rounded-card border border-default bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/40";

function appendCategoryFormData(
  formData: FormData,
  values: AdminCategoryInput,
) {
  if (values.id) {
    formData.set("id", values.id);
  }
  formData.set("name", values.name);
  formData.set("slug", values.slug);
  formData.set("description", values.description ?? "");
  formData.set("icon", values.icon ?? "");
  formData.set("color", values.color);
  formData.set("sortOrder", String(values.sortOrder));
  if (values.isActive) {
    formData.set("isActive", "on");
  }
}
