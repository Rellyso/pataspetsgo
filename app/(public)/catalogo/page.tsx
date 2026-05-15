import Link from "next/link";

import { CategorySectionTabs } from "@/components/catalog/category-section-tabs";
import { ProductCard } from "@/components/catalog/product-card";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { SectionTitle } from "@/components/shared/section-title";
import { getCatalogPageData } from "@/features/catalog/public-catalog";
import type { CatalogFilterOption, PublicCatalogItem } from "@/features/catalog/types";
import { parseCatalogFilters } from "@/lib/validations/catalog";

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type CatalogSection = {
  id: string;
  name: string;
  items: PublicCatalogItem[];
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const filters = parseCatalogFilters(await searchParams);

  try {
    const catalogData = await getCatalogPageData(filters);
    const hasActiveFilters =
      !!catalogData.appliedFilters.q ||
      !!catalogData.appliedFilters.category ||
      !!catalogData.appliedFilters.brand ||
      !!catalogData.appliedFilters.pet ||
      !!catalogData.appliedFilters.age ||
      !!catalogData.appliedFilters.size ||
      !!catalogData.appliedFilters.promotion;
    const sections = groupItemsByCategory(
      catalogData.items,
      catalogData.availableFilters.categories,
      catalogData.appliedFilters.category,
    );

    return (
      <Container className="flex flex-col gap-6">
        <section className="rounded-card border border-default bg-surface p-5 shadow-soft sm:p-8">
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
          <article className="min-w-0 rounded-card border border-default bg-surface p-4 shadow-soft sm:p-6">
            <div id="catalog-results-top" />
            <h2 className="font-display text-xl font-semibold text-foreground">
              Escolha seus produtos
            </h2>
            <p className="mt-1 text-xs text-muted sm:mt-2 sm:text-sm">
              {catalogData.total > 1 ? `${catalogData.total} produtos` : "1 produto"}
            </p>

            {sections.length > 1 ? (
              <CategorySectionTabs
                className="mt-4"
                sections={sections.map((section) => ({
                  id: section.id,
                  label: section.name,
                }))}
              />
            ) : null}

            {hasActiveFilters ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
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
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-default bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary-light hover:bg-primary-light/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  href="/catalogo"
                >
                  Limpar tudo
                </Link>
              </div>
            ) : null}

            {catalogData.items.length > 0 ? (
              <div className="mt-4 space-y-7 md:mt-5 md:space-y-8">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    className="scroll-mt-24 space-y-3 sm:space-y-4"
                    id={section.id}
                  >
                    <div className="flex items-end justify-between gap-3 border-b border-default pb-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground sm:text-xl">
                          {section.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted sm:text-sm">
                          {section.items.length} item(ns) nesta seção
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4">
                      {section.items.map((item) => (
                        <ProductCard key={item.id} product={item} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="mt-4">
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
          </article>

          <article className="hidden min-w-0 rounded-card border border-default bg-surface p-6 shadow-soft xl:block">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Filtros disponíveis
            </h2>
            <div className="mt-5 space-y-5 text-sm text-muted">
              {hasActiveFilters ? (
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
                        href={buildCatalogHref(filters, {
                          category: undefined,
                        })}
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
                        href={buildCatalogHref(filters, {
                          promotion: undefined,
                        })}
                      >
                        Promoção
                      </Link>
                    ) : null}
                    <Link
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-default bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary-light hover:bg-primary-light/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      href="/catalogo"
                    >
                      Limpar tudo
                    </Link>
                  </div>
                </div>
              ) : null}

              {sections.length > 1 ? (
                <div>
                  <p className="font-medium text-foreground">Navegar por categoria</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sections.map((section) => (
                      <a key={section.id} className="chip-category" href={`#${section.id}`}>
                        {section.name}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <p className="font-medium text-foreground">Atalhos rápidos</p>
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
                  {catalogData.availableFilters.petTypes.map((option) => (
                    <Link
                      key={option.value}
                      className="chip-category"
                      href={buildCatalogHref(filters, {
                        pet: option.value as typeof filters.pet,
                      })}
                    >
                      {getPetTypeLabel(option.value)}
                    </Link>
                  ))}
                  {catalogData.availableFilters.ageGroups.map((option) => (
                    <Link
                      key={option.value}
                      className="chip-category"
                      href={buildCatalogHref(filters, {
                        age: option.value as typeof filters.age,
                      })}
                    >
                      {getAgeGroupLabel(option.value)}
                    </Link>
                  ))}
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
                  {catalogData.availableFilters.promotionAvailable ? (
                    <Link
                      className="chip-category"
                      href={buildCatalogHref(filters, { promotion: true })}
                    >
                      Promoções
                    </Link>
                  ) : null}
                </div>
              </div>
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

function groupItemsByCategory(
  items: PublicCatalogItem[],
  categories: CatalogFilterOption[],
  activeCategory: string | undefined,
) {
  const categoryOrder = categories.map((category) => category.value);
  const groupedItems = new Map<string, CatalogSection>();

  for (const item of items) {
    const categorySlug = item.category?.slug ?? "outros";
    const categoryName = item.category?.name ?? "Outros produtos";

    if (!groupedItems.has(categorySlug)) {
      groupedItems.set(categorySlug, {
        id: `catalog-section-${categorySlug}`,
        name: categoryName,
        items: [],
      });
    }

    groupedItems.get(categorySlug)?.items.push(item);
  }

  const sortedSections = Array.from(groupedItems.entries())
    .sort(([leftSlug], [rightSlug]) => {
      const leftIndex = categoryOrder.indexOf(leftSlug);
      const rightIndex = categoryOrder.indexOf(rightSlug);

      return normalizeSortIndex(leftIndex) - normalizeSortIndex(rightIndex);
    })
    .map(([, section]) => section);

  if (!activeCategory) {
    return sortedSections;
  }

  return sortedSections.filter((section) => section.id === `catalog-section-${activeCategory}`);
}

function normalizeSortIndex(value: number) {
  return value === -1 ? Number.MAX_SAFE_INTEGER : value;
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
