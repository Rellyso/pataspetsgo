// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BannerManager } from "@/components/admin/banners/banner-manager";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
  }),
}));

vi.mock("@/features/admin/banners/mutations", () => ({
  saveBannerAction: vi.fn(),
}));

describe("BannerManager", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    refresh.mockReset();
  });

  it("renders an empty state when there are no banners", () => {
    render(<BannerManager items={[]} />);

    expect(screen.getByRole("heading", { name: "Nenhum banner cadastrado" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Criar banner" })).toBeTruthy();
  });

  it("opens the side sheet to create a banner", async () => {
    const user = userEvent.setup();

    render(<BannerManager items={[]} />);

    await user.click(screen.getByRole("button", { name: "Criar banner" }));

    expect(screen.getByRole("heading", { name: "Criar banner" })).toBeTruthy();
    expect(screen.getByLabelText("Título")).toBeTruthy();
    expect(screen.getByPlaceholderText("/catalogo?promotion=1 ou https://...")).toBeTruthy();
  });

  it("renders an existing banner with preview and edit action", () => {
    render(
      <BannerManager
        items={[
          {
            id: crypto.randomUUID(),
            title: "Promoção da semana",
            subtitle: "Rações e petiscos",
            imageUrl: "https://example.com/banner.jpg",
            ctaLabel: "Explorar",
            ctaUrl: "/catalogo",
            position: 1,
            isActive: true,
            updatedAt: new Date().toISOString(),
          },
        ]}
      />,
    );

    expect(screen.getByText("Promoção da semana")).toBeTruthy();
    expect(screen.getByText("Posição 1")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Editar" })).toBeTruthy();
  });
});
