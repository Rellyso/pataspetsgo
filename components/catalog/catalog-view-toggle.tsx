"use client";

import { GridIcon, ListIcon, RowsIcon } from "@/components/shared/icons";
import type { CatalogViewMode } from "@/features/catalog/view-mode-storage";

type CatalogViewToggleProps = {
  value: CatalogViewMode;
  onChange: (viewMode: CatalogViewMode) => void;
};

const viewOptions: Array<{
  description: string;
  icon: typeof RowsIcon;
  label: string;
  value: CatalogViewMode;
}> = [
  {
    value: "comfortable",
    label: "Confortável",
    description: "Cards maiores e leitura mais espaçada.",
    icon: RowsIcon,
  },
  {
    value: "compact",
    label: "Compacta",
    description: "Mais produtos por tela para comparar rápido.",
    icon: GridIcon,
  },
  {
    value: "list",
    label: "Lista",
    description: "Linhas horizontais para varrer mais rápido.",
    icon: ListIcon,
  },
];

export function CatalogViewToggle({ value, onChange }: CatalogViewToggleProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.25rem] border border-default bg-background/80 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-foreground">
          Visualização dos produtos
        </p>
        <p className="text-xs leading-5 text-muted">
          Escolha a forma mais confortável para navegar no catálogo.
        </p>
      </div>

      <fieldset className="grid gap-2 sm:grid-cols-3">
        <legend className="sr-only">Escolher visualização do catálogo</legend>
        {viewOptions.map((option) => {
          const Icon = option.icon;
          const isActive = option.value === value;

          return (
            <button
              aria-pressed={isActive}
              className={[
                "flex min-h-11 min-w-38 items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-colors duration-200",
                isActive
                  ? "border-primary bg-primary-light text-foreground"
                  : "border-default bg-surface text-muted hover:border-primary-light hover:bg-surface",
              ].join(" ")}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              <span
                className={[
                  "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                  isActive
                    ? "bg-surface text-primary"
                    : "bg-background text-muted",
                ].join(" ")}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">
                  {option.label}
                </span>
                <span className="block text-[0.7rem] leading-4 text-muted">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}
