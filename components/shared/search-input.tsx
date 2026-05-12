import type { ComponentPropsWithoutRef } from "react";

type SearchInputProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  label?: string;
};

export function SearchInput({ className = "", label = "Buscar", ...props }: SearchInputProps) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="flex items-center gap-3 rounded-card border border-default bg-surface px-4 py-3 shadow-soft transition focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40">
        <svg
          aria-hidden="true"
          className="size-4 shrink-0 text-muted"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0a7 7 0 0114 0z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
        <input
          className={`w-full bg-transparent text-sm text-foreground outline-none focus-visible:outline-none outline-offset-0 outline-transparent placeholder:text-muted ${className}`.trim()}
          inputMode="search"
          type="search"
          {...props}
        />
      </span>
    </label>
  );
}
