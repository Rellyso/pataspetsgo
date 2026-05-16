// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import AdminHomePage from "@/app/(admin)/admin/page";

describe("AdminHomePage", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the admin hub with grouped module links", () => {
    render(<AdminHomePage />);

    expect(screen.getByRole("heading", { name: "Área administrativa" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Catálogo" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Operação da loja" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /produtos/i }).getAttribute("href")).toBe(
      "/admin/produtos",
    );
    expect(screen.getByRole("link", { name: /pedidos/i }).getAttribute("href")).toBe(
      "/admin/pedidos",
    );
  });
});
