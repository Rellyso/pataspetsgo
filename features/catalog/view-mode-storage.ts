"use client";

export const CATALOG_VIEW_MODE_STORAGE_KEY = "patasgo-catalog-view-mode:v1";

export type CatalogViewMode = "comfortable" | "compact" | "list";

export function isCatalogViewMode(value: string | null): value is CatalogViewMode {
  return value === "comfortable" || value === "compact" || value === "list";
}

export function loadCatalogViewMode(): CatalogViewMode | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(CATALOG_VIEW_MODE_STORAGE_KEY);
  return isCatalogViewMode(raw) ? raw : null;
}

export function saveCatalogViewMode(viewMode: CatalogViewMode) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CATALOG_VIEW_MODE_STORAGE_KEY, viewMode);
}
