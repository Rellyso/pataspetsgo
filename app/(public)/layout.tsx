import type { ReactNode } from "react";

import { PublicShell } from "@/components/layout/public-shell";
import { CartProvider } from "@/features/cart/cart-context";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <PublicShell>{children}</PublicShell>
    </CartProvider>
  );
}
