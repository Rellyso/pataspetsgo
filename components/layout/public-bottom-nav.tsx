"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, HomeIcon, ShoppingBagIcon } from "@/components/shared/icons";
import { useCart } from "@/features/cart/cart-context";

const items = [
  { href: "/", label: "Home", icon: HomeIcon, match: (pathname: string) => pathname === "/" },
  {
    href: "/catalogo",
    label: "Catálogo",
    icon: GridIcon,
    match: (pathname: string) => pathname === "/catalogo" || pathname.startsWith("/produto/"),
  },
  {
    href: "/pedido",
    label: "Pedido",
    icon: ShoppingBagIcon,
    match: (pathname: string) => pathname === "/pedido",
  },
];

export function PublicBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-default bg-surface/98 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-[0_-14px_30px_-24px_rgba(23,32,51,0.35)] lg:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-3 gap-2">
        {items.map((item) => {
          const isActive = item.match(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-[1.1rem] px-3 text-xs font-medium transition-colors duration-200",
                isActive
                  ? "bg-primary-light text-foreground"
                  : "text-muted hover:bg-background hover:text-foreground",
              ].join(" ")}
              href={item.href}
            >
              <span className="relative">
                <Icon className="size-[1.35rem]" />
                {item.href === "/pedido" && totalItems > 0 ? (
                  <span className="absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                    {totalItems}
                  </span>
                ) : null}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
