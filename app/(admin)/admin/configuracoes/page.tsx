import { AdminModulePlaceholder } from "@/components/admin/admin-module-placeholder";
import { getAdminNavItem } from "@/lib/admin/navigation";

export default function AdminSettingsPage() {
  return (
    <AdminModulePlaceholder
      columns={["Campo", "Valor atual", "Impacto", "Atualização"]}
      item={getAdminNavItem("/admin/configuracoes")}
      nextStep="Editar o singleton `store_settings` com validação e feedback coerente na fase 9."
      phaseLabel="Fase 9"
      summary="Configurações da loja vão concentrar dados institucionais e regras operacionais que impactam o público e o checkout."
    />
  );
}
