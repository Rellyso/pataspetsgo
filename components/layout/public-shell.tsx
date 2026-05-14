import type { ReactNode } from "react";

import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { getStoreSummary } from "@/features/catalog/public-catalog";

type PublicShellProps = {
  children: ReactNode;
};

export async function PublicShell({ children }: PublicShellProps) {
  const storeSummary = await getStoreSummary();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader whatsappHref={toWhatsappHref(storeSummary?.whatsappPhone)} />
      <main className="flex-1 py-10 sm:py-12">{children}</main>
      <AppFooter />
    </div>
  );
}

function toWhatsappHref(phone: string | undefined) {
  if (!phone) {
    return undefined;
  }

  const digits = phone.replace(/\D/g, "");
  return digits.length > 0 ? `https://wa.me/${digits}` : undefined;
}
