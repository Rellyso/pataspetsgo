import type { ReactNode } from "react";

import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { PublicBottomNav } from "@/components/layout/public-bottom-nav";
import { getStoreSummary } from "@/features/catalog/public-catalog";
import { toWhatsappHref } from "@/lib/whatsapp";

type PublicShellProps = {
  children: ReactNode;
};

export async function PublicShell({ children }: PublicShellProps) {
  let storeSummary = null;

  try {
    storeSummary = await getStoreSummary();
  } catch {
    storeSummary = null;
  }

  const whatsappHref = toWhatsappHref(storeSummary?.whatsappPhone);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader storeName={storeSummary?.storeName} whatsappHref={whatsappHref} />
      <main className="flex-1 pb-36 pt-4 sm:pt-6 lg:pb-14 lg:pt-8">{children}</main>
      <div className="hidden lg:block">
        <AppFooter storeSummary={storeSummary} />
      </div>
      <PublicBottomNav />
    </div>
  );
}
