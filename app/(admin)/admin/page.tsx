import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTableShell } from "@/components/admin/data-table-shell";
import { StatCard } from "@/components/admin/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { adminNavigation } from "@/lib/admin/navigation";

const dashboardItems = adminNavigation.filter((item) => item.href !== "/admin");
const catalogItems = dashboardItems.filter((item) => item.group === "catalog");
const operationItems = dashboardItems.filter((item) => item.group === "operations");
const dashboardSections = [
  { title: "Catálogo", items: catalogItems },
  { title: "Operação da loja", items: operationItems },
];

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        description="Hub operacional da área protegida. Use os atalhos abaixo para entrar nos módulos já estabilizados no shell e avançar para as próximas fases sem reabrir a fundação."
        eyebrow="Dashboard"
        meta="Sem métricas artificiais: esta tela organiza a operação e prepara catálogo, pedidos, banners e configurações."
        title="Área administrativa"
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <StatCard
          description="Produtos, categorias e marcas já têm rota protegida, navegação persistente e superfície pronta para CRUD."
          label="Catálogo"
          value={`${catalogItems.length} módulos`}
        />
        <StatCard
          description="Pedidos, banners e configurações já entram no shell real, mantendo ritmo visual consistente até a fase de dados."
          label="Operação da loja"
          value={`${operationItems.length} módulos`}
        />
        <StatCard
          description="Logout, loading e tratamento de erro do admin agora fazem parte do fluxo operacional padrão."
          label="Sessão"
          value="Protegida"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {dashboardSections.map((section) => (
          <article
            className="rounded-card border border-default bg-surface p-6 shadow-soft"
            key={section.title}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Atalhos prontos para orientar a operação sem dados falsos neste momento.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    className="flex items-start gap-3 rounded-card border border-default bg-background p-4 transition-colors duration-200 hover:border-primary/20 hover:bg-primary-light/40"
                    href={item.href}
                    key={item.href}
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-default bg-surface text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-foreground">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </article>
        ))}
      </section>

      <DataTableShell
        columns={["Módulo", "Status", "Próxima fase"]}
        description="Panorama rápido do que já está navegável no shell e do que será conectado em seguida."
        emptyState={
          <EmptyState
            action={
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
                href="/admin/produtos"
              >
                Abrir primeiro módulo
              </Link>
            }
            description="As próximas fases conectam dados e formulários em cima deste shell já estável."
            title="Estrutura administrativa pronta para evoluir"
          />
        }
        title="Próximas entregas do admin"
      />
    </div>
  );
}
