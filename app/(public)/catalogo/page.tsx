import { Container } from "@/components/layout/container";
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
            subtitle="Esta rota já usa contrato público centralizado, incluindo busca e filtros válidos do catálogo exibível."
            title="Catálogo"
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground">Itens públicos</h2>
            <p className="mt-2 text-sm text-muted">
              {catalogData.total} produto(s) válido(s) para navegação pública.
            </p>
            <ul className="mt-5 space-y-3">
              {catalogData.items.map((item) => (
                <li key={item.id} className="rounded-card border border-default bg-background p-4">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">{item.primaryVariant.name}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Filtros disponíveis
            </h2>
            <div className="mt-5 space-y-4 text-sm text-muted">
              <p>Categorias: {catalogData.availableFilters.categories.length}</p>
              <p>Marcas: {catalogData.availableFilters.brands.length}</p>
              <p>Tipos de pet: {catalogData.availableFilters.petTypes.length}</p>
              <p>Faixas etárias: {catalogData.availableFilters.ageGroups.length}</p>
              <p>Portes: {catalogData.availableFilters.sizeGroups.length}</p>
              <p>
                Promoção ativa: {catalogData.availableFilters.promotionAvailable ? "sim" : "não"}
              </p>
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
