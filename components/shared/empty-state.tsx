import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-card border border-default bg-surface p-6 shadow-soft">
      <div className="space-y-2">
        <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
        <p className="max-w-xl text-sm leading-6 text-muted">{description}</p>
      </div>

      {action}
    </div>
  );
}
