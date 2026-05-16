"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ChevronRightIcon, MessageIcon } from "@/components/shared/icons";
import { WhatsappButton } from "@/components/shared/whatsapp-button";
import { CartLink } from "@/features/cart/cart-link";

type AppHeaderProps = {
  storeName?: string;
  whatsappHref?: string;
};

export function AppHeader({ storeName, whatsappHref }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-default bg-background/92 backdrop-blur-sm">
      <Container className="py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link className="flex flex-col gap-0.5" href="/">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Patas Pets
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {storeName ?? "PatasGo"}
              </span>
            </Link>
            <div className="mt-1 hidden items-center gap-2 text-xs text-muted sm:flex">
              <span>{getCurrentLabel(pathname)}</span>
              <span className="text-border">•</span>
              <span>Pedido rápido por WhatsApp</span>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <CartLink compact />
            <WhatsappButton href={whatsappHref}>WhatsApp</WhatsappButton>
          </div>

          <nav className="hidden items-center gap-5 lg:flex">
            <Link
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              href="/catalogo"
            >
              Catálogo
            </Link>
            <Link
              className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-foreground"
              href="/pedido"
            >
              Revisar pedido
              <ChevronRightIcon className="size-4" />
            </Link>
            <Link
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              href="/auth/login"
            >
              Admin
            </Link>
            <CartLink />
            <WhatsappButton href={whatsappHref}>
              <span className="inline-flex items-center gap-2">
                <MessageIcon className="size-4" />
                Falar no WhatsApp
              </span>
            </WhatsappButton>
          </nav>
        </div>
      </Container>
    </header>
  );
}

function getCurrentLabel(pathname: string) {
  if (pathname === "/catalogo") {
    return "Catálogo";
  }

  if (pathname === "/pedido") {
    return "Revisão do pedido";
  }

  if (pathname.startsWith("/produto/")) {
    return "Detalhe do produto";
  }

  return "Descoberta rápida";
}
