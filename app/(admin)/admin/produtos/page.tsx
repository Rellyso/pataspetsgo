import { AdminModulePlaceholder } from "@/components/admin/admin-module-placeholder";
import { getAdminNavItem } from "@/lib/admin/navigation";

export default function AdminProductsPage() {
  return (
    <AdminModulePlaceholder
      columns={["Produto", "Categoria", "Status", "Atualização"]}
      item={getAdminNavItem("/admin/produtos")}
      nextStep="Criar listagem, filtros, formulários e gestão de variantes conforme a spec 07."
      phaseLabel="Fase 8"
      summary="Este módulo será a base operacional do catálogo, com foco em publicação segura, variantes e ativação lógica."
    />
  );
}
