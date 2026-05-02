export default function AdminHomePage() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <article className="rounded-3xl border border-border bg-surface p-6 shadow-sm md:col-span-2">
        <h2 className="text-xl font-semibold">Auth core pronto</h2>
        <p className="mt-2 text-muted">
          Esta rota agora valida sessao e role `admin` no servidor antes de renderizar.
        </p>
      </article>

      <article className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Proxima fase</h2>
        <p className="mt-2 text-muted">
          O shell operacional real, navegacao e modulos administrativos entram na Fase 7.
        </p>
      </article>
    </section>
  );
}
