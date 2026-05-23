"use server";

import { cookies } from "next/headers";
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

export async function loginAction(formData: FormData): Promise<void> {
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
}

export async function registerAction(formData: FormData): Promise<void> {
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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      },
      emailRedirectTo: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/auth/callback`
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
}

export async function logoutAction(): Promise<void> {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect("/auth/login");
}
