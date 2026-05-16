import { AdminModulePlaceholder } from "@/components/admin/admin-module-placeholder";
import { getAdminNavItem } from "@/lib/admin/navigation";

export default function AdminBrandsPage() {
  return (
    <AdminModulePlaceholder
      columns={["Marca", "Slug", "Logo", "Status"]}
      item={getAdminNavItem("/admin/marcas")}
      nextStep="Adicionar listagem, formulário e fluxo de logo com Supabase Storage na fase do catálogo."
      phaseLabel="Fase 8"
      summary="Marcas entram como apoio operacional do catálogo e dos filtros públicos, sem complexidade de branding excessiva."
    />
  );
}
