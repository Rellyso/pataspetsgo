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

          <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Filtros disponíveis
            </h2>
            <div className="mt-5 space-y-5 text-sm text-muted">
              {catalogData.appliedFilters.q ||
              catalogData.appliedFilters.category ||
              catalogData.appliedFilters.brand ||
              catalogData.appliedFilters.pet ||
              catalogData.appliedFilters.age ||
              catalogData.appliedFilters.size ||
              catalogData.appliedFilters.promotion ? (
                <div>
                  <p className="font-medium text-foreground">Filtros ativos</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {catalogData.appliedFilters.q ? (
                      <Link
                        className="chip-category"
                        href={buildCatalogHref(filters, { q: undefined })}
                      >
                        Busca: {catalogData.appliedFilters.q}
                      </Link>
                    ) : null}
                    {catalogData.appliedFilters.category ? (
                      <Link
                        className="chip-category"
                        href={buildCatalogHref(filters, { category: undefined })}
                      >
                        Categoria:{" "}
                        {findFilterLabel(
                          catalogData.availableFilters.categories,
                          catalogData.appliedFilters.category,
                        )}
                      </Link>
                    ) : null}
                    {catalogData.appliedFilters.brand ? (
                      <Link
                        className="chip-category"
                        href={buildCatalogHref(filters, { brand: undefined })}
                      >
                        Marca:{" "}
                        {findFilterLabel(
                          catalogData.availableFilters.brands,
                          catalogData.appliedFilters.brand,
                        )}
                      </Link>
                    ) : null}
                    {catalogData.appliedFilters.pet ? (
                      <Link
                        className="chip-category"
                        href={buildCatalogHref(filters, { pet: undefined })}
                      >
                        Pet: {getPetTypeLabel(catalogData.appliedFilters.pet)}
                      </Link>
                    ) : null}
                    {catalogData.appliedFilters.age ? (
                      <Link
                        className="chip-category"
                        href={buildCatalogHref(filters, { age: undefined })}
                      >
                        Idade: {getAgeGroupLabel(catalogData.appliedFilters.age)}
                      </Link>
                    ) : null}
                    {catalogData.appliedFilters.size ? (
                      <Link
                        className="chip-category"
                        href={buildCatalogHref(filters, { size: undefined })}
                      >
                        Porte: {getSizeGroupLabel(catalogData.appliedFilters.size)}
                      </Link>
                    ) : null}
                    {catalogData.appliedFilters.promotion ? (
                      <Link
                        className="chip-category"
                        href={buildCatalogHref(filters, { promotion: undefined })}
                      >
                        Promoção
                      </Link>
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
                <p className="font-medium text-foreground">Categorias</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {catalogData.availableFilters.categories.map((option) => (
                    <Link
                      key={option.value}
                      className="chip-category shrink-0 snap-start whitespace-nowrap"
                      href={buildCatalogHref(filters, {
                        category: option.value,
                      })}
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

              <div>
                <p className="font-medium text-foreground">Pet</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {catalogData.availableFilters.petTypes.map((option) => (
                    <Link
                      key={option.value}
                      className="chip-category"
                      href={buildCatalogHref(filters, { pet: option.value as typeof filters.pet })}
                    >
                      {getPetTypeLabel(option.value)}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-foreground">Faixa etária</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {catalogData.availableFilters.ageGroups.map((option) => (
                    <Link
                      key={option.value}
                      className="chip-category"
                      href={buildCatalogHref(filters, { age: option.value as typeof filters.age })}
                    >
                      {getAgeGroupLabel(option.value)}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-foreground">Porte</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {catalogData.availableFilters.sizeGroups.map((option) => (
                    <Link
                      key={option.value}
                      className="chip-category"
                      href={buildCatalogHref(filters, {
                        size: option.value as typeof filters.size,
                      })}
                    >
                      {getSizeGroupLabel(option.value)}
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

function findFilterLabel(options: { label: string; value: string }[], value: string | undefined) {
  if (!value) {
    return "";
  }

  return options.find((option) => option.value === value)?.label ?? value;
}

function getPetTypeLabel(value: string) {
  switch (value) {
    case "dog":
      return "Cachorro";
    case "cat":
      return "Gato";
    case "both":
      return "Cachorro e gato";
    default:
      return value;
  }
}

function getAgeGroupLabel(value: string) {
  switch (value) {
    case "puppy":
      return "Filhote";
    case "adult":
      return "Adulto";
    case "senior":
      return "Sênior";
    case "all":
      return "Todas idades";
    default:
      return value;
  }
}

function getSizeGroupLabel(value: string) {
  switch (value) {
    case "small":
      return "Pequeno porte";
    case "medium":
      return "Médio porte";
    case "large":
      return "Grande porte";
    case "all":
      return "Todos portes";
    default:
      return value;
  }
}
