import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/shared/section-title";
import { getHomeCatalogData } from "@/features/catalog/public-catalog";

export default async function PublicHomePage() {
  try {
    const homeData = await getHomeCatalogData();

    return (
      <Container className="flex flex-col gap-6">
        <section className="rounded-card border border-default bg-surface p-6 shadow-soft sm:p-8">
          <SectionTitle
            as="h1"
            subtitle="Contrato público inicial ativo. Home final da Fase 5 ainda não chegou, mas esta rota já consome dados públicos centralizados."
            title="Home pública"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Banners ativos", String(homeData.activeBanners.length)],
            ["Categorias em destaque", String(homeData.featuredCategories.length)],
            ["Produtos em destaque", String(homeData.featuredProducts.length)],
            ["Produtos em promoção", String(homeData.promotionProducts.length)],
          ].map(([label, value]) => (
            <article
              key={label}
              className="rounded-card border border-default bg-surface p-5 shadow-soft"
            >
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-foreground">{value}</p>
            </article>
          ))}
        </section>

        <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
          <SectionTitle
            subtitle="Leitura rápida do que já está vindo do contrato público para a navegação final."
            title="Amostra do contrato"
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="rounded-card border border-default bg-background p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">Categorias</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {homeData.featuredCategories.map((category) => (
                  <li key={category.id}>{category.name}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-card border border-default bg-background p-5">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Produtos em destaque
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {homeData.featuredProducts.map((product) => (
                  <li key={product.id}>{product.name}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </Container>
    );
  } catch {
    return (
      <Container>
        <section className="rounded-card border border-error/20 bg-surface p-6 shadow-soft sm:p-8">
          <SectionTitle
            as="h1"
            subtitle="Não foi possível carregar o contrato público agora. Tente novamente com Supabase disponível."
            title="Home pública"
          />
        </section>
      </Container>
    );
  }
}
