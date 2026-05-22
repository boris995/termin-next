import { NextResponse } from "next/server";
import { matchSchema } from "@/lib/validations/match";
import { getMatches } from "@/services/matches.service";

export async function GET(): Promise<NextResponse> {
  const matches = await getMatches();
  return NextResponse.json({ data: matches }, { status: 200 });
}

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = matchSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Podaci za utakmicu nisu ispravni" }, { status: 400 });
  }

  return NextResponse.json({ data: parsed.data }, { status: 201 });
}
