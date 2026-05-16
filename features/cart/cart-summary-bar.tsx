"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CloseIcon, ShoppingBagIcon } from "@/components/shared/icons";
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
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  const cartStateKey = useMemo(
    () => `${totalItems}:${Math.round(estimatedTotal * 100)}`,
    [estimatedTotal, totalItems],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedValue = window.sessionStorage.getItem("patasgo-cart-summary-dismissed");
    setDismissedKey(storedValue);
  }, []);

  if (totalItems === 0 || dismissedKey === cartStateKey) {
    return null;
  }

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("patasgo-cart-summary-dismissed", cartStateKey);
    }

    setDismissedKey(cartStateKey);
  };

  const content = (
    <div className="relative rounded-[1.35rem] bg-foreground text-white shadow-[0_22px_50px_-30px_rgba(23,32,51,0.6)]">
      <button
        aria-label="Fechar resumo do pedido"
        className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors duration-200 hover:bg-white/15 hover:text-white"
        onClick={handleDismiss}
        type="button"
      >
        <CloseIcon className="size-4" />
      </button>

      <Link className="flex items-center gap-3 rounded-[1.35rem] px-4 py-3 pr-12" href="/pedido">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10">
          <ShoppingBagIcon className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {totalItems} {totalItems > 1 ? "itens no pedido" : "item no pedido"}
          </p>
          <p className="truncate text-sm text-white/78">Revise e siga para o WhatsApp</p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-lg font-semibold">{formatCurrency(estimatedTotal)}</p>
          <p className="text-xs text-white/75">Total estimado</p>
        </div>
      </Link>
    </div>
  );

  if (mode === "inline") {
    return content;
  }

  return (
    <div className={`fixed inset-x-4 z-40 mx-auto max-w-lg lg:hidden ${offsetClassName}`}>
      {content}
    </div>
  );
}
