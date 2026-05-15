"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PriceDisplay } from "@/components/shared/price-display";
import { useCart } from "@/features/cart/cart-context";
import type { PublicProductDetail } from "@/features/catalog/types";
import { BrandBadge } from "./brand-badge";
import { PromoBadge } from "./promo-badge";
import { QuantitySelector } from "./quantity-selector";

type ProductDetailViewProps = {
  product: PublicProductDetail;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.primaryVariant.id,
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedVariant = useMemo(
    () =>
      product.variants.find((variant) => variant.id === selectedVariantId) ??
      product.primaryVariant,
    [product, selectedVariantId],
  );

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productVariantId: selectedVariant.id,
      productSlug: product.slug,
      productName: product.name,
      variantName: selectedVariant.name,
      unitPriceSnapshot: selectedVariant.price,
      promotionalPriceSnapshot: selectedVariant.promotionalPrice,
      quantity,
      stockStatusSnapshot: selectedVariant.stockStatus,
      imageUrl: product.imageUrl,
    });

    setJustAdded(true);
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
    }
    resetTimer.current = setTimeout(() => {
      setJustAdded(false);
    }, 1600);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
        <div className="flex aspect-4/3 items-center justify-center rounded-card bg-background text-sm text-muted">
          {product.imageUrl ? (
            <Image
              alt={product.name}
              className="h-full w-full rounded-card object-cover"
              src={product.imageUrl}
            />
          ) : (
            <span>Imagem em breve</span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {product.brand ? <BrandBadge name={product.brand.name} /> : null}
          {product.isPromotion ? <PromoBadge /> : null}
        </div>

        <p className="mt-4 text-sm leading-6 text-muted">
          {product.description ?? product.shortDescription}
        </p>

        <dl className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2">
          <div>
            <dt className="font-medium text-foreground">Categoria</dt>
            <dd>{product.category?.name ?? "Sem categoria"}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Marca</dt>
            <dd>{product.brand?.name ?? "Sem marca"}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Pet</dt>
            <dd>{product.petType}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Faixa etária</dt>
            <dd>{product.ageGroup}</dd>
          </div>
        </dl>
      </article>

      <article className="rounded-card border border-default bg-surface p-6 shadow-soft">
        <PriceDisplay
          price={selectedVariant.price}
          promotionalPrice={selectedVariant.promotionalPrice}
          size="large"
        />

        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-foreground">
            Escolha a variante
          </p>
          <div className="flex flex-col gap-3">
            {product.variants.map((variant) => {
              const isSelected = variant.id === selectedVariant.id;

              return (
                <button
                  key={variant.id}
                  className={[
                    "rounded-card border px-4 py-3 text-left transition-colors duration-200",
                    isSelected
                      ? "border-primary bg-primary-light/40"
                      : "border-default bg-background hover:border-primary-light",
                  ].join(" ")}
                  onClick={() => setSelectedVariantId(variant.id)}
                  type="button"
                >
                  <p className="font-medium text-foreground">{variant.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    Status: {variant.stockStatus}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <QuantitySelector onChange={setQuantity} value={quantity} />
          <span className="text-sm text-muted">Total estimado</span>
        </div>

        {selectedVariant.stockStatus === "consult" ? (
          <p className="mt-4 rounded-card border border-warning/30 bg-warning/10 px-4 py-3 text-sm leading-6 text-foreground">
            Este item pode ser pedido, mas a confirmação final de
            disponibilidade será feita pela loja.
          </p>
        ) : null}

        <button
          className={[
            "mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full px-4 py-3 text-sm md:text-base font-semibold text-white transition-colors duration-200",
            justAdded
              ? "bg-success hover:bg-success/90"
              : "bg-primary hover:bg-primary-dark",
          ].join(" ")}
          onClick={handleAdd}
          type="button"
        >
          {justAdded
            ? "Adicionado"
            : selectedVariant.stockStatus === "consult"
              ? "Adicionar com confirmação"
              : "Adicionar ao pedido"}
        </button>

        {justAdded ? (
          <p
            aria-live="polite"
            className="mt-2 text-sm font-medium text-success"
          >
            Item adicionado ao pedido.
          </p>
        ) : null}
      </article>
    </div>
  );
}
