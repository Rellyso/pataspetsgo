import Link from "next/link";

import { Container } from "@/components/layout/container";
import type { StoreSummary } from "@/features/catalog/types";

type AppFooterProps = {
  storeSummary?: StoreSummary | null;
};

export function AppFooter({ storeSummary }: AppFooterProps) {
  const institutionalLinks = [
    storeSummary?.instagramUrl
      ? {
          href: storeSummary.instagramUrl,
          label: "Instagram",
        }
      : null,
    storeSummary?.googleMapsUrl
      ? {
          href: storeSummary.googleMapsUrl,
          label: "Ver no mapa",
        }
      : null,
  ].filter((item): item is { href: string; label: string } => item !== null);

  return (
    <footer className="border-t border-default bg-surface">
      <Container className="py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">PatasGo</p>
            <p className="font-display text-xl font-semibold text-foreground">
              {storeSummary?.storeName ?? "PatasGo"}
            </p>
            <p className="text-sm leading-6 text-muted">
              {storeSummary?.description ??
                "Catálogo rápido para pedido via WhatsApp com operação mobile-first."}
            </p>
            {storeSummary?.openingHours || storeSummary?.address ? (
              <div className="space-y-1 pt-2 text-sm text-muted">
                {storeSummary.openingHours ? <p>{storeSummary.openingHours}</p> : null}
                {storeSummary.address ? <p>{storeSummary.address}</p> : null}
              </div>
            ) : null}
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
            {institutionalLinks.map((item) => (
              <a
                className="transition-colors hover:text-foreground"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
