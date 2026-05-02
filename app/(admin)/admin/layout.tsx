import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/server/admin-auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessState = await requireAdmin("/admin");

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-primary">Admin protegido</p>
            <h1 className="text-3xl font-semibold">Area administrativa</h1>
            <p className="text-sm text-muted">
              Sessao ativa para{" "}
              <span className="font-medium text-foreground">{accessState.user.email}</span>
            </p>
          </div>

          <LogoutButton className="inline-flex items-center justify-center rounded-md border border-border px-4 py-3 text-sm font-semibold transition hover:bg-primary-light" />
        </header>

        {children}
      </div>
    </main>
  );
}
