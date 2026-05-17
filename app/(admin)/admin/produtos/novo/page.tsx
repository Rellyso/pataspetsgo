import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductEditor } from "@/components/admin/catalog/product-editor";
import { getAdminProductFormOptions } from "@/features/admin/catalog/queries";

export default async function AdminNewProductPage() {
  const options = await getAdminProductFormOptions();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        actions={
          <Link
            className="text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
            href="/admin/produtos"
          >
            Voltar para produtos
          </Link>
        }
        description="Crie um produto com base operacional completa e depois conclua a publicação adicionando variantes válidas."
        eyebrow="Produtos"
        meta="O produto pode nascer incompleto; o admin vai sinalizar o que ainda impede a vitrine."
        title="Criar produto"
      />
      <ProductEditor
        brandOptions={options.brands}
        categoryOptions={options.categories}
        mode="create"
        product={null}
      />
    </div>
  );
}
