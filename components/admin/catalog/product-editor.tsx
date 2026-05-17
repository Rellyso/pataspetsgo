"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import {
  cloneElement,
  isValidElement,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";

import { PublicationBadge } from "@/components/admin/catalog/publication-badge";
import { SideSheet } from "@/components/admin/catalog/side-sheet";
import { StatusToggleButton } from "@/components/admin/catalog/status-toggle-button";
import { saveProductAction, saveVariantAction } from "@/features/admin/catalog/mutations";
import type {
  AdminCatalogProductDetail,
  AdminCatalogVariantItem,
  AdminOptionItem,
} from "@/features/admin/catalog/types";
import { formatCurrency } from "@/lib/currency";
import {
  type AdminProductInput,
  type AdminVariantInput,
  adminProductSchema,
  adminVariantSchema,
  ageGroupOptions,
  petTypeOptions,
  sizeGroupOptions,
  stockStatusOptions,
} from "@/lib/validations/admin-catalog";

type ProductEditorProps = {
  mode: "create" | "edit";
  product: AdminCatalogProductDetail | null;
  categoryOptions: AdminOptionItem[];
  brandOptions: AdminOptionItem[];
};

const productDefaults: AdminProductInput = {
  name: "",
  slug: "",
  shortDescription: null,
  description: null,
  categoryId: null,
  brandId: null,
  petType: "dog",
  ageGroup: "adult",
  sizeGroup: "all",
  sortOrder: 0,
  isActive: true,
  isFeatured: false,
  isPromotion: false,
  existingImageUrl: null,
};

const variantDefaults: AdminVariantInput = {
  productId: "",
  name: "",
  sku: null,
  weight: null,
  flavor: null,
  price: 0,
  promotionalPrice: null,
  stockStatus: "available",
  sortOrder: 0,
  isActive: true,
};

export function ProductEditor({
  mode,
  product,
  categoryOptions,
  brandOptions,
}: ProductEditorProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [variantFeedback, setVariantFeedback] = useState<string | null>(null);
  const [variantSheetOpen, setVariantSheetOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<AdminCatalogVariantItem | null>(null);
  const [isProductPending, startProductTransition] = useTransition();
  const [isVariantPending, startVariantTransition] = useTransition();

  const productForm = useForm<AdminProductInput>({
    resolver: zodResolver(adminProductSchema) as never,
    defaultValues: product
      ? {
          id: product.id,
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription,
          description: product.description,
          categoryId: product.category?.id ?? null,
          brandId: product.brand?.id ?? null,
          petType: product.petType,
          ageGroup: product.ageGroup,
          sizeGroup: product.sizeGroup,
          sortOrder: product.sortOrder,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isPromotion: product.isPromotion,
          existingImageUrl: product.imageUrl,
        }
      : productDefaults,
  });

  const variantForm = useForm<AdminVariantInput>({
    resolver: zodResolver(adminVariantSchema) as never,
    defaultValues: {
      ...variantDefaults,
      productId: product?.id ?? "",
    },
  });

  const safeProduct = product;

  function openCreateVariantSheet() {
    if (!safeProduct) {
      return;
    }
    setEditingVariant(null);
    setVariantFeedback(null);
    variantForm.reset({
      ...variantDefaults,
      productId: safeProduct.id,
    });
    setVariantSheetOpen(true);
  }

  function openEditVariantSheet(variant: AdminCatalogVariantItem) {
    if (!safeProduct) {
      return;
    }
    setEditingVariant(variant);
    setVariantFeedback(null);
    variantForm.reset({
      id: variant.id,
      productId: safeProduct.id,
      name: variant.name,
      sku: variant.sku,
      weight: variant.weight,
      flavor: variant.flavor,
      price: variant.price,
      promotionalPrice: variant.promotionalPrice,
      stockStatus: variant.stockStatus,
      sortOrder: variant.sortOrder,
      isActive: variant.isActive,
    });
    setVariantSheetOpen(true);
  }

  const productSubmit = productForm.handleSubmit((values) => {
    startProductTransition(async () => {
      const formData = new FormData();
      appendProductFormData(formData, values);
      const file = imageInputRef.current?.files?.[0];
      if (file) {
        formData.set("image", file);
      }

      const result = await saveProductAction(formData);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              productForm.setError(key as keyof AdminProductInput, {
                message: messages[0],
              });
            }
          }
        }
        setFeedback(result.message);
        return;
      }

      setFeedback(result.message);
      if (mode === "create" && result.data?.id) {
        router.replace(`/admin/produtos/${result.data.id}`);
        return;
      }

      router.refresh();
    });
  });

  const variantSubmit = variantForm.handleSubmit((values) => {
    startVariantTransition(async () => {
      const formData = new FormData();
      appendVariantFormData(formData, values);
      const result = await saveVariantAction(formData);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              variantForm.setError(key as keyof AdminVariantInput, {
                message: messages[0],
              });
            }
          }
        }
        setVariantFeedback(result.message);
        return;
      }

      setVariantFeedback(result.message);
      setVariantSheetOpen(false);
      router.refresh();
    });
  });

  const variantSummary = useMemo(() => {
    if (!safeProduct) {
      return null;
    }

    return {
      total: safeProduct.variants.length,
      valid: safeProduct.variants.filter((variant) => variant.isPurchasable).length,
    };
  }, [safeProduct]);

  const {
    register,
    formState: { errors },
  } = productForm;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <form
          className="space-y-6 rounded-card border border-default bg-surface p-6 shadow-soft"
          onSubmit={productSubmit}
        >
          <input type="hidden" {...register("id")} />
          <input type="hidden" {...register("existingImageUrl")} />

          <Section
            title="Identidade básica"
            description="Use nome e slug claros para facilitar leitura operacional e URL pública."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome" error={errors.name?.message}>
                <input
                  className={fieldClassName}
                  placeholder="Ração GranPlus Adulto"
                  {...register("name")}
                />
              </Field>
              <Field label="Slug" error={errors.slug?.message}>
                <input
                  className={fieldClassName}
                  placeholder="racao-granplus-adulto"
                  {...register("slug")}
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Categorização"
            description="Categoria e marca podem ficar vazias, mas isso afeta a prontidão da vitrine."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Categoria" error={errors.categoryId?.message}>
                <select className={fieldClassName} {...register("categoryId")}>
                  <option value="">Sem categoria</option>
                  {categoryOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                      {item.isActive ? "" : " (inativa)"}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Marca" error={errors.brandId?.message}>
                <select className={fieldClassName} {...register("brandId")}>
                  <option value="">Sem marca</option>
                  {brandOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                      {item.isActive ? "" : " (inativa)"}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section
            title="Imagem principal"
            description="O arquivo enviado substitui a imagem principal atual; se nada for enviado, a referência salva continua a mesma."
          >
            {safeProduct?.imageUrl ? (
              <div className="mb-4 flex items-center gap-4 rounded-card border border-default bg-background p-4">
                <div className="flex size-18 items-center justify-center overflow-hidden rounded-2xl border border-default bg-surface">
                  {/* biome-ignore lint/performance/noImgElement: Admin preview needs to render arbitrary stored URLs without remote image configuration. */}
                  <img
                    alt={safeProduct.name}
                    className="h-full w-full object-cover"
                    src={safeProduct.imageUrl}
                  />
                </div>
                <div className="text-sm text-muted">
                  <p>Imagem principal atual vinculada.</p>
                  <p className="mt-1">Envie um novo arquivo apenas se quiser substituir.</p>
                </div>
              </div>
            ) : null}
            <input
              accept="image/png,image/jpeg,image/webp"
              className={fieldClassName}
              ref={imageInputRef}
              type="file"
            />
          </Section>

          <Section
            title="Descrições"
            description="A descrição curta ajuda a escanear a listagem; a longa apoia a página de produto."
          >
            <div className="grid gap-4">
              <Field label="Descrição curta" error={errors.shortDescription?.message}>
                <textarea
                  className={`${fieldClassName} min-h-24 resize-y`}
                  {...register("shortDescription")}
                />
              </Field>
              <Field label="Descrição longa" error={errors.description?.message}>
                <textarea
                  className={`${fieldClassName} min-h-36 resize-y`}
                  {...register("description")}
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Público do pet"
            description="Use labels em português para tornar a manutenção rápida para a operação."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Pet" error={errors.petType?.message}>
                <select className={fieldClassName} {...register("petType")}>
                  {petTypeOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Faixa etária" error={errors.ageGroup?.message}>
                <select className={fieldClassName} {...register("ageGroup")}>
                  {ageGroupOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Porte" error={errors.sizeGroup?.message}>
                <select className={fieldClassName} {...register("sizeGroup")}>
                  {sizeGroupOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section
            title="Status e prioridade"
            description="O produto pode ser salvo ativo mesmo antes de estar publicável."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Ordem" error={errors.sortOrder?.message}>
                <input
                  className={fieldClassName}
                  min="0"
                  type="number"
                  {...register("sortOrder")}
                />
              </Field>
              <div className="grid gap-3">
                <CheckboxCard label="Produto ativo" registration={register("isActive")} />
                <CheckboxCard label="Produto em destaque" registration={register("isFeatured")} />
                <CheckboxCard label="Produto em promoção" registration={register("isPromotion")} />
              </div>
            </div>
          </Section>

          {feedback ? <p className="text-sm text-muted">{feedback}</p> : null}

          <div className="flex justify-end">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:opacity-70"
              disabled={isProductPending}
              type="submit"
            >
              {isProductPending
                ? "Salvando..."
                : mode === "create"
                  ? "Criar produto"
                  : "Salvar alterações"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <section className="rounded-card border border-default bg-surface p-5 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Prontidão da vitrine
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              A publicação pública segue o mesmo contrato do catálogo. Esta leitura evita promoção
              vazia e produto sem variante válida.
            </p>
            <div className="mt-4">
              {safeProduct ? (
                <PublicationBadge status={safeProduct.publicationStatus} />
              ) : (
                <p className="text-sm text-muted">
                  Salve o produto para acompanhar o status operacional da vitrine.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-card border border-default bg-surface p-5 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground">Contexto rápido</h2>
            <div className="mt-4 grid gap-3">
              <MetricCard
                label="Variantes"
                value={variantSummary ? String(variantSummary.total) : "0"}
              />
              <MetricCard
                label="Compráveis"
                value={variantSummary ? String(variantSummary.valid) : "0"}
              />
              <MetricCard
                label="Atualização"
                value={safeProduct ? formatDate(safeProduct.updatedAt) : "Ainda não salvo"}
              />
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Variantes do produto
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Preço, promoção, disponibilidade e ordem ficam dentro do contexto do produto para
              manter o fluxo simples.
            </p>
          </div>
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!safeProduct}
            onClick={openCreateVariantSheet}
            type="button"
          >
            Criar variante
          </button>
        </div>

        {safeProduct ? (
          safeProduct.variants.length > 0 ? (
            <div className="mt-5 space-y-3">
              {safeProduct.variants.map((variant) => (
                <article
                  className="rounded-card border border-default bg-background p-4"
                  key={variant.id}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{variant.name}</h3>
                        <span
                          className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                            variant.isPurchasable
                              ? "border-success/20 bg-success/10 text-success"
                              : "border-warning/20 bg-warning/10 text-warning"
                          }`}
                        >
                          {variant.isPurchasable ? "Comprável" : "Não comprável"}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted">
                        <span>{formatCurrency(variant.price)}</span>
                        <span>
                          {variant.promotionalPrice !== null
                            ? `Promo ${formatCurrency(variant.promotionalPrice)}`
                            : "Sem promoção"}
                        </span>
                        <span>{stockStatusLabelMap[variant.stockStatus]}</span>
                        <span>Ordem {variant.sortOrder}</span>
                        {variant.sku ? <span>SKU {variant.sku}</span> : null}
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <StatusToggleButton
                        id={variant.id}
                        isActive={variant.isActive}
                        productId={safeProduct.id}
                        table="product_variants"
                      />
                      <button
                        className="text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
                        onClick={() => openEditVariantSheet(variant)}
                        type="button"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-card border border-default bg-background p-5 text-sm text-muted">
              Este produto ainda não está pronto para a vitrine. Crie pelo menos uma variante válida
              para liberar a compra pública.
            </div>
          )
        ) : (
          <div className="mt-5 rounded-card border border-default bg-background p-5 text-sm text-muted">
            Salve o produto primeiro para liberar o cadastro de variantes.
          </div>
        )}
      </section>

      <SideSheet
        description="A variante deve deixar claro preço, promoção, disponibilidade e prioridade."
        onClose={() => setVariantSheetOpen(false)}
        open={variantSheetOpen}
        title={editingVariant ? "Editar variante" : "Criar variante"}
      >
        <form className="space-y-4" onSubmit={variantSubmit}>
          <input type="hidden" {...variantForm.register("id")} />
          <input type="hidden" {...variantForm.register("productId")} />
          <Field label="Nome" error={variantForm.formState.errors.name?.message}>
            <input
              className={fieldClassName}
              placeholder="3 kg"
              {...variantForm.register("name")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SKU" error={variantForm.formState.errors.sku?.message}>
              <input
                className={fieldClassName}
                placeholder="GP-3KG"
                {...variantForm.register("sku")}
              />
            </Field>
            <Field label="Peso" error={variantForm.formState.errors.weight?.message}>
              <input
                className={fieldClassName}
                placeholder="3 kg"
                {...variantForm.register("weight")}
              />
            </Field>
          </div>
          <Field label="Sabor" error={variantForm.formState.errors.flavor?.message}>
            <input
              className={fieldClassName}
              placeholder="Frango e arroz"
              {...variantForm.register("flavor")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Preço" error={variantForm.formState.errors.price?.message}>
              <input
                className={fieldClassName}
                min="0"
                step="0.01"
                type="number"
                {...variantForm.register("price")}
              />
            </Field>
            <Field
              label="Preço promocional"
              error={variantForm.formState.errors.promotionalPrice?.message}
            >
              <input
                className={fieldClassName}
                min="0"
                step="0.01"
                type="number"
                {...variantForm.register("promotionalPrice")}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Status de estoque"
              error={variantForm.formState.errors.stockStatus?.message}
            >
              <select className={fieldClassName} {...variantForm.register("stockStatus")}>
                {stockStatusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ordem" error={variantForm.formState.errors.sortOrder?.message}>
              <input
                className={fieldClassName}
                min="0"
                type="number"
                {...variantForm.register("sortOrder")}
              />
            </Field>
          </div>
          <CheckboxCard label="Variante ativa" registration={variantForm.register("isActive")} />

          {variantFeedback ? <p className="text-sm text-muted">{variantFeedback}</p> : null}

          <div className="flex justify-end">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:opacity-70"
              disabled={isVariantPending}
              type="submit"
            >
              {isVariantPending ? "Salvando..." : "Salvar variante"}
            </button>
          </div>
        </form>
      </SideSheet>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-default pb-6 last:border-b-0 last:pb-0">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  const id = useId();
  let child = children;

  if (isValidElement(children)) {
    // biome-ignore lint/suspicious/noExplicitAny: <for here>
    const childProps: any = (children as any).props || {};
    if (!childProps.id) {
      // biome-ignore lint/suspicious/noExplicitAny: <for here>
      child = cloneElement(children as ReactElement<any>, { id } as any);
    }
  }

  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {child}
      {error ? <span className="text-sm text-error">{error}</span> : null}
    </label>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-default bg-background px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function CheckboxCard({
  label,
  registration,
}: {
  label: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <label className="flex items-center gap-3 rounded-card border border-default bg-background px-4 py-3 text-sm font-medium text-foreground">
      <input className="size-4 accent-primary" type="checkbox" {...registration} />
      {label}
    </label>
  );
}

const fieldClassName =
  "min-h-12 w-full rounded-card border border-default bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/40";

const stockStatusLabelMap: Record<AdminCatalogVariantItem["stockStatus"], string> = {
  available: "Disponível",
  consult: "Sob consulta",
  unavailable: "Indisponível",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function appendProductFormData(formData: FormData, values: AdminProductInput) {
  if (values.id) {
    formData.set("id", values.id);
  }
  formData.set("name", values.name);
  formData.set("slug", values.slug);
  formData.set("shortDescription", values.shortDescription ?? "");
  formData.set("description", values.description ?? "");
  formData.set("categoryId", values.categoryId ?? "");
  formData.set("brandId", values.brandId ?? "");
  formData.set("petType", values.petType);
  formData.set("ageGroup", values.ageGroup);
  formData.set("sizeGroup", values.sizeGroup);
  formData.set("sortOrder", String(values.sortOrder));
  formData.set("existingImageUrl", values.existingImageUrl ?? "");
  if (values.isActive) {
    formData.set("isActive", "on");
  }
  if (values.isFeatured) {
    formData.set("isFeatured", "on");
  }
  if (values.isPromotion) {
    formData.set("isPromotion", "on");
  }
}

function appendVariantFormData(formData: FormData, values: AdminVariantInput) {
  if (values.id) {
    formData.set("id", values.id);
  }
  formData.set("productId", values.productId);
  formData.set("name", values.name);
  formData.set("sku", values.sku ?? "");
  formData.set("weight", values.weight ?? "");
  formData.set("flavor", values.flavor ?? "");
  formData.set("price", String(values.price));
  formData.set(
    "promotionalPrice",
    values.promotionalPrice === null ? "" : String(values.promotionalPrice),
  );
  formData.set("stockStatus", values.stockStatus);
  formData.set("sortOrder", String(values.sortOrder));
  if (values.isActive) {
    formData.set("isActive", "on");
  }
}
