"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);

    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();

    router.replace("/auth/login");
    router.refresh();
  }

  return (
    <button className={className} disabled={isPending} onClick={handleLogout} type="button">
      {isPending ? "Saindo..." : "Sair"}
    </button>
  );
}
