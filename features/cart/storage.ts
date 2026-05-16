import { cartItemSchema } from "@/lib/validations/checkout";

import { normalizeQuantity } from "./helpers";
import type { CartItem } from "./types";

const CART_STORAGE_KEY = "patasgo-cart:v1";

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => cartItemSchema.safeParse(item))
      .filter((result) => result.success)
      .map((result) => ({
        ...result.data,
        quantity: normalizeQuantity(result.data.quantity),
      }));
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
