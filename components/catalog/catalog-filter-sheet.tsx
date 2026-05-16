"use client";

import Link from "next/link";
import { useState } from "react";
import { FilterIcon } from "@/components/shared/icons";

type FilterOption = {
  label: string;
  href: string;
  active?: boolean;
  count?: number;
};

type FilterGroup = {
  title: string;
  options: FilterOption[];
};

type ActiveFilter = {
  label: string;
  href: string;
};

type CatalogFilterSheetProps = {
  groups: FilterGroup[];
  activeFilters: ActiveFilter[];
  clearHref: string;
};

export function CatalogFilterSheet({ groups, activeFilters, clearHref }: CatalogFilterSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-default bg-surface px-4 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary-light hover:bg-primary-light/50"
        onClick={() => setOpen(true)}
        type="button"
      >
        <FilterIcon className="size-4" />
        Filtros
        {activeFilters.length > 0 ? (
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-white">
            {activeFilters.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fechar filtros"
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[1.75rem] bg-surface px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-5 shadow-[0_-24px_50px_-28px_rgba(23,32,51,0.45)]">
            <div className="mx-auto h-1.5 w-14 rounded-full bg-border" />

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-xl font-semibold text-foreground">
                  Filtrar catálogo
                </p>
                <p className="text-sm text-muted">Escolha atalhos rápidos sem sair da lista.</p>
              </div>
              <button
                className="text-sm font-semibold text-muted transition-colors hover:text-foreground"
                onClick={() => setOpen(false)}
                type="button"
              >
                Fechar
              </button>
            </div>

            {activeFilters.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <Link
                    key={filter.label}
                    className="chip-category"
                    href={filter.href}
                    onClick={() => setOpen(false)}
                  >
                    {filter.label}
                  </Link>
                ))}
                <Link
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-default bg-surface px-4 py-2 text-sm font-semibold text-foreground"
                  href={clearHref}
                  onClick={() => setOpen(false)}
                >
                  Limpar tudo
                </Link>
              </div>
            ) : null}

            <div className="mt-5 max-h-[65vh] space-y-5 overflow-y-auto pr-1">
              {groups.map((group) =>
                group.options.length > 0 ? (
                  <section key={group.title}>
                    <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.options.map((option) => (
                        <Link
                          key={`${group.title}-${option.label}`}
                          className={[
                            "inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                            option.active
                              ? "border-secondary-dark bg-secondary-light text-foreground"
                              : "border-default bg-background text-muted hover:border-primary-light hover:bg-primary-light/40 hover:text-foreground",
                          ].join(" ")}
                          href={option.href}
                          onClick={() => setOpen(false)}
                        >
                          {option.label}
                          {typeof option.count === "number" ? (
                            <span className="ml-2 text-xs text-muted">({option.count})</span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  </section>
                ) : null,
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
