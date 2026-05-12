import Link from "next/link";

import { Container } from "@/components/layout/container";

export function AppFooter() {
  return (
    <footer className="border-t border-default bg-surface">
      <Container className="py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">PatasGo</p>
            <p className="font-display text-xl font-semibold text-foreground">
              Catálogo rápido para pedido via WhatsApp.
            </p>
            <p className="text-sm leading-6 text-muted">
              Base visual mobile-first para vitrine pública e operação interna da Patas Pets.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-muted sm:grid-cols-2 sm:gap-x-8">
            <Link className="transition-colors hover:text-foreground" href="/catalogo">
              Ver catálogo
            </Link>
            <Link className="transition-colors hover:text-foreground" href="/pedido">
              Revisar pedido
            </Link>
            <Link className="transition-colors hover:text-foreground" href="/design">
              Contrato visual
            </Link>
            <Link className="transition-colors hover:text-foreground" href="/auth/login">
              Entrar no admin
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
