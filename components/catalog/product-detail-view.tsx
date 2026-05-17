"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PriceDisplay } from "@/components/shared/price-display";
import { useCart } from "@/features/cart/cart-context";
import type { PublicProductDetail } from "@/features/catalog/types";
import { formatCurrency } from "@/lib/currency";
import { BrandBadge } from "./brand-badge";
import { PromoBadge } from "./promo-badge";
import { QuantitySelector } from "./quantity-selector";

type ProductDetailViewProps = {
  product: PublicProductDetail;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem, estimatedTotal, totalItems } = useCart();
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

  const selectedTotal =
    (selectedVariant.promotionalPrice ?? selectedVariant.price) * quantity;

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
    <>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <article className="overflow-hidden rounded-[1.6rem] border border-default bg-surface shadow-soft">
          <div className="relative flex aspect-[1.05/1] items-center justify-center bg-background text-sm text-muted">
            {product.imageUrl ? (
              <Image
                alt={product.name}
                className="object-cover"
                loading="eager"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                src={product.imageUrl}
              />
            ) : (
              <span>Imagem em breve</span>
            )}
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {product.brand ? <BrandBadge name={product.brand.name} /> : null}
              {product.isPromotion ? <PromoBadge /> : null}
              {product.category ? (
                <span className="inline-flex rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-foreground">
                  {product.category.name}
                </span>
              ) : null}
            </div>

            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
                {product.description ?? product.shortDescription}
              </p>
            </div>

            <dl className="grid gap-3 rounded-[1.25rem] border border-default bg-background p-4 text-sm text-muted sm:grid-cols-3">
              <div>
                <dt className="font-semibold text-foreground">Pet</dt>
                <dd className="mt-1">{product.petType}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Faixa etária</dt>
                <dd className="mt-1">{product.ageGroup}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Porte</dt>
                <dd className="mt-1">{product.sizeGroup}</dd>
              </div>
            </dl>
          </div>
        </article>

        <article className="rounded-[1.6rem] border border-default bg-surface p-5 shadow-soft sm:p-6">
          <p className="text-sm font-semibold text-primary">
            Escolha simples e rápida
          </p>
          <div className="mt-3">
            <PriceDisplay
              price={selectedVariant.price}
              promotionalPrice={selectedVariant.promotionalPrice}
              size="large"
            />
          </div>
          <p className="mt-2 text-sm text-muted">Total desta seleção</p>
          <div className="mt-1">
            <PriceDisplay price={selectedTotal} size="default" />
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Variantes disponíveis
            </p>
            <div className="flex flex-col gap-3">
              {product.variants.map((variant) => {
                const isSelected = variant.id === selectedVariant.id;

                return (
                  <button
                    key={variant.id}
                    className={[
                      "rounded-[1.2rem] border px-4 py-4 text-left transition-colors duration-200",
                      isSelected
                        ? "border-primary bg-primary-light/35"
                        : "border-default bg-background hover:border-primary-light",
                    ].join(" ")}
                    onClick={() => setSelectedVariantId(variant.id)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {variant.name}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {variant.stockStatus === "consult"
                            ? "Disponível com confirmação da loja"
                            : "Disponível para adicionar agora"}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(
                          variant.promotionalPrice ?? variant.price,
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Quantidade
              </p>
              <p className="text-sm text-muted">
                Ajuste antes de seguir para o pedido.
              </p>
            </div>
            <QuantitySelector onChange={setQuantity} value={quantity} />
          </div>

          {selectedVariant.stockStatus === "consult" ? (
            <p className="mt-4 rounded-[1.15rem] border border-warning/30 bg-warning/10 px-4 py-3 text-sm leading-6 text-foreground">
              Este item pode entrar no pedido, mas a confirmação final de
              disponibilidade será feita pela loja.
            </p>
          ) : null}

          <div className="mt-6 hidden lg:block">
            <button
              className={[
                "inline-flex min-h-12 w-full items-center justify-center rounded-full px-4 py-3 text-base font-semibold text-white transition-colors duration-200",
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
          </div>
        </article>
      </div>

      <div className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] z-40 mx-auto max-w-xl lg:hidden">
        <div className="rounded-3xl border border-default bg-surface p-4 shadow-[0_26px_55px_-32px_rgba(23,32,51,0.55)]">
          {totalItems > 0 ? (
            <Link
              className="mb-3 flex items-center justify-between rounded-[1.15rem] bg-background px-4 py-3 text-sm"
              href="/pedido"
            >
              <span className="font-semibold text-foreground">
                {totalItems}{" "}
                {totalItems > 1 ? "itens no pedido" : "item no pedido"}
              </span>
              <span className="text-muted">
                {formatCurrency(estimatedTotal)}
              </span>
            </Link>
          ) : null}

          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Seleção atual
              </p>
              <p className="mt-1 truncate font-display text-lg font-semibold text-foreground">
                {selectedVariant.name}
              </p>
              <p className="text-sm text-muted">
                {formatCurrency(
                  selectedVariant.promotionalPrice ?? selectedVariant.price,
                )}{" "}
                por unidade
              </p>
            </div>

            <QuantitySelector onChange={setQuantity} value={quantity} />
          </div>

          <button
            className={[
              "mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white transition-colors duration-200",
              justAdded
                ? "bg-success hover:bg-success/90"
                : "bg-primary hover:bg-primary-dark",
            ].join(" ")}
            onClick={handleAdd}
            type="button"
          >
            {justAdded
              ? "Adicionado ao pedido"
              : selectedVariant.stockStatus === "consult"
                ? "Adicionar com confirmação"
                : "Adicionar ao pedido"}
          </button>
        </div>
      </div>
    </>
  );
}
