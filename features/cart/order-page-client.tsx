"use client";

import Link from "next/link";

import { QuantitySelector } from "@/components/catalog/quantity-selector";
import { EmptyState } from "@/components/shared/empty-state";
import { PriceDisplay } from "@/components/shared/price-display";

import { useCart } from "./cart-context";

export function OrderPageClient() {
  const { items, estimatedTotal, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Seu pedido ainda está vazio"
          description="Adicione produtos no catálogo para começar a montar o pedido."
        action={
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
            href="/catalogo"
          >
            Voltar ao catálogo
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
      <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold text-foreground">Itens do pedido</h2>
        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li
              key={item.productVariantId}
              className="rounded-card border border-default bg-background p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{item.productName}</p>
                  <p className="text-sm text-muted">{item.variantName}</p>
                  <p className="text-sm text-muted">Status: {item.stockStatusSnapshot}</p>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <PriceDisplay
                    price={item.unitPriceSnapshot}
                    promotionalPrice={item.promotionalPriceSnapshot}
                  />
                  <QuantitySelector
                    onChange={(quantity) => updateQuantity(item.productVariantId, quantity)}
                    value={item.quantity}
                  />
                  <button
                    className="text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
                    onClick={() => removeItem(item.productVariantId)}
                    type="button"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="rounded-card border border-default bg-surface p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold text-foreground">Resumo estimado</h2>
        <div className="mt-5">
          <PriceDisplay price={estimatedTotal} size="large" />
        </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            Checkout completo e envio ao WhatsApp entram na Fase 6. Nesta etapa, o carrinho local já
            valida a montagem do pedido.
          </p>
      </aside>
    </div>
  );
}
