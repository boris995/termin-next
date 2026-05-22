import { NextResponse } from "next/server";
import { playerSchema } from "@/lib/validations/player";
import { getPlayers } from "@/services/players.service";

export async function GET(): Promise<NextResponse> {
  const players = await getPlayers();
  return NextResponse.json({ data: players }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = playerSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Podaci za igraca nisu ispravni" }, { status: 400 });
  }

  return NextResponse.json({ data: parsed.data }, { status: 201 });
}
