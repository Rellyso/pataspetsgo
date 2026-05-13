"use client";

import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

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
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const estimatedTotal = items.reduce(
      (total, item) =>
        total + (item.promotionalPriceSnapshot ?? item.unitPriceSnapshot) * item.quantity,
      0,
    );

    return {
      items,
      totalItems,
      estimatedTotal,
      addItem(item) {
        setItems((currentItems) => {
          const quantity = item.quantity ?? 1;
          const existingItem = currentItems.find(
            (currentItem) => currentItem.productVariantId === item.productVariantId,
          );

          if (existingItem) {
            return currentItems.map((currentItem) =>
              currentItem.productVariantId === item.productVariantId
                ? { ...currentItem, quantity: currentItem.quantity + quantity }
                : currentItem,
            );
          }

          return [...currentItems, { ...item, quantity }];
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
              item.productVariantId === productVariantId ? { ...item, quantity } : item,
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
