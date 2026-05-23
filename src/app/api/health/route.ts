import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
  const requiredEnv = [
    "TERMIN_POSTGRES_URL_NON_POOLING",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  ];
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);

  if (missingEnv.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Nedostaju env varijable",
        missingEnv
      },
      { status: 500 }
    );
  }

  try {
    const [teams, players, users] = await Promise.all([
      prisma.team.count(),
      prisma.player.count(),
      prisma.user.count()
    ]);

    return NextResponse.json({
      ok: true,
      database: "connected",
      counts: {
        teams,
        players,
        users
      }
    });
  } catch (error) {
    console.error("Health check database greska", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Baza nije dostupna ili migracije nisu primijenjene"
      },
      { status: 500 }
    );
  }
}
