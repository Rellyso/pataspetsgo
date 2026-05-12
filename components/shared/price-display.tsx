type PriceDisplayProps = {
  price: number;
  promotionalPrice?: number | null;
  size?: "default" | "large";
};

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function PriceDisplay({ price, promotionalPrice, size = "default" }: PriceDisplayProps) {
  const currentPrice = promotionalPrice ?? price;
  const priceClass = size === "large" ? "text-3xl" : "text-xl";

  return (
    <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
      <span className={`font-display font-semibold tracking-tight text-foreground ${priceClass}`}>
        {priceFormatter.format(currentPrice)}
      </span>

      {promotionalPrice ? (
        <span className="text-sm text-muted line-through">{priceFormatter.format(price)}</span>
      ) : null}
    </div>
  );
}
