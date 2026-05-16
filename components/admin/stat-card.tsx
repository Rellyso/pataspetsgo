import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  description: ReactNode;
};

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <article className="rounded-card border border-default bg-surface p-5 shadow-soft">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <div className="mt-3 text-sm leading-6 text-muted">{description}</div>
    </article>
  );
}
