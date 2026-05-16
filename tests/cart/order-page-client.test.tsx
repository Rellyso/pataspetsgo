// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { OrderPageClient } from "@/features/cart/order-page-client";

const submitOrder = vi.fn();
const clearCart = vi.fn();
const removeItem = vi.fn();
const updateQuantity = vi.fn();

const cartValue = {
  clearCart,
  estimatedTotal: 12.65,
  items: [
    {
      imageUrl: null,
      productId: "11111111-1111-1111-1111-111111111111",
      productName: "GranPlus",
      productSlug: "granplus",
      productVariantId: "22222222-2222-2222-2222-222222222222",
      promotionalPriceSnapshot: null,
      quantity: 1,
      stockStatusSnapshot: "available" as const,
      unitPriceSnapshot: 12.65,
      variantName: "Pacote 1kg",
    },
  ],
  removeItem,
  totalItems: 1,
  updateQuantity,
};

vi.mock("@/features/cart/cart-context", () => ({
  useCart: () => cartValue,
}));

vi.mock("@/features/cart/submit-order", () => ({
  submitOrder: (...args: unknown[]) => submitOrder(...args),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function renderOrderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <OrderPageClient
        storeSummary={{
          description: null,
          deliveryEnabled: true,
          pickupEnabled: true,
          storeName: "Patas Pets",
          whatsappPhone: "5585999990000",
        }}
      />
    </QueryClientProvider>,
  );
}

describe("OrderPageClient", () => {
  beforeEach(() => {
    clearCart.mockReset();
    removeItem.mockReset();
    submitOrder.mockReset();
    updateQuantity.mockReset();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("formats phone input while typing", async () => {
    const user = userEvent.setup();

    renderOrderPage();

    await user.type(screen.getByLabelText("Telefone"), "85999990000");

    expect((screen.getByLabelText("Telefone") as HTMLInputElement).value).toBe("(85) 99999-0000");
  });

  it("reveals CEP on delivery and fills the address after lookup", async () => {
    const user = userEvent.setup();

    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({
        bairro: "Aldeota",
        cep: "60125-340",
        localidade: "Fortaleza",
        logradouro: "Rua Silva Paulet",
        uf: "CE",
      }),
      ok: true,
    } as Response);

    renderOrderPage();

    await user.click(screen.getByRole("button", { name: /Entrega/ }));
    await user.type(screen.getByLabelText("CEP"), "60125340");

    await waitFor(() => {
      expect((screen.getByLabelText("Endereço") as HTMLInputElement).value).toBe(
        "Rua Silva Paulet, Aldeota • Fortaleza - CE",
      );
    });
  });

  it("shows an error when CEP is not found", async () => {
    const user = userEvent.setup();

    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({
        erro: true,
      }),
      ok: true,
    } as Response);

    renderOrderPage();

    await user.click(screen.getByRole("button", { name: /Entrega/ }));
    await user.type(screen.getByLabelText("CEP"), "60125340");

    expect(
      await screen.findByText("CEP não encontrado. Revise os números informados."),
    ).toBeTruthy();
  });

  it("keeps delivery values when switching away and back", async () => {
    const user = userEvent.setup();

    renderOrderPage();

    await user.click(screen.getByRole("button", { name: /Entrega/ }));
    await user.type(screen.getByLabelText("CEP"), "60125340");
    await user.type(screen.getByLabelText("Endereço"), "Rua Teste, 123");
    await user.click(screen.getByRole("button", { name: /Retirada/ }));
    await user.click(screen.getByRole("button", { name: /Entrega/ }));

    expect((screen.getByLabelText("CEP") as HTMLInputElement).value).toBe("60125-340");
    expect((screen.getByLabelText("Endereço") as HTMLInputElement).value).toBe("Rua Teste, 123");
  });
});
