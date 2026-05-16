import { AdminModulePlaceholder } from "@/components/admin/admin-module-placeholder";
import { getAdminNavItem } from "@/lib/admin/navigation";

export default function AdminBannersPage() {
  return (
    <AdminModulePlaceholder
      columns={["Banner", "CTA", "Posição", "Status"]}
      item={getAdminNavItem("/admin/banners")}
      nextStep="Entrar com CRUD, ordenação e upload de imagem conforme a spec 08."
      phaseLabel="Fase 9"
      summary="Banners vão apoiar a home com destaques leves e navegáveis, sem transformar a vitrine em panfleto."
    />
  );
}
