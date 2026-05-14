import Link from "next/link";
import type { ReactNode } from "react";

type WhatsappButtonProps = {
  children?: ReactNode;
  disabled?: boolean;
  href?: string;
  size?: "default" | "large";
};

export function WhatsappButton({
  children = "Pedir no WhatsApp",
  disabled = false,
  href,
  size = "default",
}: WhatsappButtonProps) {
  const isDisabled = disabled || !href;
  const sizeClass = size === "large" ? "min-h-12 px-5 text-base" : "min-h-11 px-4 text-sm";
  const className = [
    "inline-flex items-center justify-center rounded-full bg-success font-semibold text-white shadow-soft transition-colors duration-200",
    "hover:bg-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success/30",
    "disabled:cursor-not-allowed disabled:opacity-60",
    sizeClass,
  ].join(" ");

  if (isDisabled) {
    return (
      <span aria-disabled="true" className={className}>
        {children}
      </span>
    );
  }

  return (
    <Link className={className} href={href} rel="noreferrer" target="_blank">
      {children}
    </Link>
  );
}
