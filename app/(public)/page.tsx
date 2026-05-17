import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { Container } from "@/components/layout/container";
import { ChevronRightIcon } from "@/components/shared/icons";
import { SectionTitle } from "@/components/shared/section-title";
import { getHomeCatalogData } from "@/features/catalog/public-catalog";

export default async function PublicHomePage() {
  try {
    const homeData = await getHomeCatalogData();

    return (
      <Container className="flex flex-col gap-5">
        <section className="overflow-hidden rounded-[1.75rem] border border-default bg-surface shadow-soft">
          <div className="bg-[linear-gradient(135deg,rgba(0,169,200,0.16),rgba(246,184,0,0.16),rgba(255,255,255,1))] px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-sm font-semibold text-primary">
              Pedido rápido para o dia a dia do seu pet
            </p>
            <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Encontre, monte o pedido e siga para o WhatsApp sem fricção.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              {homeData.storeSummary?.description ??
                "Catálogo mobile-first para resolver reposição, higiene, farmácia e snacks com clareza e velocidade."}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
                href="/catalogo"
              >
                Explorar catálogo
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-default bg-white/80 px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary-light hover:bg-white"
                href="/pedido"
              >
                Revisar pedido
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Categorias", String(homeData.featuredCategories.length)],
                ["Destaques", String(homeData.featuredProducts.length)],
                ["Promoções", String(homeData.promotionProducts.length)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[1.25rem] border border-white/70 bg-white/75 p-4 backdrop-blur-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {label}
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-default bg-surface p-5 shadow-soft sm:p-6">
          <SectionTitle
            subtitle="Atalhos para quem já sabe por onde quer começar."
            title="Categorias principais"
            actions={
              <Link
                className="hidden items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-dark sm:inline-flex"
                href="/catalogo"
              >
                Ver tudo
                <ChevronRightIcon className="size-4" />
              </Link>
            }
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {homeData.featuredCategories.map((category) => (
              <Link
                key={category.id}
                className="group rounded-[1.35rem] border border-default bg-background px-4 py-4 transition-colors duration-200 hover:border-primary-light hover:bg-primary-light/30"
                href={`/catalogo?category=${category.slug}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      Navegar
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold text-foreground">
                      {category.name}
                    </p>
                  </div>
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-surface text-primary transition-colors group-hover:bg-white">
                    <ChevronRightIcon className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {homeData.activeBanners.length > 0 ? (
          <section className="rounded-3xl border border-default bg-surface p-5 shadow-soft sm:p-6">
            <SectionTitle
              subtitle="Comercial leve, com prioridade para orientação rápida."
              title="Ofertas e recados"
            />
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {homeData.activeBanners.map((banner) => (
                <article
                  key={banner.id}
                  className="overflow-hidden rounded-[1.35rem] border border-default bg-background"
                >
                  <div className="h-32 bg-[linear-gradient(135deg,rgba(0,169,200,0.18),rgba(255,122,0,0.18))]" />
                  <div className="space-y-3 p-5">
                    <p className="font-display text-xl font-semibold text-foreground">
                      {banner.title}
                    </p>
                    {banner.subtitle ? (
                      <p className="text-sm leading-6 text-muted">
                        {banner.subtitle}
                      </p>
                    ) : null}
                    {banner.ctaUrl ? (
                      <Link
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
                        href={banner.ctaUrl}
                      >
                        {banner.ctaLabel ?? "Explorar"}
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {homeData.featuredProducts.length > 0 ? (
          <section className="rounded-3xl border border-default bg-surface p-5 shadow-soft sm:p-6">
            <SectionTitle
              subtitle="Produtos escolhidos para acelerar a decisão de compra."
              title="Em destaque"
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {homeData.featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : null}

        {homeData.promotionProducts.length > 0 ? (
          <section className="rounded-3xl border border-default bg-surface p-5 shadow-soft sm:p-6">
            <SectionTitle
              subtitle="Promoções com foco em conversão, sem virar um panfleto."
              title="Promoções"
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {homeData.promotionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    );
  } catch {
    return (
      <Container>
        <section className="rounded-card border border-error/20 bg-surface p-6 shadow-soft sm:p-8">
          <SectionTitle
            as="h1"
            subtitle="Não foi possível carregar a home pública agora. Tente novamente com o backend disponível."
            title="PatasGo"
          />
        </section>
      </Container>
    );
  }
}
