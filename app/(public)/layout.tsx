import type { ReactNode } from "react";

import { PublicShell } from "@/components/layout/public-shell";
import { QueryProvider } from "@/components/providers/query-provider";
import { CartProvider } from "@/features/cart/cart-context";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <CartProvider>
        <PublicShell>{children}</PublicShell>
      </CartProvider>
    </QueryProvider>
  );
}
