import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { ServiceError, toErrorMessage } from "@/lib/errors";
import { matchSchema } from "@/lib/validations/match";
import { createMatch, getMatches } from "@/services/matches.service";

export async function GET(): Promise<NextResponse> {
  const matches = await getMatches();
  return NextResponse.json({ data: matches }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireAdminApi();
    const parsed = matchSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Podaci za utakmicu nisu ispravni" }, { status: 400 });
    }

    const match = await createMatch(parsed.data);
    return NextResponse.json({ data: match }, { status: 201 });
  } catch (error) {
    const status = error instanceof ServiceError ? error.statusCode : 500;
    return NextResponse.json({ error: toErrorMessage(error) }, { status });
  }
}
