import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BannerManager } from "@/components/admin/banners/banner-manager";
import { getAdminBanners } from "@/features/admin/banners/queries";

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        description="Controle os destaques da home com imagens reais, CTA claro e ordenação simples para manter a vitrine leve."
        eyebrow="Fase 9.2"
        meta="Banner ativo precisa de imagem e destino válido para não criar navegação quebrada no público."
        title="Banners"
      />

      <BannerManager items={banners} />
    </div>
  );
}
