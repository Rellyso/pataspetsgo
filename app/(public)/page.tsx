import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/shared/section-title";

export default function PublicHomePage() {
  return (
    <Container>
      <section className="rounded-card border border-default bg-surface p-6 shadow-soft sm:p-8">
        <SectionTitle
          as="h1"
          subtitle="Shell público ativo. Home final entra na fase de navegação, sem reabrir fundação visual."
          title="Home pública"
        />
      </section>
    </Container>
  );
}
