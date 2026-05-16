import type { JSX, SVGProps } from "react";

import {
  BookmarkIcon,
  ClipboardListIcon,
  GridIcon,
  HomeIcon,
  MegaphoneIcon,
  PackageIcon,
  SettingsIcon,
} from "@/components/shared/icons";

type AdminIconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

export type AdminNavGroup = "catalog" | "operations";

export type AdminNavItem = {
  label: string;
  href: string;
  description: string;
  group: AdminNavGroup;
  icon: AdminIconComponent;
};

export const adminNavigation: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    description: "Hub operacional da área protegida.",
    group: "catalog",
    icon: HomeIcon,
  },
  {
    label: "Produtos",
    href: "/admin/produtos",
    description: "Gerencie produtos, variantes e publicação da vitrine.",
    group: "catalog",
    icon: PackageIcon,
  },
  {
    label: "Categorias",
    href: "/admin/categorias",
    description: "Organize seções e atalhos do catálogo.",
    group: "catalog",
    icon: GridIcon,
  },
  {
    label: "Marcas",
    href: "/admin/marcas",
    description: "Mantenha marcas e identidade visual do catálogo.",
    group: "catalog",
    icon: BookmarkIcon,
  },
  {
    label: "Banners",
    href: "/admin/banners",
    description: "Controle destaques e atalhos da home.",
    group: "operations",
    icon: MegaphoneIcon,
  },
  {
    label: "Pedidos",
    href: "/admin/pedidos",
    description: "Acompanhe pedidos recebidos via catálogo.",
    group: "operations",
    icon: ClipboardListIcon,
  },
  {
    label: "Configurações da loja",
    href: "/admin/configuracoes",
    description: "Centralize dados operacionais e institucionais da loja.",
    group: "operations",
    icon: SettingsIcon,
  },
];

export const adminNavigationGroups: { id: AdminNavGroup; label: string }[] = [
  { id: "catalog", label: "Catálogo" },
  { id: "operations", label: "Operação da loja" },
];

export function getAdminNavItem(pathname: string) {
  const exactMatch = adminNavigation.find((item) => item.href === pathname);

  if (exactMatch) {
    return exactMatch;
  }

  return adminNavigation.find((item) => pathname.startsWith(`${item.href}/`)) ?? adminNavigation[0];
}
