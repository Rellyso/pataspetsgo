"use client";

import Link from "next/link";
import { ShoppingBagIcon } from "@/components/shared/icons";
import { formatCurrency } from "@/lib/currency";
import { useCart } from "./cart-context";

type CartSummaryBarProps = {
  mode?: "floating" | "inline";
  offsetClassName?: string;
};

export function CartSummaryBar({
  mode = "floating",
  offsetClassName = "bottom-[calc(env(safe-area-inset-bottom)+5.75rem)]",
}: CartSummaryBarProps) {
  const { estimatedTotal, totalItems } = useCart();

  if (totalItems === 0) {
    return null;
  }

  const content = (
    <Link
      className="flex items-center justify-between gap-4 rounded-[1.35rem] bg-foreground px-4 py-3 text-white shadow-[0_22px_50px_-30px_rgba(23,32,51,0.6)]"
      href="/pedido"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-white/10">
          <ShoppingBagIcon className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">
            {totalItems} {totalItems > 1 ? "itens no pedido" : "item no pedido"}
          </p>
          <p className="text-xs text-white/75">Revise e siga para o WhatsApp</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold">{formatCurrency(estimatedTotal)}</p>
        <p className="text-xs text-white/75">Total estimado</p>
      </div>
    </Link>
  );

  if (mode === "inline") {
    return content;
  }

  return (
    <div className={`fixed inset-x-4 z-40 mx-auto max-w-xl lg:hidden ${offsetClassName}`}>
      {content}
    </div>
  );
}
