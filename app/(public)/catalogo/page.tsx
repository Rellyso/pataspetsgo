import Link from "next/link";

import { CatalogFilterSheet } from "@/components/catalog/catalog-filter-sheet";
import { CategorySectionTabs } from "@/components/catalog/category-section-tabs";
import { ProductCard } from "@/components/catalog/product-card";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchIcon } from "@/components/shared/icons";
import { SearchInput } from "@/components/shared/search-input";
import { CartSummaryBar } from "@/features/cart/cart-summary-bar";
import { getCatalogPageData } from "@/features/catalog/public-catalog";
import type {
  CatalogFilterOption,
  PublicCatalogItem,
} from "@/features/catalog/types";
import {
  type CatalogFiltersInput,
  parseCatalogFilters,
} from "@/lib/validations/catalog";

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
    const sections = groupItemsByCategory(
      catalogData.items,
      catalogData.availableFilters.categories,
      catalogData.appliedFilters.category,
    );
    const activeFilters = buildActiveFilters(catalogData, filters);
    const filterGroups = buildFilterGroups(catalogData, filters);

    return (
      <Container className="flex flex-col gap-4">
        <CartSummaryBar />

        <section className="rounded-3xl border border-default bg-surface p-4 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Catálogo de compra rápida
                </p>
                <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
                  Encontre e adicione ao pedido
                </h1>
                <p className="mt-2 text-sm text-muted">
                  {catalogData.total > 1
                    ? `${catalogData.total} produtos`
                    : "1 produto"}
                </p>
              </div>

              <div className="lg:hidden">
                <CatalogFilterSheet
                  activeFilters={activeFilters}
                  clearHref="/catalogo"
                  groups={filterGroups}
                />
              </div>
            </div>

            <form action="/catalogo" className="flex flex-col gap-3">
              <SearchInput
                defaultValue={filters.q ?? ""}
                label="Buscar no catálogo"
                name="q"
                placeholder="Ração, areia, antipulgas..."
              />
              <HiddenSearchFields filters={filters} />
            </form>

            {activeFilters.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {activeFilters.map((filter) => (
                  <Link
                    key={filter.label}
                    className="chip-category"
                    href={filter.href}
                  >
                    {filter.label}
                  </Link>
                ))}
                <Link
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-default bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary-light hover:bg-primary-light/50"
                  href="/catalogo"
                >
                  Limpar tudo
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        {sections.length > 1 ? (
          <CategorySectionTabs
            className="-mt-1"
            sections={sections.map((section) => ({
              id: section.id,
              label: section.name,
            }))}
          />
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="min-w-0 rounded-3xl border border-default bg-surface p-4 shadow-soft sm:p-6">
            <div id="catalog-results-top" />
            {catalogData.items.length > 0 ? (
              <div className="space-y-7">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    className="scroll-mt-36 space-y-4"
                    id={section.id}
                  >
                    <div className="flex items-end justify-between gap-3 border-b border-default pb-3">
                      <div>
                        <h2 className="font-display text-xl font-semibold text-foreground">
                          {section.name}
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                          {section.items.length} item(ns) nesta seção
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
                      {section.items.map((item) => (
                        <ProductCard key={item.id} product={item} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <EmptyState
                action={
                  <Link
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
                    href="/catalogo"
                  >
                    Limpar filtros
                  </Link>
                }
                description="Nenhum produto público corresponde aos filtros atuais. Ajuste a busca ou remova os filtros ativos."
                title="Nenhum resultado encontrado"
              />
            )}
          </article>

          <aside className="hidden rounded-3xl border border-default bg-surface p-5 shadow-soft lg:block">
            <div className="sticky top-24 space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary-light text-primary">
                    <SearchIcon className="size-4" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-foreground">
                      Filtros
                    </p>
                    <p className="text-sm text-muted">
                      Atalhos secundários do catálogo.
                    </p>
                  </div>
                </div>
              </div>

              {filterGroups.map((group) =>
                group.options.length > 0 ? (
                  <section key={group.title}>
                    <h3 className="text-sm font-semibold text-foreground">
                      {group.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.options.map((option) => (
                        <Link
                          key={`${group.title}-${option.label}`}
                          className={[
                            "inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                            option.active
                              ? "border-secondary-dark bg-secondary-light text-foreground"
                              : "border-default bg-background text-muted hover:border-primary-light hover:bg-primary-light/40 hover:text-foreground",
                          ].join(" ")}
                          href={option.href}
                        >
                          {option.label}
                        </Link>
                      ))}
                    </div>
                  </section>
                ) : null,
              )}

              {activeFilters.length > 0 ? (
                <Link
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-default bg-surface px-4 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary-light hover:bg-primary-light/50"
                  href="/catalogo"
                >
                  Limpar tudo
                </Link>
              ) : null}
            </div>
          </aside>
        </section>
      </Container>
    );
  } catch {
    return (
      <Container>
        <section className="rounded-card border border-error/20 bg-surface p-6 shadow-soft sm:p-8">
          <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Catálogo
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Não foi possível carregar o contrato público agora. Tente novamente
            com o backend disponível.
          </p>
        </section>
      </Container>
    );
  }
}

function HiddenSearchFields({ filters }: { filters: CatalogFiltersInput }) {
  return (
    <>
      {filters.category ? (
        <input name="category" type="hidden" value={filters.category} />
      ) : null}
      {filters.brand ? (
        <input name="brand" type="hidden" value={filters.brand} />
      ) : null}
      {filters.pet ? (
        <input name="pet" type="hidden" value={filters.pet} />
      ) : null}
      {filters.age ? (
        <input name="age" type="hidden" value={filters.age} />
      ) : null}
      {filters.size ? (
        <input name="size" type="hidden" value={filters.size} />
      ) : null}
      {filters.promotion ? (
        <input name="promotion" type="hidden" value="true" />
      ) : null}
      {filters.sort ? (
        <input name="sort" type="hidden" value={filters.sort} />
      ) : null}
    </>
  );
}

function buildActiveFilters(
  catalogData: Awaited<ReturnType<typeof getCatalogPageData>>,
  filters: CatalogFiltersInput,
) {
  const activeFilters: Array<{ label: string; href: string }> = [];

  if (catalogData.appliedFilters.q) {
    activeFilters.push({
      label: `Busca: ${catalogData.appliedFilters.q}`,
      href: buildCatalogHref(filters, { q: undefined }),
    });
  }

  if (catalogData.appliedFilters.category) {
    activeFilters.push({
      label: `Categoria: ${findFilterLabel(catalogData.availableFilters.categories, catalogData.appliedFilters.category)}`,
      href: buildCatalogHref(filters, { category: undefined }),
    });
  }

  if (catalogData.appliedFilters.brand) {
    activeFilters.push({
      label: `Marca: ${findFilterLabel(catalogData.availableFilters.brands, catalogData.appliedFilters.brand)}`,
      href: buildCatalogHref(filters, { brand: undefined }),
    });
  }

  if (catalogData.appliedFilters.pet) {
    activeFilters.push({
      label: `Pet: ${getPetTypeLabel(catalogData.appliedFilters.pet)}`,
      href: buildCatalogHref(filters, { pet: undefined }),
    });
  }

  if (catalogData.appliedFilters.age) {
    activeFilters.push({
      label: `Idade: ${getAgeGroupLabel(catalogData.appliedFilters.age)}`,
      href: buildCatalogHref(filters, { age: undefined }),
    });
  }

  if (catalogData.appliedFilters.size) {
    activeFilters.push({
      label: `Porte: ${getSizeGroupLabel(catalogData.appliedFilters.size)}`,
      href: buildCatalogHref(filters, { size: undefined }),
    });
  }

  if (catalogData.appliedFilters.promotion) {
    activeFilters.push({
      label: "Promoção",
      href: buildCatalogHref(filters, { promotion: undefined }),
    });
  }

  return activeFilters;
}

function buildFilterGroups(
  catalogData: Awaited<ReturnType<typeof getCatalogPageData>>,
  filters: CatalogFiltersInput,
) {
  return [
    {
      title: "Categorias",
      options: catalogData.availableFilters.categories.map((option) => ({
        label: option.label,
        href: buildCatalogHref(filters, {
          category:
            catalogData.appliedFilters.category === option.value
              ? undefined
              : option.value,
        }),
        active: catalogData.appliedFilters.category === option.value,
        count: option.count,
      })),
    },
    {
      title: "Marcas",
      options: catalogData.availableFilters.brands.map((option) => ({
        label: option.label,
        href: buildCatalogHref(filters, {
          brand:
            catalogData.appliedFilters.brand === option.value
              ? undefined
              : option.value,
        }),
        active: catalogData.appliedFilters.brand === option.value,
        count: option.count,
      })),
    },
    {
      title: "Pet",
      options: catalogData.availableFilters.petTypes.map((option) => ({
        label: option.label,
        href: buildCatalogHref(filters, {
          pet:
            catalogData.appliedFilters.pet === option.value
              ? undefined
              : (option.value as CatalogFiltersInput["pet"]),
        }),
        active: catalogData.appliedFilters.pet === option.value,
        count: option.count,
      })),
    },
    {
      title: "Faixa etária",
      options: catalogData.availableFilters.ageGroups.map((option) => ({
        label: option.label,
        href: buildCatalogHref(filters, {
          age:
            catalogData.appliedFilters.age === option.value
              ? undefined
              : (option.value as CatalogFiltersInput["age"]),
        }),
        active: catalogData.appliedFilters.age === option.value,
        count: option.count,
      })),
    },
    {
      title: "Porte",
      options: catalogData.availableFilters.sizeGroups.map((option) => ({
        label: option.label,
        href: buildCatalogHref(filters, {
          size:
            catalogData.appliedFilters.size === option.value
              ? undefined
              : (option.value as CatalogFiltersInput["size"]),
        }),
        active: catalogData.appliedFilters.size === option.value,
        count: option.count,
      })),
    },
    {
      title: "Promocao",
      options: catalogData.availableFilters.promotionAvailable
        ? [
            {
              label: "Somente promoções",
              href: buildCatalogHref(filters, {
                promotion: catalogData.appliedFilters.promotion
                  ? undefined
                  : true,
              }),
              active: Boolean(catalogData.appliedFilters.promotion),
            },
          ]
        : [],
    },
  ];
}

function groupItemsByCategory(
  items: PublicCatalogItem[],
  categories: CatalogFilterOption[],
  activeCategory?: string,
) {
  const groupedItems = new Map<string, CatalogSection>();
  const categoryOrder = categories.map((category) => category.value);

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

      if (leftIndex === -1 && rightIndex === -1) {
        return leftSlug.localeCompare(rightSlug, "pt-BR");
      }

      if (leftIndex === -1) {
        return 1;
      }

      if (rightIndex === -1) {
        return -1;
      }

      return leftIndex - rightIndex;
    })
    .map(([, section]) => section);

  if (!activeCategory) {
    return sortedSections;
  }

  return sortedSections.filter(
    (section) => section.id === `catalog-section-${activeCategory}`,
  );
}

function buildCatalogHref(
  currentFilters: CatalogFiltersInput,
  nextFilters: Partial<CatalogFiltersInput>,
) {
  const params = new URLSearchParams();

  const mergedFilters = {
    ...currentFilters,
    ...nextFilters,
  };

  if (mergedFilters.q) params.set("q", mergedFilters.q);
  if (mergedFilters.category) params.set("category", mergedFilters.category);
  if (mergedFilters.brand) params.set("brand", mergedFilters.brand);
  if (mergedFilters.pet) params.set("pet", mergedFilters.pet);
  if (mergedFilters.age) params.set("age", mergedFilters.age);
  if (mergedFilters.size) params.set("size", mergedFilters.size);
  if (mergedFilters.promotion) params.set("promotion", "true");
  if (mergedFilters.sort && mergedFilters.sort !== "relevance")
    params.set("sort", mergedFilters.sort);
  if (mergedFilters.page && mergedFilters.page !== 1)
    params.set("page", String(mergedFilters.page));

  const query = params.toString();
  return query ? `/catalogo?${query}` : "/catalogo";
}

function findFilterLabel(options: CatalogFilterOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function getPetTypeLabel(value: string) {
  if (value === "dog") return "Cachorro";
  if (value === "cat") return "Gato";
  if (value === "both") return "Cães e gatos";
  return value;
}

function getAgeGroupLabel(value: string) {
  if (value === "puppy") return "Filhote";
  if (value === "adult") return "Adulto";
  if (value === "senior") return "Senior";
  if (value === "all") return "Todas";
  return value;
}

function getSizeGroupLabel(value: string) {
  if (value === "small") return "Pequeno";
  if (value === "medium") return "Medio";
  if (value === "large") return "Grande";
  if (value === "all") return "Todos";
  return value;
}
