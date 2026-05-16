"use client";

type AdminErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminErrorPage({ error, reset }: AdminErrorPageProps) {
  return (
    <div className="rounded-card border border-error/20 bg-surface p-6 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-error">Erro</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
        Não foi possível carregar a área administrativa
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Tente novamente para recarregar a rota protegida. Se o problema persistir, volte ao login e
        valide a sessão administrativa.
      </p>

      {error.digest ? (
        <p className="mt-4 font-mono text-xs text-muted">Referência: {error.digest}</p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
          onClick={() => reset()}
          type="button"
        >
          Tentar novamente
        </button>
        <a
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-default bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-primary-light"
          href="/auth/login"
        >
          Voltar ao login
        </a>
      </div>
    </div>
  );
}
