import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function isInvalidRefreshTokenError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeAuthError = error as {
    code?: string;
    message?: string;
    status?: number;
  };

  return maybeAuthError.code === "refresh_token_not_found" || (maybeAuthError.status === 400 && maybeAuthError.message?.includes("Invalid Refresh Token") === true);
}

function clearSupabaseAuthCookies(request: NextRequest): NextResponse {
  const authCookies = request.cookies
    .getAll()
    .filter((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"));

  authCookies.forEach((cookie) => request.cookies.delete(cookie.name));

  const response = NextResponse.next({ request });

  authCookies.forEach((cookie) => {
    response.cookies.set(cookie.name, "", {
      maxAge: 0,
      path: "/"
    });
  });

  return response;
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        supabaseResponse = NextResponse.next({
          request
        });

        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      }
    }
  });

  try {
    const { error } = await supabase.auth.getUser();

    if (isInvalidRefreshTokenError(error)) {
      return clearSupabaseAuthCookies(request);
    }
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      return clearSupabaseAuthCookies(request);
    }

    throw error;
  }

  return supabaseResponse;
}
