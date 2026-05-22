import { NextResponse } from "next/server";
import { getTeams } from "@/services/teams.service";
import { teamSchema } from "@/lib/validations/team";

export async function GET(): Promise<NextResponse> {
  const teams = await getTeams();
  return NextResponse.json({ data: teams }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = teamSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Podaci za tim nisu ispravni" }, { status: 400 });
  }

  return NextResponse.json({ data: parsed.data }, { status: 201 });
}
