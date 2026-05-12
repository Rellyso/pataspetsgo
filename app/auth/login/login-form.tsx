"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
    <form className="flex flex-col gap-4" noValidate onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="rounded-card border border-default bg-surface px-4 py-3 text-base outline-none transition focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          id="email"
          placeholder="admin@pataspets.com.br"
          type="email"
          {...register("email")}
        />
        {errors.email ? <p className="text-sm text-error">{errors.email.message}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="password">
          Senha
        </label>
        <input
          autoComplete="current-password"
          className="rounded-card border border-default bg-surface px-4 py-3 text-base outline-none transition focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          id="password"
          placeholder="Sua senha"
          type="password"
          {...register("password")}
        />
        {errors.password ? <p className="text-sm text-error">{errors.password.message}</p> : null}
      </div>

      {authError ? <p className="text-sm text-error">{authError}</p> : null}

      <button
        className="min-h-11 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
