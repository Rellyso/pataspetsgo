export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
            Bootstrap do MVP
          </span>
          <div className="flex flex-col gap-3">
            <h1
              className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PatasGo nasce com a base certa para um catalogo rapido e orientado ao WhatsApp.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Este primeiro bloco sobe o app com Next.js, Tailwind v4, Biome e a tipografia definida
              no design system desde o inicio.
            </p>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Next.js App Router</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Estrutura pronta para crescer com route groups, layouts publicos e admin.
            </p>
          </article>
          <article className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Biome</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Formatter e lint centralizados desde o bootstrap, sem depender do setup padrao de
              ESLint.
            </p>
          </article>
          <article className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Fonts do DESIGN.md</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Plus Jakarta Sans e IBM Plex Mono entram via next/font; General Sans dirige a voz
              display da interface.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
