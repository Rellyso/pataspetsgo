// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppFooter } from "@/components/layout/app-footer";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("AppFooter", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders institutional store data when available", () => {
    render(
      <AppFooter
        storeSummary={{
          storeName: "Patas Pets",
          description: "Catálogo com pedido rápido",
          whatsappPhone: "85999990000",
          instagramUrl: "https://instagram.com/pataspets",
          address: "Rua Silva Paulet, 100",
          openingHours: "Seg a Sáb, 8h às 18h",
          googleMapsUrl: "https://maps.google.com/?q=patas+pets",
          deliveryEnabled: true,
          pickupEnabled: true,
        }}
      />,
    );

    const instagramLink = screen.getByRole("link", { name: "Instagram" });
    const mapsLink = screen.getByRole("link", { name: "Ver no mapa" });

    expect(screen.getByText("Patas Pets")).toBeTruthy();
    expect(screen.getByText("Seg a Sáb, 8h às 18h")).toBeTruthy();
    expect(screen.getByText("Rua Silva Paulet, 100")).toBeTruthy();
    expect(instagramLink.getAttribute("href")).toBe("https://instagram.com/pataspets");
    expect(mapsLink.getAttribute("href")).toBe("https://maps.google.com/?q=patas+pets");
  });
});
