export type CartItem = {
  productId: string;
  productVariantId: string;
  productSlug: string;
  productName: string;
  variantName: string;
  unitPriceSnapshot: number;
  promotionalPriceSnapshot: number | null;
  quantity: number;
  stockStatusSnapshot: "available" | "consult";
  imageUrl: string | null;
};

export type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};
