"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";
import { SearchInput } from "@/components/shared/search-input";
import { WhatsappButton } from "@/components/shared/whatsapp-button";
import { CartLink } from "@/features/cart/cart-link";

type AppHeaderProps = {
  showSearch?: boolean;
  whatsappHref?: string;
};

export function AppHeader({ showSearch = true, whatsappHref }: AppHeaderProps) {
  const pathname = usePathname();
  const showHeaderSearch = showSearch && pathname !== "/catalogo";

  return (
    <header className="border-b border-default bg-background/90 backdrop-blur-sm">
      <Container className="py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link className="flex flex-col gap-1" href="/">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Patas Pets
              </span>
              <span className="font-display text-xl font-semibold tracking-tight text-foreground">
                PatasGo
              </span>
            </Link>
          </div>

          <div className="flex flex-1 flex-col gap-4 lg:max-w-3xl lg:flex-row lg:items-center lg:justify-end">
            <div className="flex items-center justify-between gap-3 lg:hidden">
              <div className="flex items-center gap-3">
                <Link
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                  href="/catalogo"
                >
                  Ver catálogo
                </Link>
                <CartLink />
                <Link
                  className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                  href="/auth/login"
                >
                  Admin
                </Link>
              </div>
              <WhatsappButton href={whatsappHref}>WhatsApp</WhatsappButton>
            </div>

            {showHeaderSearch ? (
              <div className="w-full lg:max-w-md">
                <SearchInput
                  aria-label="Buscar produtos"
                  label="Buscar rápido"
                  placeholder="Ração, antipulgas, areia..."
                />
              </div>
            ) : null}

            <nav className="hidden items-center gap-5 lg:flex">
              <Link
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                href="/catalogo"
              >
                Catálogo
              </Link>
              <Link
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                href="/auth/login"
              >
                Admin
              </Link>
              <CartLink />
              <WhatsappButton href={whatsappHref}>Falar no WhatsApp</WhatsappButton>
            </nav>
          </div>
        </div>
      </Container>
    </header>
  );
}
