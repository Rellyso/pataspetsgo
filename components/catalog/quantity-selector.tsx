"use client";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
};

export function QuantitySelector({ value, onChange, min = 1 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex min-h-11 items-center rounded-full border border-default bg-surface px-2 py-1">
      <button
        className="size-9 rounded-full text-base font-semibold text-foreground transition-colors duration-200 hover:bg-primary-light"
        onClick={() => onChange(Math.max(min, value - 1))}
        type="button"
      >
        -
      </button>
      <span className="min-w-10 text-center text-sm font-medium text-foreground">{value}</span>
      <button
        className="size-9 rounded-full text-base font-semibold text-foreground transition-colors duration-200 hover:bg-primary-light"
        onClick={() => onChange(value + 1)}
        type="button"
      >
        +
      </button>
    </div>
  );
}
