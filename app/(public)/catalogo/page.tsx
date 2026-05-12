import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/shared/section-title";

export default function CatalogPage() {
  return (
    <Container>
      <section className="rounded-card border border-default bg-surface p-6 shadow-soft sm:p-8">
        <SectionTitle
          as="h1"
          subtitle="Busca real, filtros conectados e grid de produtos entram na Fase 5. Aqui, só shell e fundação visual."
          title="Catálogo"
        />
      </section>
    </Container>
  );
}
