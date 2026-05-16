import type { CartItem } from "./types";

export function getCartItemUnitPrice(
  item: Pick<CartItem, "unitPriceSnapshot" | "promotionalPriceSnapshot">,
) {
  return item.promotionalPriceSnapshot ?? item.unitPriceSnapshot;
}

export function calculateEstimatedTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + getCartItemUnitPrice(item) * item.quantity, 0);
}

export function getTotalItems(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function normalizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

export function upsertCartItem(items: CartItem[], nextItem: CartItem) {
  const existingItem = items.find((item) => item.productVariantId === nextItem.productVariantId);

  if (!existingItem) {
    return [...items, nextItem];
  }

  return items.map((item) =>
    item.productVariantId === nextItem.productVariantId
      ? { ...item, quantity: item.quantity + nextItem.quantity }
      : item,
  );
}
