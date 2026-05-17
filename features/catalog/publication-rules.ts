export type PublicationStatusCode =
  | "ready"
  | "missing_variant"
  | "inactive_category"
  | "inactive_brand"
  | "inactive_product";

type ActiveRelation = {
  is_active: boolean;
} | null;

type VariantLike = {
  is_active: boolean;
  price: number;
  stock_status: string;
};

export type CatalogPublicationStatus = {
  code: PublicationStatusCode;
  label: string;
  description: string;
  tone: "success" | "warning" | "muted";
};

const publicationStatusCopy: Record<
  PublicationStatusCode,
  Omit<CatalogPublicationStatus, "code">
> = {
  ready: {
    label: "Pronto para vitrine",
    description: "Produto com relacionamento válido e pelo menos uma variante comprável.",
    tone: "success",
  },
  missing_variant: {
    label: "Falta variante válida",
    description: "Ative uma variante com preço válido e estoque disponível ou sob consulta.",
    tone: "warning",
  },
  inactive_category: {
    label: "Categoria inativa",
    description: "A categoria vinculada está inativa e impede a publicação na vitrine.",
    tone: "warning",
  },
  inactive_brand: {
    label: "Marca inativa",
    description: "A marca vinculada está inativa e impede a publicação na vitrine.",
    tone: "warning",
  },
  inactive_product: {
    label: "Produto inativo",
    description: "O produto existe no catálogo interno, mas está desativado para a vitrine.",
    tone: "muted",
  },
};

export function isActiveRelationValid(relation: ActiveRelation, relationId: string | null) {
  return relationId === null || relation?.is_active === true;
}

export function isPublicVariant(variant: VariantLike) {
  return (
    variant.is_active &&
    variant.price >= 0 &&
    ["available", "consult"].includes(variant.stock_status)
  );
}

export function getCatalogPublicationStatus(input: {
  isActive: boolean;
  category: ActiveRelation;
  categoryId: string | null;
  brand: ActiveRelation;
  brandId: string | null;
  variants: VariantLike[];
}): CatalogPublicationStatus {
  let code: PublicationStatusCode = "ready";

  if (!input.isActive) {
    code = "inactive_product";
  } else if (!isActiveRelationValid(input.category, input.categoryId)) {
    code = "inactive_category";
  } else if (!isActiveRelationValid(input.brand, input.brandId)) {
    code = "inactive_brand";
  } else if (!input.variants.some(isPublicVariant)) {
    code = "missing_variant";
  }

  return {
    code,
    ...publicationStatusCopy[code],
  };
}
