// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/app/auth/login/login-form";

const replace = vi.fn();
const refresh = vi.fn();
const signInWithPassword = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    refresh,
  }),
}));

vi.mock("@/lib/supabase/browser", () => ({
  getSupabaseBrowserClient: () => ({
    auth: {
      signInWithPassword,
    },
  }),
}));

describe("LoginForm", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
    signInWithPassword.mockReset();
  });

  it("shows validation errors before hitting Supabase", async () => {
    const user = userEvent.setup();

    render(<LoginForm nextPath="/admin" />);

    await user.type(screen.getByLabelText("Email"), "invalido");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Informe um email valido.")).toBeTruthy();
    expect(await screen.findByText("Informe a senha.")).toBeTruthy();
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it("redirects after a successful sign-in", async () => {
    signInWithPassword.mockResolvedValue({ error: null });

    const user = userEvent.setup();

    render(<LoginForm nextPath="/admin" />);

    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Senha"), "secret123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(signInWithPassword).toHaveBeenCalledWith({
        email: "admin@example.com",
        password: "secret123",
      });
      expect(replace).toHaveBeenCalledWith("/admin");
      expect(refresh).toHaveBeenCalled();
    });
  });
});
