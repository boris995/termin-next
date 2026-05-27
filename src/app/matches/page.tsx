import Link from "next/link";
import { MatchCard } from "@/components/matches/MatchCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getMatches } from "@/services/matches.service";
import { getSeasons } from "@/services/seasons.service";
import type { MatchStatus } from "@/types";

export const dynamic = "force-dynamic";

type MatchesPageProps = {
  searchParams?: Promise<{
    seasonId?: string;
    status?: string;
  }>;
};

const matchStatusFilters = [
  { label: "Sve utakmice", value: "" },
  { label: "Zakazane", value: "SCHEDULED" },
  { label: "Uzivo", value: "LIVE" },
  { label: "Zavrsene", value: "FINISHED" }
] as const;

function parseMatchStatus(value?: string): MatchStatus | undefined {
  if (value === "SCHEDULED" || value === "LIVE" || value === "FINISHED") {
    return value;
  }

  return undefined;
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const params = await searchParams;
  const seasons = await getSeasons();
  const selectedSeasonId = params?.seasonId || seasons.find((season) => season.isActive)?.id || seasons[0]?.id;
  const selectedStatus = parseMatchStatus(params?.status);
  const [matches, seasonMatches] = selectedSeasonId
    ? await Promise.all([getMatches(selectedStatus, selectedSeasonId), getMatches(undefined, selectedSeasonId)])
    : [[], []];
  const statusCounts = {
    all: seasonMatches.length,
    SCHEDULED: seasonMatches.filter((match) => match.status === "SCHEDULED").length,
    LIVE: seasonMatches.filter((match) => match.status === "LIVE").length,
    FINISHED: seasonMatches.filter((match) => match.status === "FINISHED").length
  };
  const selectedStatusLabel = matchStatusFilters.find((filter) => filter.value === (selectedStatus ?? ""))?.label ?? "Sve utakmice";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Utakmice</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Pregled odigranih i zakazanih utakmica.</p>
      </div>

      <Card>
        <form className="grid gap-3 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Sezona</label>
            <select
              className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-grass-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              defaultValue={selectedSeasonId}
              name="seasonId"
            >
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}{season.isActive ? " - aktivna" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Status</label>
            <select
              className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-grass-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              defaultValue={selectedStatus ?? ""}
              name="status"
            >
              {matchStatusFilters.map((filter) => (
                <option key={filter.value || "all"} value={filter.value}>
                  {filter.label} ({filter.value ? statusCounts[filter.value] : statusCounts.all})
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="secondary">Prikazi sezonu</Button>
        </form>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {matches.length > 0 ? matches.map((match) => <MatchCard key={match.id} match={match} />) : (
          <Card className="lg:col-span-2">
            <div className="space-y-3">
              <p className="text-base font-bold text-slate-950 dark:text-white">Nema utakmica za izabrane filtere.</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Trenutno nema rezultata za status: <span className="font-semibold">{selectedStatusLabel}</span>.
              </p>
              {selectedSeasonId ? (
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                  href={`/matches?seasonId=${encodeURIComponent(selectedSeasonId)}`}
                >
                  Prikazi sve utakmice u sezoni
                </Link>
              ) : null}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
