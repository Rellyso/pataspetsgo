"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PriceDisplay } from "@/components/shared/price-display";
import { useCart } from "@/features/cart/cart-context";
import type { PublicCatalogItem } from "@/features/catalog/types";
import { BrandBadge } from "./brand-badge";
import { PromoBadge } from "./promo-badge";

type ProductCardProps = {
  product: PublicCatalogItem;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const canAddDirectly = product.variants.length === 1;
  const primaryVariant = product.primaryVariant;
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ctaLabel =
    primaryVariant.stockStatus === "consult" ? "Adicionar com confirmação" : "Adicionar ao pedido";

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
      productVariantId: primaryVariant.id,
      productSlug: product.slug,
      productName: product.name,
      variantName: primaryVariant.name,
      unitPriceSnapshot: primaryVariant.price,
      promotionalPriceSnapshot: primaryVariant.promotionalPrice,
      stockStatusSnapshot: primaryVariant.stockStatus,
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
    <article className="flex h-full flex-col rounded-3xl border border-default bg-surface p-3 shadow-soft transition-colors duration-200 hover:border-primary-light sm:p-4">
      <div className="relative overflow-hidden rounded-[1.1rem] bg-background">
        <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          {product.brand ? <BrandBadge name={product.brand.name} /> : null}
          {product.isPromotion ? <PromoBadge /> : null}
        </div>

        <div className="relative flex aspect-square items-center justify-center text-xs text-muted sm:aspect-[1.1/1]">
          {product.imageUrl ? (
            <Image
              alt={product.name}
              className="object-cover"
              fill
              loading="eager"
              sizes="(min-width: 640px) 320px, 50vw"
              src={product.imageUrl}
            />
          ) : (
            <span>Imagem em breve</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        <div className="space-y-1.5">
          <h3 className="line-clamp-2 font-display text-[1.05rem] font-semibold leading-tight text-foreground sm:text-lg">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-5 text-muted">
            {product.shortDescription ?? product.description}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <PriceDisplay
            price={primaryVariant.price}
            promotionalPrice={primaryVariant.promotionalPrice}
          />
          <span className="text-xs text-muted">
            {canAddDirectly ? "Pedido rápido" : `${product.variants.length} opções`}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          {canAddDirectly ? (
            <button
              className={[
                "inline-flex min-h-11 w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white transition-colors duration-200",
                justAdded ? "bg-success hover:bg-success/90" : "bg-primary hover:bg-primary-dark",
              ].join(" ")}
              onClick={handleAdd}
              type="button"
            >
              {justAdded ? "Adicionado" : ctaLabel}
            </button>
          ) : (
            <Link
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
              href={`/produto/${product.slug}`}
            >
              Escolher opções
            </Link>
          )}

          <div className="flex items-center justify-between gap-3">
            {justAdded ? (
              <p aria-live="polite" className="text-xs font-medium text-success">
                Item adicionado ao pedido.
              </p>
            ) : (
              <span className="text-xs text-muted">
                {product.category?.name ?? "Catálogo público"}
              </span>
            )}

            <Link
              className="text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-dark"
              href={`/produto/${product.slug}`}
            >
              Ver detalhes
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
