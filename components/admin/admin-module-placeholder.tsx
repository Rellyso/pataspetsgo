import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTableShell } from "@/components/admin/data-table-shell";
import { StatCard } from "@/components/admin/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { AdminNavItem } from "@/lib/admin/navigation";

type AdminModulePlaceholderProps = {
  item: AdminNavItem;
  phaseLabel: string;
  summary: string;
  nextStep: string;
  columns: string[];
};

export function AdminModulePlaceholder({
  item,
  phaseLabel,
  summary,
  nextStep,
  columns,
}: AdminModulePlaceholderProps) {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        description={summary}
        eyebrow={phaseLabel}
        meta="Rotina protegida e pronta para receber dados reais sem mudar o shell."
        title={item.label}
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <StatCard
          description="A navegação, o cabeçalho e os estados base já estão preparados para a próxima entrega."
          label="Status"
          value="Em preparação"
        />
        <StatCard
          description="A próxima fase conecta consultas, formulários e feedback operacional deste módulo."
          label="Próxima entrega"
          value={phaseLabel}
        />
        <StatCard description={nextStep} label="Próximo passo" value="Implementar fluxo real" />
      </section>

      <DataTableShell
        columns={columns}
        description="Esta casca operacional já representa o ritmo visual das listagens do admin sem inventar dados agora."
        emptyState={
          <EmptyState
            action={
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
                href="/admin"
              >
                Voltar ao dashboard
              </Link>
            }
            description={nextStep}
            title={`${item.label} entram na próxima fase`}
          />
        }
        title={`Base operacional de ${item.label.toLowerCase()}`}
      />
    </div>
  );
}
