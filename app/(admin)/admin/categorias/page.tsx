import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryManager } from "@/components/admin/catalog/category-manager";
import { DataTableShell } from "@/components/admin/data-table-shell";
import { getAdminCategories } from "@/features/admin/catalog/queries";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        description="Categorias organizam seções do catálogo e precisam continuar operacionais mesmo em manutenção rápida pelo celular."
        eyebrow="Fase 8"
        meta="A desativação lógica evita vazamento para a vitrine sem excluir histórico de relacionamento."
        title="Categorias"
      />
      <DataTableShell
        columns={["Categoria", "Uso", "Status", "Ações"]}
        description="Criação e edição acontecem em sheet para manter o fluxo curto e repetível."
        title="Estrutura do catálogo"
      >
        <CategoryManager items={categories} />
      </DataTableShell>
    </div>
  );
}
