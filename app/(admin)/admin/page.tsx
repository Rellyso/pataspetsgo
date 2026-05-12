export default function AdminHomePage() {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold text-foreground">Auth core pronto</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Layout protegido segue validando sessao e role `admin` no servidor antes de qualquer
          render.
        </p>
      </article>

      <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold text-foreground">Próxima fase</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Navegação lateral, headers operacionais, tabelas e cards administrativos entram na Fase 7.
        </p>
      </article>
    </section>
  );
}
