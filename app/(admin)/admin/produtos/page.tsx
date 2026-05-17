import Link from "next/link";
import type { ReactNode } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PublicationBadge } from "@/components/admin/catalog/publication-badge";
import { StatusToggleButton } from "@/components/admin/catalog/status-toggle-button";
import { DataTableShell } from "@/components/admin/data-table-shell";
import { SearchInput } from "@/components/shared/search-input";
import { getAdminProductList } from "@/features/admin/catalog/queries";
import { parseAdminProductFilters } from "@/lib/validations/admin-catalog";

type AdminProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const filters = parseAdminProductFilters(await searchParams);
  const productList = await getAdminProductList(filters);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        actions={
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
            href="/admin/produtos/novo"
          >
            Criar produto
          </Link>
        }
        description="Mantenha produtos e variantes com leitura operacional simples, sem perder o contrato real de publicação da vitrine."
        eyebrow="Fase 8"
        meta="A vitrine pública só libera produtos com relacionamento válido e pelo menos uma variante comprável."
        title="Produtos"
      />

      <section className="rounded-card border border-default bg-surface p-5 shadow-soft">
        <form
          action="/admin/produtos"
          className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]"
        >
          <SearchInput
            defaultValue={filters.q ?? ""}
            label="Buscar por nome"
            name="q"
            placeholder="Ração, antipulgas, areia..."
          />

          <FilterSelect defaultValue={filters.status} label="Status" name="status">
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </FilterSelect>

          <FilterSelect defaultValue={filters.category ?? ""} label="Categoria" name="category">
            <option value="">Todas</option>
            {productList.categoryOptions.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.label}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect defaultValue={filters.brand ?? ""} label="Marca" name="brand">
            <option value="">Todas</option>
            {productList.brandOptions.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.label}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect defaultValue={filters.promotion} label="Promoção" name="promotion">
            <option value="all">Todas</option>
            <option value="only">Somente com flag</option>
          </FilterSelect>

          <div className="flex items-end gap-3">
            <input
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
              type="submit"
              value="Filtrar"
            />
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-default bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-primary-light/40"
              href="/admin/produtos"
            >
              Limpar
            </Link>
          </div>
        </form>
      </section>

      <DataTableShell
        actions={
          <span className="text-sm text-muted">
            {productList.items.length} produto(s) encontrados
          </span>
        }
        columns={["Produto", "Relacionamentos", "Status", "Vitrine", "Ações"]}
        description="A listagem mostra o estado editorial do produto e também se ele já está realmente pronto para o catálogo público."
        title="Catálogo operacional"
      >
        {productList.items.length > 0 ? (
          <div className="space-y-3">
            {productList.items.map((item) => (
              <article
                className="rounded-card border border-default bg-background p-4"
                key={item.id}
              >
                <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_auto]">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-default bg-surface text-xs text-muted">
                      {item.imageUrl ? (
                        /* biome-ignore lint/performance/noImgElement: Admin preview needs to render arbitrary stored URLs without remote image configuration. */
                        <img
                          alt={item.name}
                          className="h-full w-full object-cover"
                          src={item.imageUrl}
                        />
                      ) : (
                        <span>Sem imagem</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-foreground">{item.name}</h2>
                      <p className="mt-1 text-sm text-muted">/{item.slug}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
                        <span>{item.variantCount} variante(s)</span>
                        <span>{item.validVariantCount} comprável(is)</span>
                        <span>Ordem {item.sortOrder}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-muted">
                    <p>{item.category ? item.category.label : "Sem categoria"}</p>
                    <p className="mt-1">{item.brand ? item.brand.label : "Sem marca"}</p>
                  </div>

                  <div className="space-y-2">
                    <StatusToggleButton id={item.id} isActive={item.isActive} table="products" />
                    <div className="flex flex-wrap gap-2 text-xs">
                      {item.isFeatured ? (
                        <span className="rounded-full border border-secondary/20 bg-secondary-light px-3 py-1 font-semibold text-foreground">
                          Destaque
                        </span>
                      ) : null}
                      {item.isPromotion ? (
                        <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-semibold text-accent">
                          Promoção
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <PublicationBadge status={item.publicationStatus} />

                  <div className="flex items-start justify-end">
                    <Link
                      className="text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
                      href={`/admin/produtos/${item.id}`}
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-default bg-background p-5 text-sm text-muted">
            Nenhum produto encontrado com os filtros atuais.
          </div>
        )}
      </DataTableShell>
    </div>
  );
}

function FilterSelect({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        className="min-h-12 rounded-card border border-default bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
        defaultValue={defaultValue}
        name={name}
      >
        {children}
      </select>
    </label>
  );
}
