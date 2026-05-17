import { describe, expect, it } from "vitest";

import {
  adminOrderFiltersSchema,
  adminOrderStatusUpdateSchema,
  parseAdminOrderFilters,
} from "@/lib/validations/admin-orders";

describe("admin orders validation", () => {
  it("accepts valid filters with search and date range", () => {
    const result = adminOrderFiltersSchema.safeParse({
      q: "PP-2026-0001",
      status: "pending",
      deliveryType: "delivery",
      from: "2026-05-01",
      to: "2026-05-31",
    });

    expect(result.success).toBe(true);
  });

  it("normalizes empty filters to the default operational state", () => {
    const result = parseAdminOrderFilters({});

    expect(result).toEqual({
      q: undefined,
      status: "all",
      deliveryType: "all",
      from: undefined,
      to: undefined,
    });
  });

  it("rejects invalid date formats in filters", () => {
    const result = adminOrderFiltersSchema.safeParse({
      from: "01/05/2026",
      to: "2026-05-10",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid status update payload", () => {
    const result = adminOrderStatusUpdateSchema.safeParse({
      orderId: crypto.randomUUID(),
      status: "confirmed",
    });

    expect(result.success).toBe(true);
  });

  it("rejects unknown statuses in updates", () => {
    const result = adminOrderStatusUpdateSchema.safeParse({
      orderId: crypto.randomUUID(),
      status: "finished",
    });

    expect(result.success).toBe(false);
  });
});
