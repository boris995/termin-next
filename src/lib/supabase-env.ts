export function getBrowserSupabaseConfig(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_TERMIN_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_TERMIN_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Javne Supabase varijable nisu podesene.");
  }

  return { url, key };
}

export function getServerSupabaseConfig(): { url: string; key: string } {
  const url = process.env.TERMIN_SUPABASE_URL ?? process.env.NEXT_PUBLIC_TERMIN_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.TERMIN_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_TERMIN_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Serverske Supabase varijable nisu podesene.");
  }

  return { url, key };
}
