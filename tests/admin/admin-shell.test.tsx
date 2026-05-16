// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AdminShell } from "@/components/layout/admin-shell";

const mockPathname = vi.fn();
const replace = vi.fn();
const refresh = vi.fn();
const signOut = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    replace,
    refresh,
  }),
}));

vi.mock("@/lib/supabase/browser", () => ({
  getSupabaseBrowserClient: () => ({
    auth: {
      signOut,
    },
  }),
}));

describe("AdminShell", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockPathname.mockReset();
    replace.mockReset();
    refresh.mockReset();
    signOut.mockReset();
    mockPathname.mockReturnValue("/admin/produtos");
  });

  it("marks the current navigation item", () => {
    render(
      <AdminShell userEmail="admin@example.com">
        <div>Conteúdo</div>
      </AdminShell>,
    );

    expect(screen.getByRole("link", { name: /produtos/i }).getAttribute("aria-current")).toBe(
      "page",
    );
    expect(
      screen.getAllByText("Gerencie produtos, variantes e publicação da vitrine.").length,
    ).toBeGreaterThan(0);
  });

  it("opens and closes the mobile drawer navigation", async () => {
    const user = userEvent.setup();

    render(
      <AdminShell userEmail="admin@example.com">
        <div>Conteúdo</div>
      </AdminShell>,
    );

    await user.click(screen.getByRole("button", { name: "Abrir navegação do admin" }));

    expect(screen.getByRole("dialog", { name: "Menu administrativo" })).toBeTruthy();

    await user.click(screen.getAllByRole("button", { name: "Fechar navegação do admin" })[1]);

    expect(screen.queryByRole("dialog", { name: "Menu administrativo" })).toBeNull();
  });
});
