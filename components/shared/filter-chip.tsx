import type { ComponentPropsWithoutRef } from "react";

type FilterChipProps = ComponentPropsWithoutRef<"button"> & {
  active?: boolean;
};

export function FilterChip({
  active = false,
  className = "",
  type = "button",
  ...props
}: FilterChipProps) {
  return (
    <button
      className={[
        "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
        active
          ? "border-secondary-dark bg-secondary-light text-foreground"
          : "border-default bg-surface text-muted hover:border-primary-light hover:bg-primary-light/40 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      type={type}
      {...props}
    />
  );
}
