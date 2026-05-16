"use client";

import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

import {
  calculateEstimatedTotal,
  getTotalItems,
  normalizeQuantity,
  upsertCartItem,
} from "./helpers";
import { loadCartFromStorage, saveCartToStorage } from "./storage";
import type { AddCartItemInput, CartItem } from "./types";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  estimatedTotal: number;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (productVariantId: string) => void;
  updateQuantity: (productVariantId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCartFromStorage());
  }, []);

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = getTotalItems(items);
    const estimatedTotal = calculateEstimatedTotal(items);

    return {
      items,
      totalItems,
      estimatedTotal,
      addItem(item) {
        setItems((currentItems) => {
          return upsertCartItem(currentItems, {
            ...item,
            quantity: normalizeQuantity(item.quantity ?? 1),
          });
        });
      },
      removeItem(productVariantId) {
        setItems((currentItems) =>
          currentItems.filter((item) => item.productVariantId !== productVariantId),
        );
      },
      updateQuantity(productVariantId, quantity) {
        setItems((currentItems) =>
          currentItems
            .map((item) =>
              item.productVariantId === productVariantId
                ? { ...item, quantity: normalizeQuantity(quantity) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
