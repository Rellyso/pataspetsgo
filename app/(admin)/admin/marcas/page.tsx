import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BrandManager } from "@/components/admin/catalog/brand-manager";
import { DataTableShell } from "@/components/admin/data-table-shell";
import { getAdminBrands } from "@/features/admin/catalog/queries";

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        description="Marcas apoiam a busca e os filtros públicos, mas a gestão continua simples, com troca rápida de logo e ativação lógica."
        eyebrow="Fase 8"
        meta="A marca inativa deixa de sustentar a publicação pública dos produtos relacionados quando a regra exigir marca ativa."
        title="Marcas"
      />
      <DataTableShell
        columns={["Marca", "Uso", "Status", "Ações"]}
        description="Logos e dados editoriais entram na listagem com edição lateral curta."
        title="Marcas do catálogo"
      >
        <BrandManager items={brands} />
      </DataTableShell>
    </div>
  );
}
