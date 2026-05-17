import type {
  AdminDeliveryType,
  AdminOrderFiltersInput,
  AdminOrderStatus,
} from "@/lib/validations/admin-orders";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryType: AdminDeliveryType;
  status: AdminOrderStatus;
  totalEstimated: number;
  createdAt: string;
};

export type AdminOrderItemSnapshot = {
  id: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type AdminOrderDetail = AdminOrderListItem & {
  address: string | null;
  notes: string | null;
  whatsappMessage: string;
  items: AdminOrderItemSnapshot[];
};

export type AdminOrdersListData = {
  items: AdminOrderListItem[];
  filters: AdminOrderFiltersInput;
};
