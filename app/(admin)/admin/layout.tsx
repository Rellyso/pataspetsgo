import { LogoutButton } from "@/components/admin/logout-button";
import { AdminShell } from "@/components/layout/admin-shell";
import { requireAdmin } from "@/lib/server/admin-auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessState = await requireAdmin("/admin");

  return (
    <AdminShell
      actions={
        <LogoutButton className="inline-flex min-h-11 items-center justify-center rounded-full border border-default px-4 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60" />
      }
      description="Base operacional da área protegida. Navegação final e módulos entram depois."
      eyebrow="Admin protegido"
      meta={
        <>
          Sessão ativa para{" "}
          <span className="font-medium text-foreground">{accessState.user.email}</span>
        </>
      }
      title="Área administrativa"
    >
      {children}
    </AdminShell>
  );
}
