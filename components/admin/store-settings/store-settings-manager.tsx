"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type ChangeEventHandler, useId, useState, useTransition } from "react";
import {
  Controller,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseFormRegisterReturn,
  useForm,
} from "react-hook-form";

import { EmptyState } from "@/components/shared/empty-state";
import { saveStoreSettingsAction } from "@/features/admin/store-settings/mutations";
import type { AdminStoreSettings } from "@/features/admin/store-settings/types";
import { formatPhoneInput, normalizePhoneDigits } from "@/lib/checkout-utils";
import {
  type AdminStoreSettingsInput,
  adminStoreSettingsSchema,
} from "@/lib/validations/admin-store-settings";

type StoreSettingsManagerProps = {
  settings: AdminStoreSettings | null;
};

export function StoreSettingsManager({ settings }: StoreSettingsManagerProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AdminStoreSettingsInput>({
    resolver: zodResolver(adminStoreSettingsSchema) as never,
    defaultValues: settings
      ? {
          id: settings.id,
          storeName: settings.storeName,
          description: settings.description,
          whatsappPhone: settings.whatsappPhone,
          instagramUrl: settings.instagramUrl,
          address: settings.address,
          openingHours: settings.openingHours,
          googleMapsUrl: settings.googleMapsUrl,
          deliveryEnabled: settings.deliveryEnabled,
          pickupEnabled: settings.pickupEnabled,
        }
      : {
          storeName: "",
          description: null,
          whatsappPhone: "",
          instagramUrl: null,
          address: null,
          openingHours: null,
          googleMapsUrl: null,
          deliveryEnabled: false,
          pickupEnabled: false,
        },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
  } = form;

  if (!settings) {
    return (
      <EmptyState
        title="Configuração da loja indisponível"
        description="O singleton `store_settings` não foi encontrado. Corrija o seed ou restaure a linha única no banco antes de tentar editar esta área."
      />
    );
  }

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const formData = new FormData();

      formData.set("id", values.id ?? settings.id);
      formData.set("storeName", values.storeName);
      formData.set("description", values.description ?? "");
      formData.set("whatsappPhone", values.whatsappPhone);
      formData.set("instagramUrl", values.instagramUrl ?? "");
      formData.set("address", values.address ?? "");
      formData.set("openingHours", values.openingHours ?? "");
      formData.set("googleMapsUrl", values.googleMapsUrl ?? "");

      if (values.deliveryEnabled) {
        formData.set("deliveryEnabled", "on");
      }

      if (values.pickupEnabled) {
        formData.set("pickupEnabled", "on");
      }

      const result = await saveStoreSettingsAction(formData);

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              setError(key as keyof AdminStoreSettingsInput, {
                message: messages[0],
              });
            }
          }
        }

        setFeedback(result.message);
        return;
      }

      setFeedback(result.message);
      reset({
        ...values,
        whatsappPhone: normalizePhoneDigits(values.whatsappPhone),
      });
      router.refresh();
    });
  });

  return (
    <form className="space-y-6" noValidate onSubmit={onSubmit}>
      <section className="rounded-card border border-default bg-surface p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Dados institucionais e operacionais
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Este singleton alimenta a home, o rodapé público, o contexto do pedido e as regras de
              retirada e entrega no checkout.
            </p>
          </div>
          <div className="rounded-card border border-default bg-background p-4 text-sm text-muted">
            <p className="font-semibold text-foreground">Última atualização registrada</p>
            <p className="mt-1">{new Date(settings.updatedAt).toLocaleString("pt-BR")}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <Field
            error={errors.storeName?.message}
            label="Nome da loja"
            registration={register("storeName")}
          />
          <Controller
            control={control}
            name="whatsappPhone"
            render={({ field }) => (
              <Field
                error={errors.whatsappPhone?.message}
                hint="Use o número principal que recebe os pedidos no WhatsApp."
                label="WhatsApp principal"
                onChange={(event) => field.onChange(normalizePhoneDigits(event.target.value))}
                registration={{
                  ...field,
                  value: formatPhoneInput(field.value ?? ""),
                }}
              />
            )}
          />
          <Field
            error={errors.description?.message}
            hint="Resumo curto exibido nas superfícies públicas quando útil."
            label="Descrição"
            multiline
            optional
            registration={register("description")}
          />
          <Field
            error={errors.openingHours?.message}
            hint="Exemplo: Seg a Sex, 8h às 18h • Sáb, 8h às 13h."
            label="Horário de funcionamento"
            optional
            registration={register("openingHours")}
          />
          <Field
            error={errors.address?.message}
            hint="Endereço usado no contexto institucional e para retirada."
            label="Endereço"
            optional
            registration={register("address")}
          />
          <Field
            error={errors.instagramUrl?.message}
            hint="URL completa do Instagram da loja."
            label="Instagram"
            optional
            registration={register("instagramUrl")}
            placeholder="https://instagram.com/pataspets"
          />
          <Field
            error={errors.googleMapsUrl?.message}
            hint="Link direto do mapa para facilitar a retirada."
            label="Link do Google Maps"
            optional
            registration={register("googleMapsUrl")}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </section>

      <section className="rounded-card border border-default bg-surface p-5 shadow-soft">
        <h2 className="font-display text-2xl font-semibold text-foreground">Regras do checkout</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Estas flags alteram imediatamente as opções disponíveis em{" "}
          <span className="font-medium text-foreground">/pedido</span>.
        </p>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <CheckboxField
            description="Mostra a opção de retirada sem exigir endereço."
            error={errors.pickupEnabled?.message}
            label="Retirada habilitada"
            registration={register("pickupEnabled")}
          />
          <CheckboxField
            description="Mostra a opção de entrega e exige endereço no checkout."
            error={errors.deliveryEnabled?.message}
            label="Entrega habilitada"
            registration={register("deliveryEnabled")}
          />
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-6">
          {feedback ? (
            <p
              className={[
                "text-sm",
                feedback.includes("sucesso") ? "text-success" : "text-error",
              ].join(" ")}
            >
              {feedback}
            </p>
          ) : null}
        </div>
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending || !isDirty}
          type="submit"
        >
          {isPending ? "Salvando..." : "Salvar configurações"}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  error?: string;
  hint?: string;
  label: string;
  multiline?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  optional?: boolean;
  placeholder?: string;
  registration: UseFormRegisterReturn | ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
};

function Field({
  error,
  hint,
  label,
  multiline = false,
  onChange,
  optional = false,
  placeholder,
  registration,
}: FieldProps) {
  const id = useId();
  const className = [
    "w-full rounded-[1.1rem] border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200",
    error ? "border-error focus:border-error" : "border-default focus:border-primary",
  ].join(" ");

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground" htmlFor={id}>
        {label}
        {optional ? <span className="ml-1 font-normal text-muted">(opcional)</span> : null}
      </label>
      {multiline ? (
        <textarea
          className={`${className} min-h-28 resize-y`}
          id={id}
          placeholder={placeholder}
          {...registration}
        />
      ) : (
        <input
          className={className}
          id={id}
          {...registration}
          onChange={onChange ?? registration.onChange}
          placeholder={placeholder}
          type="text"
        />
      )}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      {error ? <span className="text-sm text-error">{error}</span> : null}
    </div>
  );
}

type CheckboxFieldProps = {
  description: string;
  error?: string;
  label: string;
  registration: UseFormRegisterReturn;
};

function CheckboxField({ description, error, label, registration }: CheckboxFieldProps) {
  const id = useId();

  return (
    <label className="rounded-card border border-default bg-background p-4" htmlFor={id}>
      <span className="flex items-start gap-3">
        <input
          className="mt-1 size-4 rounded border-default text-primary focus:ring-primary"
          id={id}
          type="checkbox"
          {...registration}
        />
        <span className="space-y-1">
          <span className="block text-sm font-semibold text-foreground">{label}</span>
          <span className="block text-sm leading-6 text-muted">{description}</span>
          {error ? <span className="block text-sm text-error">{error}</span> : null}
        </span>
      </span>
    </label>
  );
}
