import type { CatalogPublicationStatus } from "@/features/catalog/publication-rules";

type PublicationBadgeProps = {
  status: CatalogPublicationStatus;
};

export function PublicationBadge({ status }: PublicationBadgeProps) {
  const palette =
    status.tone === "success"
      ? "border-success/20 bg-success/10 text-success"
      : status.tone === "warning"
        ? "border-warning/20 bg-warning/10 text-warning"
        : "border-default bg-background text-muted";

  return (
    <div className="space-y-1">
      <span
        className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1 text-xs font-semibold ${palette}`}
      >
        {status.label}
      </span>
      <p className="max-w-sm text-xs leading-5 text-muted">{status.description}</p>
    </div>
  );
}
