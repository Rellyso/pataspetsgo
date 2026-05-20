// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { StoreSettingsManager } from "@/components/admin/store-settings/store-settings-manager";

const refresh = vi.fn();
const saveStoreSettingsAction = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
  }),
}));

vi.mock("@/features/admin/store-settings/mutations", () => ({
  saveStoreSettingsAction: (...args: unknown[]) => saveStoreSettingsAction(...args),
}));

describe("StoreSettingsManager", () => {
  beforeEach(() => {
    refresh.mockReset();
    saveStoreSettingsAction.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders an operational empty state when the singleton is missing", () => {
    render(<StoreSettingsManager settings={null} />);

    expect(screen.getByRole("heading", { name: "Configuração da loja indisponível" })).toBeTruthy();
    expect(screen.getByText(/singleton `store_settings` não foi encontrado/i)).toBeTruthy();
  });

  it("saves the edited singleton and shows success feedback", async () => {
    const user = userEvent.setup();
    saveStoreSettingsAction.mockResolvedValue({
      success: true,
      message: "Configurações da loja atualizadas com sucesso.",
    });

    render(
      <StoreSettingsManager
        settings={{
          id: crypto.randomUUID(),
          storeName: "Patas Pets",
          description: "Catálogo rápido",
          whatsappPhone: "85999990000",
          instagramUrl: null,
          address: "Rua A, 10",
          openingHours: "Seg a Sáb",
          googleMapsUrl: null,
          deliveryEnabled: true,
          pickupEnabled: true,
          updatedAt: new Date().toISOString(),
        }}
      />,
    );

    await user.clear(screen.getByLabelText("Nome da loja"));
    await user.type(screen.getByLabelText("Nome da loja"), "Patas Pets Fortaleza");
    await user.click(screen.getByRole("button", { name: "Salvar configurações" }));

    await waitFor(() => {
      expect(saveStoreSettingsAction).toHaveBeenCalledTimes(1);
      expect(refresh).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Configurações da loja atualizadas com sucesso.")).toBeTruthy();
    });
  });

  it("shows server feedback when the save fails", async () => {
    const user = userEvent.setup();
    saveStoreSettingsAction.mockResolvedValue({
      success: false,
      message: "Configuração da loja não encontrada. Restaure o singleton antes de editar.",
    });

    render(
      <StoreSettingsManager
        settings={{
          id: crypto.randomUUID(),
          storeName: "Patas Pets",
          description: null,
          whatsappPhone: "85999990000",
          instagramUrl: null,
          address: null,
          openingHours: null,
          googleMapsUrl: null,
          deliveryEnabled: false,
          pickupEnabled: true,
          updatedAt: new Date().toISOString(),
        }}
      />,
    );

    await user.clear(screen.getByLabelText("Nome da loja"));
    await user.type(screen.getByLabelText("Nome da loja"), "Patas Pets Nova");
    await user.click(screen.getByRole("button", { name: "Salvar configurações" }));

    await waitFor(() => {
      expect(screen.getByText(/Restaure o singleton antes de editar/i)).toBeTruthy();
      expect(refresh).not.toHaveBeenCalled();
    });
  });
});
