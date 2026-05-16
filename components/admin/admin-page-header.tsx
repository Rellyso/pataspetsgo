import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  eyebrow?: string;
};

export function AdminPageHeader({
  title,
  description,
  meta,
  actions,
  eyebrow = "Admin",
}: AdminPageHeaderProps) {
  return (
    <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description ? <div className="text-sm leading-6 text-muted">{description}</div> : null}
          {meta ? <div className="text-sm text-muted">{meta}</div> : null}
        </div>

        {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
