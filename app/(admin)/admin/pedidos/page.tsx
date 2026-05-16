import { AdminModulePlaceholder } from "@/components/admin/admin-module-placeholder";
import { getAdminNavItem } from "@/lib/admin/navigation";

export default function AdminOrdersPage() {
  return (
    <AdminModulePlaceholder
      columns={["Pedido", "Cliente", "Tipo", "Status"]}
      item={getAdminNavItem("/admin/pedidos")}
      nextStep="Conectar listagem por snapshot, detalhe do pedido e atualização simples de status na fase 9."
      phaseLabel="Fase 9"
      summary="Pedidos serão consultados neste módulo com leitura rápida para apoiar o atendimento via WhatsApp."
    />
  );
}
