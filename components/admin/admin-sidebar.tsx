"use client";

import Link from "next/link";

import { type AdminNavItem, adminNavigation, adminNavigationGroups } from "@/lib/admin/navigation";

type AdminSidebarProps = {
  activeHref: string;
  onNavigate?: () => void;
};

function NavLink({
  activeHref,
  item,
  onNavigate,
}: {
  activeHref: string;
  item: AdminNavItem;
  onNavigate?: () => void;
}) {
  const isActive = activeHref === item.href;
  const Icon = item.icon;

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={[
        "group flex items-start gap-3 rounded-2xl border px-3 py-3 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        isActive
          ? "border-primary/20 bg-primary-light text-foreground"
          : "border-transparent text-muted hover:border-default hover:bg-surface hover:text-foreground",
      ].join(" ")}
      href={item.href}
      onClick={onNavigate}
    >
      <span
        className={[
          "mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-2xl border",
          isActive
            ? "border-primary/15 bg-white text-primary"
            : "border-default bg-background text-muted group-hover:text-foreground",
        ].join(" ")}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{item.label}</span>
        <span className="mt-1 block text-sm leading-5 text-muted">{item.description}</span>
      </span>
    </Link>
  );
}

export function AdminSidebar({ activeHref, onNavigate }: AdminSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-6 bg-background p-4 lg:p-6">
      <div className="rounded-card border border-default bg-surface p-4 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">PatasGo</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-foreground">
          Área administrativa
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Operação simples para catálogo, pedidos e configuração da loja.
        </p>
      </div>

      <nav aria-label="Navegação principal do admin" className="space-y-5">
        {adminNavigationGroups.map((group) => (
          <section key={group.id}>
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {group.label}
            </p>
            <div className="mt-3 space-y-2">
              {adminNavigation
                .filter((item) => item.group === group.id)
                .map((item) => (
                  <NavLink
                    activeHref={activeHref}
                    item={item}
                    key={item.href}
                    onNavigate={onNavigate}
                  />
                ))}
            </div>
          </section>
        ))}
      </nav>
    </div>
  );
}
