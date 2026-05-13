import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/shared/section-title";
import { OrderPageClient } from "@/features/cart/order-page-client";

export default function OrderPage() {
  return (
    <Container className="flex flex-col gap-6">
      <section className="rounded-card border border-default bg-surface p-6 shadow-soft sm:p-8">
        <SectionTitle
          as="h1"
          subtitle="Carrinho local já funciona nesta etapa. Checkout completo, formulário e envio ao WhatsApp entram na Fase 6."
          title="Pedido"
        />
      </section>

      <OrderPageClient />
    </Container>
  );
}
