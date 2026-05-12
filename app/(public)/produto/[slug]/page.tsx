import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/shared/section-title";

type ProductPageProps = {
  params: { slug: string };
};

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Container>
      <section className="rounded-card border border-default bg-surface p-6 shadow-soft sm:p-8">
        <SectionTitle
          subtitle="Detalhe real de produto, variantes e CTA principal entram na Fase 5."
          title={`Produto: ${params.slug}`}
        />
      </section>
    </Container>
  );
}
