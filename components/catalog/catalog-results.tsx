"use client";

import { useEffect, useState } from "react";
import type { PublicCatalogItem } from "@/features/catalog/types";
import {
  type CatalogViewMode,
  loadCatalogViewMode,
  saveCatalogViewMode,
} from "@/features/catalog/view-mode-storage";
import { CatalogViewToggle } from "./catalog-view-toggle";
import { ProductCard } from "./product-card";

type CatalogSection = {
  id: string;
  items: PublicCatalogItem[];
  name: string;
};

type CatalogResultsProps = {
  sections: CatalogSection[];
};

export function CatalogResults({ sections }: CatalogResultsProps) {
  const [viewMode, setViewMode] = useState<CatalogViewMode>("comfortable");

  useEffect(() => {
    const storedViewMode = loadCatalogViewMode();

    if (storedViewMode) {
      setViewMode(storedViewMode);
    }
  }, []);

  const handleChangeView = (nextViewMode: CatalogViewMode) => {
    setViewMode(nextViewMode);
    saveCatalogViewMode(nextViewMode);
  };

  const gridClassName =
    viewMode === "compact"
      ? "grid grid-cols-2 gap-3 xl:grid-cols-3"
      : viewMode === "list"
        ? "grid grid-cols-1 gap-3"
        : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2";

  return (
    <div className="space-y-7">
      <CatalogViewToggle onChange={handleChangeView} value={viewMode} />

      {sections.map((section) => (
        <section key={section.id} className="scroll-mt-36 space-y-4" id={section.id}>
          <div className="flex items-end justify-between gap-3 border-b border-default pb-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">{section.name}</h2>
              <p className="mt-1 text-sm text-muted">{section.items.length} item(ns) nesta seção</p>
            </div>
          </div>

          <div className={gridClassName}>
            {section.items.map((item) => (
              <ProductCard key={item.id} product={item} viewMode={viewMode} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
