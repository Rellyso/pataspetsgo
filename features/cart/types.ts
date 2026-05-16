import type { z } from "zod";

import type { cartItemSchema } from "@/lib/validations/checkout";

export type CartItem = z.infer<typeof cartItemSchema>;

export type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};
