import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/catalog/product-detail-view";
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
      <Container className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link className="transition-colors hover:text-foreground" href="/catalogo">
            Catálogo
          </Link>
          <span>/</span>
          <span className="truncate">{product.name}</span>
        </div>

        <ProductDetailView product={product} />
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
