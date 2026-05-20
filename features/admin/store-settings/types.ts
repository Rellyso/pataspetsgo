export type AdminStoreSettings = {
  id: string;
  storeName: string;
  description: string | null;
  whatsappPhone: string;
  instagramUrl: string | null;
  address: string | null;
  openingHours: string | null;
  googleMapsUrl: string | null;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  updatedAt: string;
};
