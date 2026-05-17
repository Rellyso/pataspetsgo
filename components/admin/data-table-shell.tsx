import type { CSSProperties, ReactNode } from "react";

type DataTableShellProps = {
  title: string;
  description?: ReactNode;
  columns: string[];
  emptyState?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
};

export function DataTableShell({
  title,
  description,
  columns,
  emptyState,
  actions,
  children,
}: DataTableShellProps) {
  return (
    <section className="rounded-card border border-default bg-surface shadow-soft">
      <div className="flex flex-col gap-3 border-b border-default px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
          {description ? (
            <div className="mt-2 text-sm leading-6 text-muted">{description}</div>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
      </div>

      <div
        className="hidden grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4 border-b border-default px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted md:grid"
        style={
          {
            "--column-count": String(columns.length),
          } as CSSProperties
        }
      >
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>

      <div className="p-5">{children ?? emptyState}</div>
    </section>
  );
}
