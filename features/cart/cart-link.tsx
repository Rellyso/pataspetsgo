"use client";

import Link from "next/link";

import { ShoppingBagIcon } from "@/components/shared/icons";
import { useCart } from "./cart-context";

type CartLinkProps = {
  compact?: boolean;
};

export function CartLink({ compact = false }: CartLinkProps) {
  const { totalItems } = useCart();

  return (
    <Link
      className={[
        "inline-flex items-center rounded-full border border-default bg-surface font-medium text-foreground transition-colors duration-200 hover:bg-primary-light",
        compact ? "gap-1.5 px-3 py-2 text-sm" : "gap-2 px-3 py-2 text-sm",
      ].join(" ")}
      href="/pedido"
    >
      <ShoppingBagIcon className="size-4" />
      <span>{compact ? "Pedido" : "Pedido"}</span>
      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-white">
        {totalItems}
      </span>
    </Link>
  );
}
