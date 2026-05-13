import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { SectionTitle } from "@/components/shared/section-title";
import { getCatalogPageData } from "@/features/catalog/public-catalog";
import { parseCatalogFilters } from "@/lib/validations/catalog";

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const filters = parseCatalogFilters(await searchParams);

  try {
    const catalogData = await getCatalogPageData(filters);

    return (
      <Container className="flex flex-col gap-6">
        <section className="rounded-card border border-default bg-surface p-6 shadow-soft sm:p-8">
          <SectionTitle
            as="h1"
            subtitle="Busca e filtros públicos já consomem o contrato centralizado de catálogo exibível."
            title="Catálogo"
          />

          <form action="/catalogo" className="mt-6">
            <SearchInput
              defaultValue={filters.q ?? ""}
              label="Buscar no catálogo"
              name="q"
              placeholder="Ração, areia, antipulgas..."
            />
          </form>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground">Itens públicos</h2>
            <p className="mt-2 text-sm text-muted">
              {catalogData.total} produto(s) válido(s) para navegação pública.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {catalogData.items.length > 0 ? (
                catalogData.items.map((item) => <ProductCard key={item.id} product={item} />)
              ) : (
                <div className="md:col-span-2">
                  <EmptyState
                    action={
                      <Link
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
                        href="/catalogo"
                      >
                        Limpar filtros
                      </Link>
                    }
                    description="Nenhum produto público corresponde aos filtros atuais. Ajuste a busca ou remova filtros ativos."
                    title="Nenhum resultado encontrado"
                  />
                </div>
              )}
            </div>
          </article>

          <article className="rounded-card border border-default bg-surface p-6 shadow-soft xl:sticky xl:top-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Filtros disponíveis
            </h2>
            <div className="mt-5 space-y-5 text-sm text-muted">
              {catalogData.appliedFilters.q ||
              catalogData.appliedFilters.category ||
              catalogData.appliedFilters.brand ||
              catalogData.appliedFilters.promotion ? (
                <div>
                  <p className="font-medium text-foreground">Filtros ativos</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {catalogData.appliedFilters.q ? (
                      <span className="chip-category">Busca: {catalogData.appliedFilters.q}</span>
                    ) : null}
                    {catalogData.appliedFilters.category ? (
                      <span className="chip-category">Categoria</span>
                    ) : null}
                    {catalogData.appliedFilters.brand ? (
                      <span className="chip-category">Marca</span>
                    ) : null}
                    {catalogData.appliedFilters.promotion ? (
                      <span className="chip-category">Promoção</span>
                    ) : null}
                    <Link
                      className="text-sm font-medium text-primary hover:text-primary-dark"
                      href="/catalogo"
                    >
                      Limpar tudo
                    </Link>
                  </div>
                </div>
              ) : null}

              <div>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">Categorias</p>
                  <span className="text-xs font-medium text-muted">Deslize</span>
                </div>
                <div className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
                  {catalogData.availableFilters.categories.map((option) => (
                    <Link
                      key={option.value}
                      className="chip-category shrink-0 snap-start whitespace-nowrap"
                      href={buildCatalogHref(filters, { category: option.value })}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-foreground">Marcas</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {catalogData.availableFilters.brands.map((option) => (
                    <Link
                      key={option.value}
                      className="chip-category"
                      href={buildCatalogHref(filters, { brand: option.value })}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>

              {catalogData.availableFilters.promotionAvailable ? (
                <Link
                  className="inline-flex text-sm font-medium text-primary hover:text-primary-dark"
                  href={buildCatalogHref(filters, { promotion: true })}
                >
                  Ver apenas promoções
                </Link>
              ) : null}
            </div>
          </article>
        </section>
      </Container>
    );
  } catch {
    return (
      <Container>
        <section className="rounded-card border border-error/20 bg-surface p-6 shadow-soft sm:p-8">
          <SectionTitle
            as="h1"
            subtitle="Contrato público indisponível agora. Recarregue a página quando o backend estiver acessível."
            title="Catálogo"
          />
        </section>
      </Container>
    );
  }
}

function buildCatalogHref(
  filters: ReturnType<typeof parseCatalogFilters>,
  patch: Partial<ReturnType<typeof parseCatalogFilters>>,
) {
  const params = new URLSearchParams();
  const nextFilters = { ...filters, ...patch };

  if (nextFilters.q) params.set("q", nextFilters.q);
  if (nextFilters.category) params.set("category", nextFilters.category);
  if (nextFilters.brand) params.set("brand", nextFilters.brand);
  if (nextFilters.pet) params.set("pet", nextFilters.pet);
  if (nextFilters.age) params.set("age", nextFilters.age);
  if (nextFilters.size) params.set("size", nextFilters.size);
  if (nextFilters.promotion) params.set("promotion", "true");
  if (nextFilters.sort && nextFilters.sort !== "relevance") params.set("sort", nextFilters.sort);

  const query = params.toString();
  return query ? `/catalogo?${query}` : "/catalogo";
}
