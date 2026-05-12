import Link from "next/link";

import { LogoutButton } from "@/components/admin/logout-button";
import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/shared/section-title";
import { getAdminAccessState } from "@/lib/server/admin-auth";

export default async function AdminAccessDeniedPage() {
  const accessState = await getAdminAccessState();

  return (
    <Container className="py-16" size="narrow">
      <div className="flex flex-col gap-6 rounded-card border border-default bg-surface p-8 shadow-soft">
        <SectionTitle
          subtitle={
            accessState.user?.email
              ? `Você entrou como ${accessState.user.email}, mas essa conta ainda não foi promovida.`
              : "Entre com conta autorizada para continuar."
          }
          title="Sua conta não tem permissão de admin"
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
            href="/auth/login"
          >
            Voltar para login
          </Link>

          {accessState.user ? (
            <LogoutButton className="inline-flex min-h-11 items-center justify-center rounded-full border border-default px-4 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60" />
          ) : null}
        </div>
      </div>
    </Container>
  );
}
