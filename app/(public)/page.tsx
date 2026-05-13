import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
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
            subtitle={
              homeData.storeSummary?.description ??
              "Seu pet shop de bairro com pedido rápido pelo WhatsApp."
            }
            title={homeData.storeSummary?.storeName ?? "Patas Pets"}
            actions={
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
                href="/catalogo"
              >
                Ver catálogo
              </Link>
            }
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

        {homeData.activeBanners.length > 0 ? (
          <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
            <SectionTitle
              subtitle="Atalhos comerciais leves, sem transformar a home em panfleto."
              title="Banners ativos"
            />
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {homeData.activeBanners.map((banner) => (
                <article
                  key={banner.id}
                  className="rounded-card border border-default bg-background p-5"
                >
                  <p className="font-display text-xl font-semibold text-foreground">
                    {banner.title}
                  </p>
                  {banner.subtitle ? (
                    <p className="mt-2 text-sm leading-6 text-muted">{banner.subtitle}</p>
                  ) : null}
                  {banner.ctaUrl ? (
                    <Link
                      className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
                      href={banner.ctaUrl}
                    >
                      {banner.ctaLabel ?? "Explorar"}
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
          <SectionTitle
            subtitle="Atalhos iniciais para descobrir itens de giro e necessidade imediata."
            title="Categorias em destaque"
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {homeData.featuredCategories.map((category) => (
              <Link
                key={category.id}
                className="rounded-card border border-default bg-background p-4 transition-colors duration-200 hover:border-primary-light"
                href={`/catalogo?category=${category.slug}`}
              >
                <p className="font-medium text-foreground">{category.name}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
          <SectionTitle
            subtitle="Produtos que merecem atenção logo na primeira visita."
            title="Produtos em destaque"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {homeData.featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
          <SectionTitle
            subtitle="Seleção promocional enxuta, sem virar panfleto."
            title="Promoções"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {homeData.promotionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
