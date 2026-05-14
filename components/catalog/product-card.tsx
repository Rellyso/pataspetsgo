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
    <article className="flex h-full flex-col rounded-card border border-default bg-surface p-4 shadow-soft transition-colors duration-200 hover:border-primary-light">
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

      <div className="mt-4 flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {product.brand ? <BrandBadge name={product.brand.name} /> : null}
          {product.isPromotion ? <PromoBadge /> : null}
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-lg font-semibold text-foreground">{product.name}</h3>
          <p className="text-sm leading-6 text-muted">
            {product.shortDescription ?? product.description}
          </p>
        </div>

        <PriceDisplay
          price={primaryVariant.price}
          promotionalPrice={primaryVariant.promotionalPrice}
        />

        <div className="mt-auto flex flex-col gap-2">
          {canAddDirectly ? (
            <button
              className={[
                "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white transition-colors duration-200",
                justAdded ? "bg-success hover:bg-success/90" : "bg-primary hover:bg-primary-dark",
              ].join(" ")}
              onClick={handleAdd}
              type="button"
            >
              {justAdded ? "Adicionado" : ctaLabel}
            </button>
          ) : (
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
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
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-default bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary-light hover:text-foreground"
            href={`/produto/${product.slug}`}
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
