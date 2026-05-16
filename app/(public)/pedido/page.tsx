import { Container } from "@/components/layout/container";
import { OrderPageClient } from "@/features/cart/order-page-client";
import { getStoreSummary } from "@/features/catalog/public-catalog";

export default async function OrderPage() {
  let storeSummary = null;

  try {
    storeSummary = await getStoreSummary();
  } catch {
    storeSummary = null;
  }

  return (
    <Container className="flex flex-col gap-4">
      <OrderPageClient storeSummary={storeSummary} />
    </Container>
  );
}
