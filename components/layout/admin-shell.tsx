"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LogoutButton } from "@/components/admin/logout-button";
import { CloseIcon, MenuIcon } from "@/components/shared/icons";
import { getAdminNavItem } from "@/lib/admin/navigation";

type AdminShellProps = {
  children: ReactNode;
  userEmail: string;
  embedded?: boolean;
  activeHref?: string;
};

export function AdminShell({ children, userEmail, embedded = false, activeHref }: AdminShellProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentPath = activeHref ?? pathname;
  const currentItem = useMemo(() => getAdminNavItem(currentPath), [currentPath]);

  const wrapperClass = embedded
    ? "overflow-hidden rounded-card border border-default bg-background"
    : "min-h-screen bg-background";
  const topBarClass = embedded
    ? "border-b border-default bg-surface/95"
    : "sticky top-0 z-30 border-b border-default bg-surface/95 backdrop-blur";

  return (
    <div className={wrapperClass}>
      <div className="flex min-h-full flex-col lg:min-h-screen lg:flex-row">
        <aside className="hidden w-full max-w-[320px] shrink-0 border-r border-default lg:block">
          <AdminSidebar activeHref={currentItem.href} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className={topBarClass}>
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  aria-controls="admin-mobile-nav"
                  aria-expanded={isMenuOpen}
                  aria-label="Abrir navegação do admin"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-default bg-background text-foreground transition-colors duration-200 hover:bg-primary-light lg:hidden"
                  onClick={() => setIsMenuOpen(true)}
                  type="button"
                >
                  <MenuIcon className="size-5" />
                </button>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {currentItem.label}
                  </p>
                  <p className="truncate text-sm text-muted">{currentItem.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-foreground">{userEmail}</p>
                  <p className="text-xs text-muted">Sessão administrativa ativa</p>
                </div>
                <LogoutButton className="inline-flex min-h-11 items-center justify-center rounded-full border border-default bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60" />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fechar navegação do admin"
            className="absolute inset-0 bg-foreground/35"
            onClick={() => setIsMenuOpen(false)}
            type="button"
          />
          <div
            aria-label="Menu administrativo"
            className="absolute inset-y-0 left-0 flex w-[min(88vw,320px)] flex-col border-r border-default bg-background shadow-[0_24px_48px_-24px_rgba(23,32,51,0.5)]"
            id="admin-mobile-nav"
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-default px-4 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Navegação
                </p>
                <p className="text-sm text-muted">Escolha um módulo da área protegida.</p>
              </div>
              <button
                aria-label="Fechar navegação do admin"
                className="inline-flex size-11 items-center justify-center rounded-full border border-default bg-surface text-foreground transition-colors duration-200 hover:bg-primary-light"
                onClick={() => setIsMenuOpen(false)}
                type="button"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <AdminSidebar activeHref={currentItem.href} onNavigate={() => setIsMenuOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
