import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { requireSupabaseEnv } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

function buildLoginUrl(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/auth/login";

  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (nextPath !== "/admin") {
    loginUrl.searchParams.set("next", nextPath);
  }

  return loginUrl;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          response = NextResponse.next({ request });

          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  let user = null;

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    user = authUser;
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      clearSupabaseCookies(request, response);
      return request.nextUrl.pathname.startsWith("/admin")
        ? NextResponse.redirect(buildLoginUrl(request))
        : response;
    }

    throw error;
  }

  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(buildLoginUrl(request));
  }

  return response;
}

function isInvalidRefreshTokenError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.toLowerCase().includes("invalid refresh token")
  );
}

function clearSupabaseCookies(request: NextRequest, response: NextResponse) {
  for (const cookie of request.cookies.getAll()) {
    if (!cookie.name.startsWith("sb-")) {
      continue;
    }

    request.cookies.delete(cookie.name);
    response.cookies.delete(cookie.name);
  }
}
