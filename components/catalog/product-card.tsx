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
    primaryVariant.stockStatus === "consult"
      ? "Adicionar com confirmação"
      : "Adicionar ao pedido";

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
    <article className="flex h-full flex-col rounded-card border border-default bg-surface p-3 shadow-soft transition-colors duration-200 hover:border-primary-light sm:p-4">
      <div className="flex aspect-square items-center justify-center rounded-card bg-background text-xs text-muted sm:aspect-4/3 sm:text-sm">
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

      <div className="mt-3 flex flex-1 flex-col gap-2.5 sm:mt-4 sm:gap-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {product.brand ? <BrandBadge name={product.brand.name} /> : null}
          {product.isPromotion ? <PromoBadge /> : null}
        </div>

        <div className="space-y-1.5">
          <h3 className="line-clamp-2 font-display text-base font-semibold text-foreground sm:text-lg">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-xs leading-5 text-muted sm:text-sm sm:leading-6">
            {product.shortDescription ?? product.description}
          </p>
        </div>

        <PriceDisplay
          price={primaryVariant.price}
          promotionalPrice={primaryVariant.promotionalPrice}
        />

        <div className="mt-auto flex flex-col gap-1.5 sm:gap-2">
          {canAddDirectly ? (
            <button
              className={[
                "inline-flex min-h-10 items-center justify-center rounded-full px-3 py-2.5 text-xs font-semibold text-white transition-colors duration-200 sm:min-h-11 sm:px-4 sm:py-3 sm:text-sm",
                justAdded
                  ? "bg-success hover:bg-success/90"
                  : "bg-primary hover:bg-primary-dark",
              ].join(" ")}
              onClick={handleAdd}
              type="button"
            >
              {justAdded ? "Adicionado" : ctaLabel}
            </button>
          ) : (
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-primary px-3 py-2.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-primary-dark sm:min-h-11 sm:px-4 sm:py-3 sm:text-sm"
              href={`/produto/${product.slug}`}
            >
              Escolher opções
            </Link>
          )}

          {justAdded ? (
            <p aria-live="polite" className="text-xs font-medium text-success">
              Item adicionado ao pedido.
            </p>
          ) : null}

          <Link
            className="inline-flex min-h-9 items-center justify-center rounded-full border border-default bg-surface px-3 py-2 text-xs font-semibold text-foreground transition-colors duration-200 hover:border-primary-light hover:text-foreground sm:min-h-10 sm:px-4 sm:text-sm"
            href={`/produto/${product.slug}`}
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
