import { redirect } from "next/navigation";

import { LoginForm } from "@/app/auth/login/login-form";
import { getAdminAccessState, normalizeNextPath } from "@/lib/server/admin-auth";

type AdminLoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = normalizeNextPath(params.next);
  const accessState = await getAdminAccessState();

  if (accessState.status === "admin") {
    redirect(nextPath);
  }

  if (accessState.status === "forbidden") {
    redirect("/auth/access-denied");
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-primary">Area administrativa</p>
          <h1 className="text-3xl font-semibold">Entrar no admin</h1>
          <p className="text-muted">
            Use um usuario autorizado para acessar os modulos internos da loja.
          </p>
        </div>

        <LoginForm nextPath={nextPath} />

        <p className="text-sm text-muted">
          Primeiro acesso? Rode <code>pnpm admin:bootstrap &lt;email&gt; &lt;senha&gt;</code>.
        </p>
      </div>
    </main>
  );
}
