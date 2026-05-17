import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductEditor } from "@/components/admin/catalog/product-editor";
import {
  getAdminProductDetail,
  getAdminProductFormOptions,
} from "@/features/admin/catalog/queries";

type AdminProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
  const { id } = await params;
  const [product, options] = await Promise.all([
    getAdminProductDetail(id),
    getAdminProductFormOptions(),
  ]);

  if (!product) {
    notFound();
  }

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
        description="Atualize conteúdo, imagem, flags comerciais e variantes sem sair do contexto operacional do produto."
        eyebrow="Produtos"
        meta={`Produto interno ${product.slug}`}
        title={product.name}
      />
      <ProductEditor
        brandOptions={options.brands}
        categoryOptions={options.categories}
        mode="edit"
        product={product}
      />
    </div>
  );
}
