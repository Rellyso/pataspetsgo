import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/shared/section-title";
import { getPublicProductBySlug } from "@/features/catalog/public-catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await getPublicProductBySlug(slug);

    if (!product) {
      notFound();
    }

    return (
      <Container className="flex flex-col gap-6">
        <section className="rounded-card border border-default bg-surface p-6 shadow-soft sm:p-8">
          <SectionTitle
            as="h1"
            subtitle="Detalhe já validado pelo mesmo contrato público do catálogo. Só aparece aqui se ainda for público e tiver variante válida."
            title={product.name}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground">Resumo público</h2>
            <dl className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2">
              <div>
                <dt className="font-medium text-foreground">Categoria</dt>
                <dd>{product.category?.name ?? "Sem categoria"}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Marca</dt>
                <dd>{product.brand?.name ?? "Sem marca"}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Pet</dt>
                <dd>{product.petType}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Faixa etária</dt>
                <dd>{product.ageGroup}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Variantes públicas
            </h2>
            <ul className="mt-5 space-y-3">
              {product.variants.map((variant) => (
                <li
                  key={variant.id}
                  className="rounded-card border border-default bg-background p-4 text-sm text-muted"
                >
                  <p className="font-medium text-foreground">{variant.name}</p>
                  <p className="mt-1">Status: {variant.stockStatus}</p>
                </li>
              ))}
            </ul>
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
            subtitle="Não foi possível carregar o detalhe público agora. Tente novamente quando o backend estiver acessível."
            title={`Produto: ${slug}`}
          />
        </section>
      </Container>
    );
  }
}
