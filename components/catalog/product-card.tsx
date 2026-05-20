"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PriceDisplay } from "@/components/shared/price-display";
import { useCart } from "@/features/cart/cart-context";
import type { PublicCatalogItem } from "@/features/catalog/types";
import type { CatalogViewMode } from "@/features/catalog/view-mode-storage";
import { BrandBadge } from "./brand-badge";
import { PromoBadge } from "./promo-badge";

type ProductCardProps = {
  product: PublicCatalogItem;
  viewMode?: CatalogViewMode;
};

export function ProductCard({
  product,
  viewMode = "comfortable",
}: ProductCardProps) {
  const { addItem } = useCart();
  const canAddDirectly = product.variants.length === 1;
  const primaryVariant = product.primaryVariant;
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCompact = viewMode === "compact";
  const isList = viewMode === "list";

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
    <article
      className={[
        "border border-default bg-surface shadow-soft transition-colors duration-200 hover:border-primary-light",
        isList
          ? "grid grid-cols-[7rem_minmax(0,1fr)] gap-3 rounded-[1.35rem] p-2.5 sm:grid-cols-[8.5rem_minmax(0,1fr)]"
          : `flex h-full flex-col ${isCompact ? "rounded-[1.35rem] p-2.5" : "rounded-3xl p-3 sm:p-4"}`,
      ].join(" ")}
    >
      <div
        className={[
          "relative overflow-hidden bg-background",
          isList
            ? "rounded-[0.95rem]"
            : isCompact
              ? "rounded-2xl"
              : "rounded-[1.1rem]",
        ].join(" ")}
      >
        <div
          className={[
            "absolute z-10 flex flex-wrap items-center gap-1.5",
            isList || isCompact ? "left-2 top-2" : "left-3 top-3",
          ].join(" ")}
        >
          {product.brand ? <BrandBadge name={product.brand.name} /> : null}
          {product.isPromotion ? <PromoBadge /> : null}
        </div>

        <div
          className={[
            "relative flex items-center justify-center text-xs text-muted",
            isList
              ? "aspect-square h-full min-h-28 sm:min-h-34"
              : isCompact
                ? "aspect-[1.2/1]"
                : "aspect-[1.2/1] sm:aspect-[1.12/1]",
          ].join(" ")}
        >
          {product.imageUrl ? (
            <Image
              alt={product.name}
              className="object-cover"
              fill
              loading="eager"
              sizes={
                isList
                  ? "(min-width: 640px) 140px, 112px"
                  : isCompact
                    ? "(min-width: 1280px) 220px, (min-width: 640px) 240px, 46vw"
                    : "(min-width: 1280px) 320px, (min-width: 640px) 280px, 90vw"
              }
              src={product.imageUrl}
            />
          ) : (
            <span>Imagem em breve</span>
          )}
        </div>
      </div>

      <div
        className={
          isList
            ? "flex min-w-0 flex-1 flex-col gap-2 py-1"
            : isCompact
              ? "mt-3 flex flex-1 flex-col gap-2.5"
              : "mt-3 flex flex-1 flex-col gap-3"
        }
      >
        <div className={isList || isCompact ? "space-y-1" : "space-y-1.5"}>
          <h3
            className={[
              "line-clamp-2 font-display font-semibold leading-tight text-foreground",
              isList
                ? "text-[0.98rem] sm:text-[1.05rem]"
                : isCompact
                  ? "text-[0.95rem]"
                  : "text-[1rem] sm:text-[1.05rem]",
            ].join(" ")}
          >
            {product.name}
          </h3>
          <p
            className={[
              "text-muted",
              isList
                ? "line-clamp-2 text-xs leading-4 sm:text-sm"
                : isCompact
                  ? "line-clamp-1 text-xs leading-4"
                  : "line-clamp-2 text-sm leading-5",
            ].join(" ")}
          >
            {product.shortDescription ?? product.description}
          </p>
        </div>

        <div
          className={
            isList
              ? "flex flex-wrap items-end justify-between gap-x-3 gap-y-1"
              : isCompact
                ? "flex flex-col gap-1.5"
                : "flex items-end justify-between gap-3"
          }
        >
          <PriceDisplay
            price={primaryVariant.price}
            promotionalPrice={primaryVariant.promotionalPrice}
            size={isList || isCompact ? "small" : "default"}
          />
          <span
            className={
              isList || isCompact
                ? "text-[0.7rem] leading-4 text-muted"
                : "text-xs text-muted"
            }
          >
            {canAddDirectly
              ? "Pedido rápido"
              : `${product.variants.length} opções`}
          </span>
        </div>

        <div
          className={
            isList
              ? "mt-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              : isCompact
                ? "mt-auto flex flex-col gap-1.5"
                : "mt-auto flex flex-col gap-2"
          }
        >
          <div
            className={
              isList
                ? "order-2 flex items-center justify-between gap-3 sm:order-1"
                : "flex items-center justify-between gap-3"
            }
          >
            {justAdded ? (
              <p
                aria-live="polite"
                className={
                  isList || isCompact
                    ? "text-[0.7rem] font-medium text-success"
                    : "text-xs font-medium text-success"
                }
              >
                Item adicionado ao pedido.
              </p>
            ) : (
              <span
                className={
                  isList || isCompact
                    ? "text-[0.7rem] leading-4 text-muted"
                    : "text-xs text-muted"
                }
              >
                {product.category?.name ?? "Catálogo público"}
              </span>
            )}

            <Link
              className={[
                "font-semibold text-primary transition-colors duration-200 hover:text-primary-dark",
                isList || isCompact ? "text-[0.8rem]" : "text-sm",
              ].join(" ")}
              href={`/produto/${product.slug}`}
            >
              Ver detalhes
            </Link>
          </div>

          {canAddDirectly ? (
            <button
              className={[
                "inline-flex items-center justify-center rounded-full px-4 font-semibold text-white transition-colors duration-200",
                isList
                  ? "order-1 min-h-10 w-full py-2 text-[0.8rem] sm:order-2 sm:w-auto sm:min-w-42"
                  : isCompact
                    ? "min-h-10 w-full py-2 text-[0.8rem]"
                    : "min-h-11 w-full py-3 text-sm",
                justAdded
                  ? "bg-success hover:bg-success/90"
                  : "bg-primary hover:bg-primary-dark",
              ].join(" ")}
              onClick={handleAdd}
              type="button"
            >
              {justAdded
                ? "Adicionado"
                : isList || isCompact
                  ? "Adicionar"
                  : ctaLabel}
            </button>
          ) : (
            <Link
              className={[
                "inline-flex items-center justify-center rounded-full bg-primary px-4 font-semibold text-white transition-colors duration-200 hover:bg-primary-dark",
                isList
                  ? "order-1 min-h-10 w-full py-2 text-[0.8rem] sm:order-2 sm:w-auto sm:min-w-42"
                  : isCompact
                    ? "min-h-10 w-full py-2 text-[0.8rem]"
                    : "min-h-11 w-full py-3 text-sm",
              ].join(" ")}
              href={`/produto/${product.slug}`}
            >
              {isList || isCompact ? "Ver opções" : "Escolher opções"}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
