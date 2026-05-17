import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/app/auth/login/login-form";
import { Container } from "@/components/layout/container";
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
    <Container className="py-10 sm:py-14 lg:py-16" size="wide">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="flex flex-col justify-between rounded-card border border-default bg-[linear-gradient(135deg,rgba(0,169,200,0.08),rgba(246,184,0,0.14))] p-8 shadow-soft sm:p-10">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              PatasGo Admin
            </p>
            <div className="space-y-3">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Entrar no admin
              </h1>
              <p className="max-w-xl text-sm leading-6 text-muted sm:text-base">
                Acesso interno para manter catálogo, banners, pedidos e configurações da Patas Pets
                com ritmo operacional simples.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Catálogo", "Atualize produtos, categorias e marcas."],
              ["Pedidos", "Consulte rapidamente o que chegou do WhatsApp."],
              ["Loja", "Ajuste banners e dados operacionais sem retrabalho."],
            ].map(([title, description]) => (
              <article
                className="rounded-card border border-default bg-white/85 p-4 backdrop-blur-sm"
                key={title}
              >
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-card border border-default bg-surface p-8 shadow-soft sm:p-10">
          <div className="mb-6 space-y-2">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Sua sessão administrativa
            </h2>
            <p className="text-sm leading-6 text-muted">
              Use uma conta com permissão de admin. Se você foi redirecionado, o login volta para a
              rota protegida original.
            </p>
          </div>

          <LoginForm nextPath={nextPath} />

          <div className="mt-6 flex flex-col gap-3 border-t border-default pt-5 text-sm leading-6 text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              Primeiro acesso? Rode <code>pnpm admin:bootstrap &lt;email&gt; &lt;senha&gt;</code>.
            </p>
            <Link
              className="font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
              href="/"
            >
              Voltar ao catálogo
            </Link>
          </div>
        </section>
      </div>
    </Container>
  );
}
