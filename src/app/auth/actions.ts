"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ensureAppUser } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";

function getStringValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getAuthErrorMessage(message?: string): string {
  if (!message) {
    return "Doslo je do greske. Pokusaj ponovo.";
  }

  if (message.toLowerCase().includes("email rate limit exceeded")) {
    return "Prekoracen je limit za slanje emailova. Sacekaj nekoliko minuta ili privremeno iskljuci email potvrdu u Supabase Auth podesavanjima.";
  }

  return message;
}

async function getSiteUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");

  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export async function loginAction(formData: FormData): Promise<void> {
  try {
    const email = getStringValue(formData, "email");
    const password = getStringValue(formData, "password");
    const supabase = createClient(await cookies());

    if (!email || !password) {
      redirect("/auth/login?error=Unesi email i lozinku");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user?.email) {
      redirect(`/auth/login?error=${encodeURIComponent(getAuthErrorMessage(error?.message ?? "Neispravni podaci za prijavu"))}`);
    }

    await ensureAppUser({
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata.name ?? data.user.email.split("@")[0]
    });

    redirect("/admin");
  } catch (error) {
    if (error instanceof Error && "digest" in error) {
      throw error;
    }

    console.error("Login greska", error);
    redirect("/auth/login?error=Prijava trenutno nije dostupna");
  }
}

export async function registerAction(formData: FormData): Promise<void> {
  try {
    const name = getStringValue(formData, "name");
    const email = getStringValue(formData, "email");
    const password = getStringValue(formData, "password");
    const supabase = createClient(await cookies());

    if (!name || !email || !password) {
      redirect("/auth/register?error=Popuni sva polja");
    }

    if (password.length < 6) {
      redirect("/auth/register?error=Lozinka mora imati najmanje 6 karaktera");
    }

    const siteUrl = await getSiteUrl();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        },
        emailRedirectTo: `${siteUrl}/auth/callback`
      }
    });

    if (error || !data.user?.email) {
      redirect(`/auth/register?error=${encodeURIComponent(getAuthErrorMessage(error?.message ?? "Registracija nije uspjela"))}`);
    }

    await ensureAppUser({
      id: data.user.id,
      email: data.user.email,
      name: name || data.user.email.split("@")[0]
    });

    if (!data.session) {
      redirect("/auth/login?success=Registracija je uspjela. Provjeri email i potvrdi nalog prije prijave.");
    }

    redirect("/admin");
  } catch (error) {
    if (error instanceof Error && "digest" in error) {
      throw error;
    }

    console.error("Registracija greska", error);
    redirect("/auth/register?error=Registracija trenutno nije dostupna. Provjeri produkcijske env varijable.");
  }
}

export async function logoutAction(): Promise<void> {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect("/auth/login");
}
