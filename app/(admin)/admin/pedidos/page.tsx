import Link from "next/link";
import type { ReactNode } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminOrdersClient } from "@/components/admin/orders/admin-orders-client";
import { SearchInput } from "@/components/shared/search-input";
import { getAdminOrderDetail, getAdminOrdersList } from "@/features/admin/orders/queries";
import {
  adminDeliveryTypeOptions,
  adminOrderStatusOptions,
  parseAdminOrderFilters,
  parseAdminOrderId,
} from "@/lib/validations/admin-orders";

type AdminOrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseAdminOrderFilters(resolvedSearchParams);
  const selectedOrderId = parseAdminOrderId(resolvedSearchParams);
  const [ordersData, selectedOrder] = await Promise.all([
    getAdminOrdersList(filters),
    selectedOrderId ? getAdminOrderDetail(selectedOrderId) : Promise.resolve(null),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        description="Leia rapidamente o que foi pedido, abra o snapshot persistido e atualize o status sem reescrever o histórico operacional."
        eyebrow="Fase 9.1"
        meta="Pedidos mais recentes primeiro, busca simples e mudança de status sempre explícita."
        title="Pedidos"
      />

      <section className="rounded-card border border-default bg-surface p-5 shadow-soft">
        <form
          action="/admin/pedidos"
          className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))_repeat(2,minmax(0,0.9fr))_auto]"
        >
          <SearchInput
            defaultValue={filters.q ?? ""}
            label="Buscar pedido"
            name="q"
            placeholder="Número, cliente ou telefone"
          />

          <FilterSelect defaultValue={filters.status} label="Status" name="status">
            <option value="all">Todos</option>
            {adminOrderStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect defaultValue={filters.deliveryType} label="Atendimento" name="deliveryType">
            <option value="all">Todos</option>
            {adminDeliveryTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>

          <FilterDateInput defaultValue={filters.from} label="De" name="from" />
          <FilterDateInput defaultValue={filters.to} label="Até" name="to" />

          <div className="flex items-end gap-3">
            <input
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
              type="submit"
              value="Filtrar"
            />
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-default bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-primary-light/40"
              href="/admin/pedidos"
            >
              Limpar
            </Link>
          </div>
        </form>
      </section>

      <AdminOrdersClient
        data={ordersData}
        selectedOrder={selectedOrder}
        selectedOrderId={selectedOrderId}
      />
    </div>
  );
}

function FilterSelect({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        className="min-h-12 rounded-card border border-default bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
        defaultValue={defaultValue}
        name={name}
      >
        {children}
      </select>
    </label>
  );
}

function FilterDateInput({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        className="min-h-12 rounded-card border border-default bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
        defaultValue={defaultValue}
        name={name}
        type="date"
      />
    </label>
  );
}
