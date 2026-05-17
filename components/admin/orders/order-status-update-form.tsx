"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";

import { updateOrderStatusAction } from "@/features/admin/orders/mutations";
import {
  type AdminOrderStatus,
  adminOrderStatusOptions,
  getAdminOrderStatusLabel,
} from "@/lib/validations/admin-orders";

type OrderStatusUpdateFormProps = {
  orderId: string;
  orderNumber: string;
  currentStatus: AdminOrderStatus;
};

export function OrderStatusUpdateForm({
  orderId,
  orderNumber,
  currentStatus,
}: OrderStatusUpdateFormProps) {
  const router = useRouter();
  const fieldId = useId();
  const [status, setStatus] = useState<AdminOrderStatus>(currentStatus);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();

        if (
          !window.confirm(
            `Atualizar o pedido ${orderNumber} para ${getAdminOrderStatusLabel(status).toLowerCase()}?`,
          )
        ) {
          return;
        }

        startTransition(async () => {
          const result = await updateOrderStatusAction({
            orderId,
            status,
          });

          setFeedback(result.message);

          if (result.success) {
            router.refresh();
          }
        });
      }}
    >
      <label className="flex flex-col gap-2" htmlFor={fieldId}>
        <span className="text-sm font-medium text-foreground">Status operacional</span>
        <select
          className={fieldClassName}
          disabled={isPending}
          id={fieldId}
          onChange={(event) => setStatus(event.target.value as AdminOrderStatus)}
          value={status}
        >
          {adminOrderStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Salvando..." : "Salvar status"}
      </button>

      {feedback ? <p className="text-sm text-muted">{feedback}</p> : null}
    </form>
  );
}

const fieldClassName =
  "min-h-12 rounded-card border border-default bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-70";
