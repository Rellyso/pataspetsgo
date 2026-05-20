"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  type ChangeEventHandler,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Controller,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseFormRegisterReturn,
  useForm,
} from "react-hook-form";
import { QuantitySelector } from "@/components/catalog/quantity-selector";
import { EmptyState } from "@/components/shared/empty-state";
import { CheckIcon } from "@/components/shared/icons";
import { PriceDisplay } from "@/components/shared/price-display";
import type { StoreSummary } from "@/features/catalog/types";
import {
  buildAddressFromViaCep,
  formatPhoneInput,
  formatPostalCodeInput,
  normalizePhoneDigits,
  normalizePostalCode,
  type ViaCepAddress,
} from "@/lib/checkout-utils";
import { formatCurrency } from "@/lib/currency";
import {
  type CheckoutClientFormInput,
  type CheckoutFormInput,
  checkoutClientFormSchema,
  type DeliveryType,
} from "@/lib/validations/checkout";
import { useCart } from "./cart-context";
import { type SubmitOrderResult, submitOrder } from "./submit-order";

type OrderPageClientProps = {
  storeSummary: StoreSummary | null;
};

type SuccessState = Extract<SubmitOrderResult, { ok: true }> & {
  whatsappOpenFailed: boolean;
};

export function OrderPageClient({ storeSummary }: OrderPageClientProps) {
  const { items, estimatedTotal, removeItem, updateQuantity, clearCart } = useCart();
  const [cartError, setCartError] = useState<string | null>(null);
  const [cepError, setCepError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<SuccessState | null>(null);
  const [requestedPostalCode, setRequestedPostalCode] = useState("");
  const [shouldForceAddressFill, setShouldForceAddressFill] = useState(false);
  const lastAutoRequestedPostalCodeRef = useRef<string | null>(null);
  const availableDeliveryTypes = useMemo(
    () => getAvailableDeliveryTypes(storeSummary),
    [storeSummary],
  );

  const form = useForm<CheckoutClientFormInput>({
    resolver: zodResolver(checkoutClientFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      deliveryType: getInitialDeliveryType(storeSummary),
      address: "",
      notes: "",
      postalCode: "",
    },
  });

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = form;

  const deliveryType = watch("deliveryType");
  const postalCode = watch("postalCode");
  const normalizedPostalCode = normalizePostalCode(postalCode);

  const cepLookupQuery = useQuery({
    enabled: requestedPostalCode.length === 8,
    queryFn: async () => {
      const response = await fetch(`https://viacep.com.br/ws/${requestedPostalCode}/json/`);

      if (!response.ok) {
        throw new Error("Não foi possível consultar o CEP agora.");
      }

      const data = (await response.json()) as ViaCepAddress;

      if (data.erro) {
        throw new Error("CEP não encontrado. Revise os números informados.");
      }

      return data;
    },
    queryKey: ["viacep", requestedPostalCode],
  });

  useEffect(() => {
    const nextDeliveryType = getInitialDeliveryType(storeSummary);
    const currentDeliveryType = form.getValues("deliveryType");
    const stillAvailable = availableDeliveryTypes.some(
      (option) => option.value === currentDeliveryType,
    );

    if (!stillAvailable) {
      form.setValue("deliveryType", nextDeliveryType, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [availableDeliveryTypes, form, storeSummary]);

  useEffect(() => {
    if (deliveryType !== "delivery") {
      setCepError(null);
      setRequestedPostalCode("");
      setShouldForceAddressFill(false);
      lastAutoRequestedPostalCodeRef.current = null;
    }
  }, [deliveryType]);

  useEffect(() => {
    if (deliveryType !== "delivery" || normalizedPostalCode.length !== 8) {
      return;
    }

    const addressValue = form.getValues("address").trim();
    const alreadyAutoRequested = lastAutoRequestedPostalCodeRef.current === normalizedPostalCode;

    if (addressValue.length > 0 || alreadyAutoRequested) {
      return;
    }

    lastAutoRequestedPostalCodeRef.current = normalizedPostalCode;
    setCepError(null);
    setShouldForceAddressFill(false);
    setRequestedPostalCode(normalizedPostalCode);
  }, [deliveryType, form, normalizedPostalCode]);

  useEffect(() => {
    if (!cepLookupQuery.data) {
      return;
    }

    const nextAddress = buildAddressFromViaCep(cepLookupQuery.data);
    const currentAddress = form.getValues("address").trim();

    if (currentAddress.length > 0 && !shouldForceAddressFill) {
      return;
    }

    setValue("address", nextAddress, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCepError(null);
    setShouldForceAddressFill(false);
  }, [cepLookupQuery.data, form, setValue, shouldForceAddressFill]);

  useEffect(() => {
    if (!cepLookupQuery.error) {
      return;
    }

    setCepError(
      cepLookupQuery.error instanceof Error
        ? cepLookupQuery.error.message
        : "Não foi possível consultar o CEP agora.",
    );
    setShouldForceAddressFill(false);
  }, [cepLookupQuery.error]);

  if (successState) {
    return (
      <section className="rounded-3xl border border-default bg-surface p-5 shadow-soft sm:p-6">
        <p className="text-sm font-semibold text-success">Pedido salvo com sucesso</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
          Seu pedido {successState.orderNumber} já está com a loja
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          O atendimento continua no WhatsApp. Se a conversa não abriu automaticamente, use o atalho
          abaixo.
        </p>

        <div className="mt-5 rounded-[1.25rem] border border-default bg-background p-4">
          <p className="text-sm font-semibold text-foreground">Número do pedido</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">
            {successState.orderNumber}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Preço e disponibilidade seguem como confirmação final da loja pelo WhatsApp.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-success px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-success/90"
            href={successState.whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            Abrir WhatsApp novamente
          </a>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-default bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary-light"
            href="/catalogo"
          >
            Voltar ao catálogo
          </Link>
        </div>

        {successState.whatsappOpenFailed ? (
          <p className="mt-3 text-sm text-muted">
            O navegador bloqueou a abertura automática do WhatsApp. O pedido foi salvo e o link
            acima continua disponível.
          </p>
        ) : null}
      </section>
    );
  }

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

  const onSubmit = handleSubmit(async (values) => {
    setCartError(null);
    setSubmitError(null);

    const result = await submitOrder({
      address: values.address,
      estimatedTotal,
      items,
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      deliveryType: values.deliveryType,
      notes: values.notes,
    });

    if (!result.ok) {
      setSubmitError(result.message);
      setCartError(result.fieldErrors?.items ?? null);

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (!message) {
          continue;
        }

        if (field === "items") {
          continue;
        }

        setError(field as keyof CheckoutFormInput, {
          message,
          type: "server",
        });
      }

      return;
    }

    const popup = window.open(result.whatsappHref, "_blank", "noopener,noreferrer");
    const whatsappOpenFailed = popup === null;

    clearCart();
    reset();
    setCepError(null);
    setRequestedPostalCode("");
    setShouldForceAddressFill(false);
    setSuccessState({
      ...result,
      whatsappOpenFailed,
    });
  });

  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      <section className="rounded-3xl border border-default bg-surface p-5 shadow-soft sm:p-6">
        <p className="text-sm font-semibold text-primary">Fechamento do pedido</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground">
          Revise, preencha os dados e siga para a loja
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          O total continua estimado, e a confirmação final acontece no atendimento pelo WhatsApp.
        </p>

        {storeSummary?.openingHours || storeSummary?.address || storeSummary?.googleMapsUrl ? (
          <div className="mt-5 rounded-[1.25rem] border border-default bg-background p-4">
            <p className="text-sm font-semibold text-foreground">Contexto da loja</p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {storeSummary.openingHours ? <p>Horário: {storeSummary.openingHours}</p> : null}
              {storeSummary.address ? <p>Retirada: {storeSummary.address}</p> : null}
              {storeSummary.googleMapsUrl ? (
                <a
                  className="font-semibold text-primary transition-colors hover:text-primary-dark"
                  href={storeSummary.googleMapsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Abrir localização no mapa
                </a>
              ) : null}
            </div>
          </div>
        ) : null}

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
          <article className="rounded-3xl border border-default bg-surface p-5 shadow-soft sm:p-6">
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

            {cartError ? <p className="mt-4 text-sm text-error">{cartError}</p> : null}
          </article>

          <article className="rounded-3xl border border-default bg-surface p-5 shadow-soft sm:p-6">
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
                error={errors.customerName?.message}
                label="Nome"
                registration={register("customerName")}
              />
              <Controller
                control={control}
                name="customerPhone"
                render={({ field }) => (
                  <Field
                    error={errors.customerPhone?.message}
                    label="Telefone"
                    onChange={(event) => field.onChange(normalizePhoneDigits(event.target.value))}
                    registration={{
                      ...field,
                      value: formatPhoneInput(field.value ?? ""),
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="deliveryType"
                render={({ field }) => (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Como deseja receber?</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {availableDeliveryTypes.map((option) => (
                        <button
                          key={option.value}
                          className={[
                            "rounded-[1.2rem] border px-4 py-4 text-left transition-colors duration-200",
                            field.value === option.value
                              ? "border-primary bg-primary-light/35"
                              : "border-default bg-background hover:border-primary-light",
                          ].join(" ")}
                          onClick={() => field.onChange(option.value)}
                          type="button"
                        >
                          <p className="font-semibold text-foreground">{option.label}</p>
                          <p className="mt-1 text-sm text-muted">{option.description}</p>
                        </button>
                      ))}
                    </div>
                    {errors.deliveryType ? (
                      <p className="text-sm text-error">{errors.deliveryType.message}</p>
                    ) : null}
                  </div>
                )}
              />

              {deliveryType === "delivery" ? (
                <>
                  <Field
                    action={
                      <button
                        className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark disabled:cursor-not-allowed disabled:text-muted"
                        disabled={normalizedPostalCode.length !== 8 || cepLookupQuery.isFetching}
                        onClick={() => {
                          if (normalizedPostalCode.length !== 8) {
                            setCepError("Informe um CEP válido com 8 números.");
                            return;
                          }

                          setCepError(null);
                          setShouldForceAddressFill(true);
                          if (requestedPostalCode === normalizedPostalCode) {
                            void cepLookupQuery.refetch();
                            return;
                          }

                          setRequestedPostalCode(normalizedPostalCode);
                        }}
                        type="button"
                      >
                        {cepLookupQuery.isFetching ? "Buscando..." : "Buscar CEP"}
                      </button>
                    }
                    error={cepError ?? undefined}
                    hint="Preenche a base do endereço. Depois, complete com número e complemento."
                    label="CEP"
                    onChange={(event) => {
                      setCepError(null);
                      lastAutoRequestedPostalCodeRef.current = null;
                      setValue("postalCode", normalizePostalCode(event.target.value), {
                        shouldDirty: true,
                      });
                    }}
                    registration={register("postalCode")}
                    value={formatPostalCodeInput(postalCode)}
                  />
                  <Field
                    error={errors.address?.message}
                    hint="Inclua número e complemento para ajudar a loja na entrega."
                    label="Endereço"
                    registration={register("address")}
                  />
                </>
              ) : null}

              <Field
                error={errors.notes?.message}
                label="Observações"
                multiline
                optional
                registration={register("notes")}
              />
            </div>
          </article>
        </section>

        <aside className="space-y-4">
          <article className="rounded-3xl border border-default bg-surface p-5 shadow-soft sm:p-6">
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
                Pedido salvo antes da abertura do WhatsApp
              </p>
            </div>
          </article>

          {submitError ? (
            <article className="rounded-3xl border border-error/20 bg-error/8 p-5 shadow-soft">
              <p className="text-sm font-semibold text-foreground">{submitError}</p>
            </article>
          ) : null}
        </aside>
      </div>

      <div className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] z-40 mx-auto max-w-xl xl:static xl:mx-0 xl:max-w-none">
        <div className="rounded-3xl border border-default bg-surface p-4 shadow-[0_26px_55px_-32px_rgba(23,32,51,0.55)] xl:border-none xl:bg-transparent xl:p-0 xl:shadow-none">
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
              <p>{getDeliveryTypeTag(deliveryType)}</p>
            </div>
          </div>

          <button
            className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-success px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Salvando pedido..." : "Enviar pedido pelo WhatsApp"}
          </button>
          <p className="mt-2 text-xs text-muted">
            O pedido é salvo primeiro. Depois disso, a conversa continua no WhatsApp da loja.
          </p>
        </div>
      </div>
    </form>
  );
}

type FieldProps = {
  action?: ReactNode;
  label: string;
  registration: UseFormRegisterReturn | ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
  error?: string;
  hint?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  optional?: boolean;
  multiline?: boolean;
  value?: string;
};

function Field({
  action,
  label,
  registration,
  error,
  hint,
  onChange,
  optional = false,
  multiline = false,
  value,
}: FieldProps) {
  const id = useId();
  const className = [
    "w-full rounded-[1.1rem] border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200",
    error ? "border-error focus:border-error" : "border-default focus:border-primary",
  ].join(" ");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="block" htmlFor={id}>
          <span className="text-sm font-semibold text-foreground">
            {label}
            {optional ? <span className="ml-1 font-normal text-muted">(opcional)</span> : null}
          </span>
        </label>
        {action}
      </div>
      {multiline ? (
        <textarea id={id} className={`${className} min-h-28 resize-y`} {...registration} />
      ) : (
        <input
          id={id}
          className={className}
          type="text"
          value={value}
          {...registration}
          onChange={onChange ?? registration.onChange}
        />
      )}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      {error ? <span className="text-sm text-error">{error}</span> : null}
    </div>
  );
}

function getAvailableDeliveryTypes(storeSummary: StoreSummary | null) {
  const options: Array<{
    value: DeliveryType;
    label: string;
    description: string;
  }> = [];

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

function getDeliveryTypeTag(deliveryType: DeliveryType) {
  switch (deliveryType) {
    case "delivery":
      return "Entrega";
    case "pickup":
      return "Retirada";
    default:
      return "Combinar";
  }
}
