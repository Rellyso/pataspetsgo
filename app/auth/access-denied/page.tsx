import Link from "next/link";

import { LogoutButton } from "@/components/admin/logout-button";
import { getAdminAccessState } from "@/lib/server/admin-auth";

export default async function AdminAccessDeniedPage() {
  const accessState = await getAdminAccessState();

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-warning">Acesso negado</p>
          <h1 className="text-3xl font-semibold">Sua conta nao tem permissao de admin</h1>
          <p className="text-muted">
            {accessState.user?.email
              ? `Voce entrou como ${accessState.user.email}, mas essa conta ainda nao foi promovida.`
              : "Entre com uma conta autorizada para continuar."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            href="/auth/login"
          >
            Voltar para o login
          </Link>

          {accessState.user ? (
            <LogoutButton className="inline-flex items-center justify-center rounded-md border border-border px-4 py-3 text-sm font-semibold transition hover:bg-primary-light" />
          ) : null}
        </div>
      </div>
    </main>
  );
}
