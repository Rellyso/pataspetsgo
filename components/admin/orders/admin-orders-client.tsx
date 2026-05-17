"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { DataTableShell } from "@/components/admin/data-table-shell";
import { EmptyState } from "@/components/shared/empty-state";
import type { AdminOrderDetail, AdminOrdersListData } from "@/features/admin/orders/types";
import { formatCurrency } from "@/lib/currency";
import { getAdminDeliveryTypeLabel } from "@/lib/validations/admin-orders";

import { OrderDetailSheet } from "./order-detail-sheet";
import { OrderStatusBadge } from "./order-status-badge";

type AdminOrdersClientProps = {
  data: AdminOrdersListData;
  selectedOrder: AdminOrderDetail | null;
  selectedOrderId: string | null;
};

export function AdminOrdersClient({
  data,
  selectedOrder,
  selectedOrderId,
}: AdminOrdersClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasFilters =
    Boolean(data.filters.q) ||
    data.filters.status !== "all" ||
    data.filters.deliveryType !== "all" ||
    Boolean(data.filters.from) ||
    Boolean(data.filters.to);

  const selectedOrderMissing = Boolean(selectedOrderId && !selectedOrder);

  return (
    <>
      <DataTableShell
        actions={
          <span className="text-sm text-muted">{data.items.length} pedido(s) encontrados</span>
        }
        columns={["Pedido", "Cliente", "Atendimento", "Status", "Ações"]}
        description="A listagem prioriza leitura rápida para que a loja entenda o pedido antes ou durante o atendimento via WhatsApp."
        title="Fila operacional"
      >
        {selectedOrderMissing ? (
          <div className="mb-4 rounded-card border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
            O pedido selecionado não foi encontrado ou não está mais disponível.
          </div>
        ) : null}

        {data.items.length === 0 ? (
          <EmptyState
            description={
              hasFilters
                ? "Nenhum pedido corresponde aos filtros atuais. Ajuste a busca ou limpe os filtros para continuar."
                : "Os pedidos que chegarem do checkout aparecerão aqui para consulta rápida da equipe."
            }
            title={hasFilters ? "Nenhum pedido encontrado" : "Nenhum pedido recebido ainda"}
          />
        ) : (
          <div className="space-y-3">
            <div className="space-y-3 md:hidden">
              {data.items.map((item) => (
                <article
                  className="rounded-card border border-default bg-background p-4"
                  key={item.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm font-semibold text-foreground">
                        {item.orderNumber}
                      </p>
                      <h3 className="mt-2 font-semibold text-foreground">{item.customerName}</h3>
                      <p className="mt-1 text-sm text-muted">{item.customerPhone}</p>
                    </div>
                    <OrderStatusBadge status={item.status} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
                    <span>{getAdminDeliveryTypeLabel(item.deliveryType)}</span>
                    <span>{formatCurrency(item.totalEstimated)}</span>
                    <span>{formatDateTime(item.createdAt)}</span>
                  </div>

                  <Link
                    className="mt-4 inline-flex text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
                    href={buildOrderHref(pathname, searchParams, item.id)}
                  >
                    Ver detalhes
                  </Link>
                </article>
              ))}
            </div>

            <div className="hidden space-y-3 md:block">
              {data.items.map((item) => (
                <article
                  className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.95fr)_auto] items-start gap-4 rounded-card border border-default bg-background p-4"
                  key={item.id}
                >
                  <div>
                    <p className="font-mono text-sm font-semibold text-foreground">
                      {item.orderNumber}
                    </p>
                    <p className="mt-2 text-sm text-muted">{formatDateTime(item.createdAt)}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">{item.customerName}</p>
                    <p className="mt-1 text-sm text-muted">{item.customerPhone}</p>
                  </div>

                  <div className="text-sm text-muted">
                    <p>{getAdminDeliveryTypeLabel(item.deliveryType)}</p>
                    <p className="mt-1">{formatCurrency(item.totalEstimated)}</p>
                  </div>

                  <OrderStatusBadge status={item.status} />

                  <div className="flex justify-end">
                    <Link
                      className="text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
                      href={buildOrderHref(pathname, searchParams, item.id)}
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </DataTableShell>

      {selectedOrder ? <OrderDetailSheet order={selectedOrder} /> : null}
    </>
  );
}

function buildOrderHref(pathname: string, searchParams: URLSearchParams, orderId: string) {
  const nextSearchParams = new URLSearchParams(searchParams.toString());
  nextSearchParams.set("id", orderId);

  return `${pathname}?${nextSearchParams.toString()}`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
