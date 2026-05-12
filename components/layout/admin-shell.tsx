import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";

type AdminShellProps = {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  embedded?: boolean;
};

export function AdminShell({
  title,
  eyebrow = "Admin",
  description,
  meta,
  actions,
  children,
  embedded = false,
}: AdminShellProps) {
  const wrapperClass = embedded
    ? "rounded-card border border-default bg-background"
    : "min-h-screen bg-background";

  return (
    <div className={wrapperClass}>
      <Container className="py-6 sm:py-8">
        <div className="flex flex-col gap-8">
          <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {eyebrow}
                </p>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
                {description ? (
                  <div className="text-sm leading-6 text-muted">{description}</div>
                ) : null}
                {meta ? <div className="text-sm text-muted">{meta}</div> : null}
              </div>

              {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
            </div>
          </section>

          {children}
        </div>
      </Container>
    </div>
  );
}
