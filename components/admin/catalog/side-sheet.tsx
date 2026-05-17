"use client";

import type { ReactNode } from "react";

import { CloseIcon } from "@/components/shared/icons";

type SideSheetProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export function SideSheet({ open, title, description, onClose, children }: SideSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Fechar formulário lateral"
        className="absolute inset-0 bg-foreground/35"
        onClick={onClose}
        type="button"
      />

      <section className="absolute inset-y-0 right-0 flex w-full max-w-[34rem] flex-col border-l border-default bg-surface shadow-[0_24px_48px_-24px_rgba(23,32,51,0.5)]">
        <header className="flex items-start justify-between gap-4 border-b border-default px-5 py-5">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            ) : null}
          </div>
          <button
            aria-label="Fechar"
            className="inline-flex size-11 items-center justify-center rounded-full border border-default bg-background text-foreground transition-colors duration-200 hover:bg-primary-light"
            onClick={onClose}
            type="button"
          >
            <CloseIcon className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </section>
    </div>
  );
}
