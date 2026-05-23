import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { ServiceError, toErrorMessage } from "@/lib/errors";
import { playerSchema } from "@/lib/validations/player";
import { createPlayer, getPlayers } from "@/services/players.service";

export async function GET(): Promise<NextResponse> {
  const players = await getPlayers();
  return NextResponse.json({ data: players }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireAdminApi();
    const parsed = playerSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Podaci za igraca nisu ispravni" }, { status: 400 });
    }

    const player = await createPlayer(parsed.data);
    return NextResponse.json({ data: player }, { status: 201 });
  } catch (error) {
    const status = error instanceof ServiceError ? error.statusCode : 500;
    return NextResponse.json({ error: toErrorMessage(error) }, { status });
  }
}
