type ProductPageProps = {
  params: { slug: string };
};

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <h1 className="text-3xl font-semibold">Produto: {params.slug}</h1>
        <p className="text-muted">
          Placeholder do detalhe de produto. Variantes e CTA entram na fase 5.
        </p>
      </div>
    </main>
  );
}
