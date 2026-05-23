import { NextResponse } from "next/server";
import { ensureAppUser } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${redirectTo}/auth/login?error=Auth kod nije pronadjen`);
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    return NextResponse.redirect(`${redirectTo}/auth/login?error=Potvrda naloga nije uspjela`);
  }

  await ensureAppUser({
    id: data.user.id,
    email: data.user.email,
    name: data.user.user_metadata.name ?? data.user.email.split("@")[0]
  });

  return NextResponse.redirect(`${redirectTo}/admin`);
}
