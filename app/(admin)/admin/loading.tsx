export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-card border border-default bg-surface p-6 shadow-soft">
        <div className="h-4 w-28 animate-pulse rounded-full bg-primary-light" />
        <div className="mt-4 h-8 w-56 animate-pulse rounded-full bg-background" />
        <div className="mt-3 h-5 w-full max-w-3xl animate-pulse rounded-full bg-background" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <article
            className="rounded-card border border-default bg-surface p-5 shadow-soft"
            key={String(index)}
          >
            <div className="h-4 w-24 animate-pulse rounded-full bg-background" />
            <div className="mt-4 h-8 w-32 animate-pulse rounded-full bg-background" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-background" />
          </article>
        ))}
      </section>

      <section className="rounded-card border border-default bg-surface p-5 shadow-soft">
        <div className="h-5 w-40 animate-pulse rounded-full bg-background" />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              className="rounded-card border border-default bg-background p-4"
              key={String(index)}
            >
              <div className="h-5 w-28 animate-pulse rounded-full bg-surface" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-surface" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded-full bg-surface" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
