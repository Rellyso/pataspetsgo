"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

import { QuantitySelector } from "@/components/catalog/quantity-selector";
import { EmptyState } from "@/components/shared/empty-state";
import { CheckIcon } from "@/components/shared/icons";
import { PriceDisplay } from "@/components/shared/price-display";
import type { StoreSummary } from "@/features/catalog/types";
import { formatCurrency } from "@/lib/currency";

import { useCart } from "./cart-context";

type OrderPageClientProps = {
  storeSummary: StoreSummary | null;
};

type DeliveryType = "pickup" | "delivery" | "arrange";

export function OrderPageClient({ storeSummary }: OrderPageClientProps) {
  const { items, estimatedTotal, removeItem, updateQuantity, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    getInitialDeliveryType(storeSummary),
  );
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const availableDeliveryTypes = useMemo(
    () => getAvailableDeliveryTypes(storeSummary),
    [storeSummary],
  );

  const errors = getFormErrors({
    address,
    customerName,
    customerPhone,
    deliveryType,
    itemsLength: items.length,
  });

  if (items.length === 0) {
    return (
      <EmptyState
        title="Seu pedido ainda está vazio"
        description="Adicione produtos no catálogo para começar a montar o pedido."
        action={
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
            href="/catalogo"
          >
            Voltar ao catálogo
          </Link>
        }
      />
    );
  }

  const handleFakeSubmit = () => {
    setSubmitAttempted(true);

    if (Object.keys(errors).length > 0) {
      setStatusMessage("Preencha os dados obrigatórios antes de seguir para o WhatsApp.");
      return;
    }

    setStatusMessage(
      "Fluxo visual pronto. A persistência server-only e a abertura real do WhatsApp entram na próxima fase do checkout.",
    );
  };

  return (
    <>
      <section className="rounded-[1.5rem] border border-default bg-surface p-5 shadow-soft sm:p-6">
        <p className="text-sm font-semibold text-primary">Fechamento do pedido</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
          Revise, preencha os dados e siga para a loja
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          O total continua estimado, e a confirmação final acontece no atendimento pelo WhatsApp.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Itens revisados"],
            ["2", "Dados do cliente"],
            ["3", "Envio para WhatsApp"],
          ].map(([step, label]) => (
            <div key={label} className="rounded-[1.25rem] border border-default bg-background p-4">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary-light font-semibold text-primary">
                {step}
              </span>
              <p className="mt-3 font-semibold text-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className="space-y-4">
          <article className="rounded-[1.5rem] border border-default bg-surface p-5 shadow-soft sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Itens do pedido
                </h2>
                <p className="text-sm text-muted">
                  Ajuste a quantidade ou remova o que não entra mais.
                </p>
              </div>
              <button
                className="text-sm font-semibold text-muted transition-colors hover:text-foreground"
                onClick={clearCart}
                type="button"
              >
                Limpar tudo
              </button>
            </div>

            <ul className="mt-5 space-y-4">
              {items.map((item) => (
                <li
                  key={item.productVariantId}
                  className="rounded-[1.25rem] border border-default bg-background p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground">{item.productName}</p>
                      <p className="text-sm text-muted">{item.variantName}</p>
                      <p className="text-xs text-muted">
                        {item.stockStatusSnapshot === "consult"
                          ? "Disponibilidade sujeita à confirmação da loja"
                          : "Pronto para seguir no pedido"}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <PriceDisplay
                        price={item.unitPriceSnapshot}
                        promotionalPrice={item.promotionalPriceSnapshot}
                      />
                      <QuantitySelector
                        onChange={(quantity) => updateQuantity(item.productVariantId, quantity)}
                        value={item.quantity}
                      />
                      <button
                        className="text-sm font-semibold text-muted transition-colors duration-200 hover:text-foreground"
                        onClick={() => removeItem(item.productVariantId)}
                        type="button"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[1.5rem] border border-default bg-surface p-5 shadow-soft sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Dados do pedido
                </h2>
                <p className="text-sm text-muted">Formulário curto, pensado para mobile.</p>
              </div>
              <span className="rounded-full bg-secondary-light px-3 py-1 text-xs font-semibold text-foreground">
                MVP
              </span>
            </div>

            <div className="mt-5 grid gap-4">
              <Field
                error={submitAttempted ? errors.customerName : undefined}
                label="Nome"
                value={customerName}
                onChange={setCustomerName}
              />
              <Field
                error={submitAttempted ? errors.customerPhone : undefined}
                label="Telefone"
                value={customerPhone}
                onChange={setCustomerPhone}
              />

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Como deseja receber?</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {availableDeliveryTypes.map((option) => (
                    <button
                      key={option.value}
                      className={[
                        "rounded-[1.2rem] border px-4 py-4 text-left transition-colors duration-200",
                        deliveryType === option.value
                          ? "border-primary bg-primary-light/35"
                          : "border-default bg-background hover:border-primary-light",
                      ].join(" ")}
                      onClick={() => setDeliveryType(option.value)}
                      type="button"
                    >
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="mt-1 text-sm text-muted">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {deliveryType === "delivery" ? (
                <Field
                  error={submitAttempted ? errors.address : undefined}
                  label="Endereço"
                  value={address}
                  onChange={setAddress}
                />
              ) : null}

              <Field label="Observações" multiline optional value={notes} onChange={setNotes} />
            </div>
          </article>
        </section>

        <aside className="space-y-4">
          <article className="rounded-[1.5rem] border border-default bg-surface p-5 shadow-soft sm:p-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">Resumo estimado</h2>
            <div className="mt-5 rounded-[1.25rem] border border-default bg-background p-4">
              <PriceDisplay price={estimatedTotal} size="large" />
              <p className="mt-3 text-sm leading-6 text-muted">
                Preço e disponibilidade serão confirmados pela loja antes do fechamento final.
              </p>
            </div>

            <div className="mt-4 space-y-2 text-sm text-muted">
              <p className="flex items-center gap-2">
                <CheckIcon className="size-4 text-success" />
                Carrinho local preservado enquanto você revisa
              </p>
              <p className="flex items-center gap-2">
                <CheckIcon className="size-4 text-success" />
                Fluxo preparado para persistência server-only na próxima fase
              </p>
            </div>
          </article>

          {statusMessage ? (
            <article className="rounded-[1.5rem] border border-default bg-surface p-5 shadow-soft">
              <p className="text-sm font-semibold text-foreground">{statusMessage}</p>
            </article>
          ) : null}
        </aside>
      </div>

      <div className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] z-40 mx-auto max-w-xl xl:static xl:mx-0 xl:max-w-none">
        <div className="rounded-[1.5rem] border border-default bg-surface p-4 shadow-[0_26px_55px_-32px_rgba(23,32,51,0.55)] xl:border-none xl:bg-transparent xl:p-0 xl:shadow-none">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Total estimado
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-foreground">
                {formatCurrency(estimatedTotal)}
              </p>
            </div>
            <div className="text-right text-xs text-muted">
              <p>
                {items.length} {items.length > 1 ? "produtos" : "produto"}
              </p>
              <p>
                {deliveryType === "delivery"
                  ? "Entrega"
                  : deliveryType === "pickup"
                    ? "Retirada"
                    : "Combinar"}
              </p>
            </div>
          </div>

          <button
            className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-success px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-success/90"
            onClick={handleFakeSubmit}
            type="button"
          >
            Enviar pedido pelo WhatsApp
          </button>
          <p className="mt-2 text-xs text-muted">
            Nesta fase, o layout e a validação visual estão prontos; o envio real entra na próxima
            etapa.
          </p>
        </div>
      </div>
    </>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
  multiline?: boolean;
};

function Field({ label, value, onChange, error, optional = false, multiline = false }: FieldProps) {
  const id = useId();
  const className = [
    "w-full rounded-[1.1rem] border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200",
    error ? "border-error focus:border-error" : "border-default focus:border-primary",
  ].join(" ");

  return (
    <div className="space-y-2">
      <label className="block" htmlFor={id}>
        <span className="text-sm font-semibold text-foreground">
          {label}
          {optional ? <span className="ml-1 font-normal text-muted">(opcional)</span> : null}
        </span>
      </label>
      {multiline ? (
        <textarea
          id={id}
          className={`${className} min-h-28 resize-y`}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        />
      ) : (
        <input
          id={id}
          className={className}
          onChange={(event) => onChange(event.target.value)}
          type="text"
          value={value}
        />
      )}
      {error ? <span className="text-sm text-error">{error}</span> : null}
    </div>
  );
}

function getAvailableDeliveryTypes(storeSummary: StoreSummary | null) {
  const options: Array<{ value: DeliveryType; label: string; description: string }> = [];

  if (storeSummary?.pickupEnabled ?? true) {
    options.push({
      value: "pickup",
      label: "Retirada",
      description: "Sem endereço. Bom para quem vai passar na loja.",
    });
  }

  if (storeSummary?.deliveryEnabled ?? true) {
    options.push({
      value: "delivery",
      label: "Entrega",
      description: "Exige endereço para o atendimento continuar.",
    });
  }

  options.push({
    value: "arrange",
    label: "Combinar",
    description: "A loja confirma a melhor forma pelo WhatsApp.",
  });

  return options;
}

function getInitialDeliveryType(storeSummary: StoreSummary | null): DeliveryType {
  const options = getAvailableDeliveryTypes(storeSummary);
  return options[0]?.value ?? "arrange";
}

function getFormErrors({
  address,
  customerName,
  customerPhone,
  deliveryType,
  itemsLength,
}: {
  address: string;
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  itemsLength: number;
}) {
  const errors: Record<string, string> = {};

  if (itemsLength < 1) {
    errors.items = "Adicione ao menos um item ao pedido.";
  }

  if (customerName.trim().length < 2) {
    errors.customerName = "Informe o nome do cliente.";
  }

  const phoneDigits = customerPhone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    errors.customerPhone = "Informe um telefone válido.";
  }

  if (deliveryType === "delivery" && address.trim().length < 8) {
    errors.address = "Informe o endereço para entrega.";
  }

  return errors;
}
