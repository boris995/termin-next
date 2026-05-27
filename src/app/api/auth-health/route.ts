import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const requiredEnv = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "TERMIN_POSTGRES_URL_NON_POOLING"
  ];
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);

  return NextResponse.json(
    {
      ok: missingEnv.length === 0,
      missingEnv,
      siteUrl: process.env.NEXTAUTH_URL ?? null
    },
    { status: missingEnv.length === 0 ? 200 : 500 }
  );
}
