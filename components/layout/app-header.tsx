import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SearchInput } from "@/components/shared/search-input";
import { WhatsappButton } from "@/components/shared/whatsapp-button";

type AppHeaderProps = {
  showSearch?: boolean;
};

export function AppHeader({ showSearch = true }: AppHeaderProps) {
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

            <div className="flex items-center gap-3 lg:hidden">
              <Link
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                href="/auth/login"
              >
                Admin
              </Link>
              <WhatsappButton>WhatsApp</WhatsappButton>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 lg:max-w-3xl lg:flex-row lg:items-center lg:justify-end">
            {showSearch ? (
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
                href="/pedido"
              >
                Pedido
              </Link>
              <Link
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                href="/auth/login"
              >
                Admin
              </Link>
              <WhatsappButton>Falar no WhatsApp</WhatsappButton>
            </nav>
          </div>
        </div>
      </Container>
    </header>
  );
}
