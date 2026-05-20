"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toggleEntityActiveAction } from "@/features/admin/catalog/mutations";

type StatusToggleButtonProps = {
  id: string;
  table: "products" | "product_variants" | "categories" | "brands" | "banners";
  isActive: boolean;
  productId?: string;
};

export function StatusToggleButton({ id, table, isActive, productId }: StatusToggleButtonProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-1">
      <button
        className={`inline-flex min-h-10 items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
          isActive
            ? "border-success/20 bg-success/10 text-success hover:bg-success/15"
            : "border-default bg-background text-muted hover:bg-primary-light/40"
        }`}
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await toggleEntityActiveAction({
              table,
              id,
              nextValue: !isActive,
              productId,
            });
            setFeedback(result.message);
            if (result.success) {
              router.refresh();
            }
          });
        }}
        type="button"
      >
        {isPending ? "Salvando..." : isActive ? "Ativo" : "Inativo"}
      </button>
      {feedback ? <p className="text-xs text-muted">{feedback}</p> : null}
    </div>
  );
}
