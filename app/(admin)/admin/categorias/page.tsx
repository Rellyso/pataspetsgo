import { AdminModulePlaceholder } from "@/components/admin/admin-module-placeholder";
import { getAdminNavItem } from "@/lib/admin/navigation";

export default function AdminCategoriesPage() {
  return (
    <AdminModulePlaceholder
      columns={["Categoria", "Slug", "Ordem", "Status"]}
      item={getAdminNavItem("/admin/categorias")}
      nextStep="Conectar listagem, ordenação simples e formulário administrativo conforme a spec 07."
      phaseLabel="Fase 8"
      summary="Categorias vão organizar a vitrine pública e os atalhos do catálogo com leitura operacional simples."
    />
  );
}
