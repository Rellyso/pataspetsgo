import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StoreSettingsManager } from "@/components/admin/store-settings/store-settings-manager";
import { getAdminStoreSettings } from "@/features/admin/store-settings/queries";

export default async function AdminSettingsPage() {
  const settings = await getAdminStoreSettings();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        description="Centralize aqui os dados institucionais da loja e as flags operacionais que impactam a home, o rodapé público e o checkout."
        eyebrow="Fase 9.3"
        meta="Singleton obrigatório: a área admin edita a linha existente, sem criar uma segunda configuração."
        title="Configurações"
      />

      <StoreSettingsManager settings={settings} />
    </div>
  );
}
