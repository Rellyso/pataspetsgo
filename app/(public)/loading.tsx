import { Container } from "@/components/layout/container";

export default function PublicLoading() {
  return (
    <Container className="flex flex-col gap-6">
      <section className="rounded-card border border-default bg-surface p-6 shadow-soft sm:p-8">
        <div className="h-8 w-48 animate-pulse rounded-full bg-primary-light" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded-full bg-background" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article
            key={String(index)}
            className="rounded-card border border-default bg-surface p-4 shadow-soft"
          >
            <div className="aspect-[4/3] animate-pulse rounded-card bg-background" />
            <div className="mt-4 h-5 w-3/4 animate-pulse rounded-full bg-background" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-background" />
            <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-background" />
          </article>
        ))}
      </section>
    </Container>
  );
}
