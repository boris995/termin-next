import { NextResponse } from "next/server";
import { searchQuerySchema } from "@/lib/validations/search";
import { getSearchSuggestions } from "@/services/search.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedQuery = searchQuerySchema.safeParse(searchParams.get("q") ?? "");

  if (!parsedQuery.success) {
    return NextResponse.json({ suggestions: [] });
  }

  const suggestions = await getSearchSuggestions(parsedQuery.data);

  return NextResponse.json({ suggestions });
}
