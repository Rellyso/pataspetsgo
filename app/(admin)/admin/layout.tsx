import { AdminShell } from "@/components/layout/admin-shell";
import { requireAdmin } from "@/lib/server/admin-auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessState = await requireAdmin("/admin");

  return (
    <AdminShell userEmail={accessState.user.email ?? "admin@patasgo.local"}>{children}</AdminShell>
  );
}
