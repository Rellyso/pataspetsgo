import { redirect } from "next/navigation";
import { LoginForm } from "@/app/auth/login/login-form";
import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/shared/section-title";
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
    <Container className="py-16" size="narrow">
      <div className="flex flex-col gap-6 rounded-card border border-default bg-surface p-8 shadow-soft">
        <SectionTitle
          as="h1"
          subtitle="Use usuário autorizado para acessar módulos internos da loja."
          title="Entrar no admin"
        />

        <LoginForm nextPath={nextPath} />

        <p className="text-sm leading-6 text-muted">
          Primeiro acesso? Rode <code>pnpm admin:bootstrap &lt;email&gt; &lt;senha&gt;</code>.
        </p>
      </div>
    </Container>
  );
}
