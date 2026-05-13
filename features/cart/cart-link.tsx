"use client";

import Link from "next/link";

import { useCart } from "./cart-context";

export function CartLink() {
  const { totalItems } = useCart();

  return (
    <Link
      className="inline-flex items-center gap-2 rounded-full border border-default bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-primary-light"
      href="/pedido"
    >
      <span>Pedido</span>
      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-white">
        {totalItems}
      </span>
    </Link>
  );
}
