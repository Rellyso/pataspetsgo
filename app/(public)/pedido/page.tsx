import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/shared/section-title";

export default function OrderPage() {
  return (
    <Container>
      <section className="rounded-card border border-default bg-surface p-6 shadow-soft sm:p-8">
        <SectionTitle
          subtitle="Carrinho, formulário e persistência entram na Fase 6. Aqui, página já herda mesma base visual do resto."
          title="Pedido"
        />
      </section>
    </Container>
  );
}
