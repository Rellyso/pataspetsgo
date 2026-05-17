import { type AdminOrderStatus, getAdminOrderStatusLabel } from "@/lib/validations/admin-orders";

type OrderStatusBadgeProps = {
  status: AdminOrderStatus;
};

const statusClassNames: Record<AdminOrderStatus, string> = {
  pending: "border-warning/20 bg-warning/10 text-warning",
  sent_to_whatsapp: "border-info/20 bg-info/10 text-info",
  confirmed: "border-success/20 bg-success/10 text-success",
  canceled: "border-error/20 bg-error/10 text-error",
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-9 items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold ${statusClassNames[status]}`}
    >
      {getAdminOrderStatusLabel(status)}
    </span>
  );
}
