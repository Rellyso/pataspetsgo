"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SideSheet } from "@/components/admin/catalog/side-sheet";
import type { AdminOrderDetail } from "@/features/admin/orders/types";
import { formatCurrency } from "@/lib/currency";
import { getAdminDeliveryTypeLabel } from "@/lib/validations/admin-orders";

import { OrderStatusBadge } from "./order-status-badge";
import { OrderStatusUpdateForm } from "./order-status-update-form";

type OrderDetailSheetProps = {
  order: AdminOrderDetail;
};

export function OrderDetailSheet({ order }: OrderDetailSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <SideSheet
      description="O detalhe usa apenas o snapshot persistido do pedido para apoiar a leitura operacional e a atualização simples de status."
      onClose={() => {
        const nextSearchParams = new URLSearchParams(searchParams.toString());
        nextSearchParams.delete("id");

        const nextUrl = nextSearchParams.toString()
          ? `${pathname}?${nextSearchParams.toString()}`
          : pathname;

        router.push(nextUrl);
      }}
      open
      title={`Pedido ${order.orderNumber}`}
    >
      <div className="space-y-6">
        <section className="rounded-card border border-default bg-background p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Criado em
              </p>
              <p className="mt-2 font-mono text-sm text-foreground">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <DetailBlock label="Cliente" value={order.customerName} />
            <DetailBlock label="Telefone" value={order.customerPhone} />
            <DetailBlock
              label="Atendimento"
              value={getAdminDeliveryTypeLabel(order.deliveryType)}
            />
            <DetailBlock label="Total estimado" value={formatCurrency(order.totalEstimated)} />
            <DetailBlock label="Endereço" value={order.address ?? "Não informado"} />
            <DetailBlock label="Observações" value={order.notes ?? "Sem observações"} />
          </dl>
        </section>

        <section className="rounded-card border border-default bg-background p-4">
          <h3 className="font-display text-xl font-semibold text-foreground">Itens do pedido</h3>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <article className="rounded-card border border-default bg-surface p-4" key={item.id}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{item.productName}</p>
                      <p className="mt-1 text-sm text-muted">{item.variantName}</p>
                    </div>
                    <p className="font-mono text-sm text-muted">Qtd. {item.quantity}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted">
                    <span>Unitário {formatCurrency(item.unitPrice)}</span>
                    <span>Total {formatCurrency(item.totalPrice)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-card border border-default bg-background p-4">
          <h3 className="font-display text-xl font-semibold text-foreground">Mensagem salva</h3>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-card border border-default bg-surface p-4 font-mono text-xs leading-6 text-foreground">
            {order.whatsappMessage}
          </pre>
        </section>

        <section className="rounded-card border border-default bg-background p-4">
          <h3 className="font-display text-xl font-semibold text-foreground">Atualizar status</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            A mudança é manual e explícita. Ela não altera itens, preços nem a mensagem já
            persistida.
          </p>
          <div className="mt-4">
            <OrderStatusUpdateForm
              currentStatus={order.status}
              orderId={order.id}
              orderNumber={order.orderNumber}
            />
          </div>
        </section>
      </div>
    </SideSheet>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-foreground">{value}</dd>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
