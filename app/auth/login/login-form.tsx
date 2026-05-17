"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { CheckIcon, EyeIcon, EyeOffIcon } from "@/components/shared/icons";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { type AdminLoginInput, adminLoginSchema } from "@/lib/validations/admin-auth";

type LoginFormProps = {
  nextPath: string;
};

function getLoginErrorMessage(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Email ou senha inválidos.";
  }

  return "Não foi possível entrar agora. Tente novamente.";
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const emailErrorId = useId();
  const passwordErrorId = useId();
  const authErrorId = useId();

  const form = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
  } = form;

  function handleKeyboardSubmit(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    formRef.current?.requestSubmit();
  }

  const onSubmit = handleSubmit(async (values) => {
    setAuthError(null);

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setAuthError(getLoginErrorMessage(error.message));
      return;
    }

    router.replace(nextPath);
    router.refresh();
  });

  return (
    <form className="flex flex-col gap-5" noValidate onSubmit={onSubmit} ref={formRef}>
      <div className="grid gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor="email">
            Email
          </label>
          <input
            aria-describedby={errors.email ? emailErrorId : undefined}
            autoComplete="email"
            className="min-h-12 rounded-card border border-default bg-background px-4 py-3 text-base text-foreground outline-none transition-colors duration-200 focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            id="email"
            onKeyDown={handleKeyboardSubmit}
            placeholder="admin@pataspets.com.br"
            type="email"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-error" id={emailErrorId} role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-foreground" htmlFor="password">
              Senha
            </label>
            <p className="text-xs text-muted">Pressione Enter para enviar</p>
          </div>

          <div className="relative">
            <input
              aria-describedby={
                errors.password ? passwordErrorId : authError ? authErrorId : undefined
              }
              autoComplete="current-password"
              className="min-h-12 w-full rounded-card border border-default bg-background px-4 py-3 pr-14 text-base text-foreground outline-none transition-colors duration-200 focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              id="password"
              onKeyDown={handleKeyboardSubmit}
              placeholder="Sua senha"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <button
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-primary-light hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>

          {errors.password ? (
            <p className="text-sm text-error" id={passwordErrorId} role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-card border border-default bg-background px-4 py-4">
        <p className="text-sm font-medium text-foreground">Acesso interno da operação</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted">
          <li className="flex items-start gap-2">
            <CheckIcon className="mt-1 size-4 shrink-0 text-primary" />
            <span>Entre para abrir catálogo, pedidos, banners e configurações da loja.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="mt-1 size-4 shrink-0 text-primary" />
            <span>Se você foi redirecionado, o login volta para a rota protegida pedida.</span>
          </li>
        </ul>
      </div>

      {authError ? (
        <p
          className="rounded-card border border-error/20 bg-error/8 px-4 py-3 text-sm text-error"
          id={authErrorId}
          role="alert"
        >
          {authError}
        </p>
      ) : null}

      <button
        className="min-h-12 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Entrando..." : "Entrar no admin"}
      </button>
    </form>
  );
}
