type BrandBadgeProps = {
  name: string;
};

export function BrandBadge({ name }: BrandBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-default bg-surface px-3 py-1 text-xs font-medium text-muted">
      {name}
    </span>
  );
}
