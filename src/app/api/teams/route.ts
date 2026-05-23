import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { ServiceError, toErrorMessage } from "@/lib/errors";
import { teamSchema } from "@/lib/validations/team";
import { createTeam, getTeams } from "@/services/teams.service";

export async function GET(): Promise<NextResponse> {
  const teams = await getTeams();
  return NextResponse.json({ data: teams }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireAdminApi();
    const parsed = teamSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Podaci za tim nisu ispravni" }, { status: 400 });
    }

    const team = await createTeam(parsed.data);
    return NextResponse.json({ data: team }, { status: 201 });
  } catch (error) {
    const status = error instanceof ServiceError ? error.statusCode : 500;
    return NextResponse.json({ error: toErrorMessage(error) }, { status });
  }
}
