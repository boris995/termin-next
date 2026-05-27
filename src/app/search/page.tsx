import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import { searchQuerySchema, searchTypeSchema } from "@/lib/validations/search";
import { searchSite } from "@/services/search.service";
import type { MatchWithTeams, PlayerWithTeam, Team } from "@/types";

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
    type?: string;
  }>;
};

export const dynamic = "force-dynamic";

const searchFilters = [
  { label: "Sve", type: "all" },
  { label: "Igraci", type: "players" },
  { label: "Timovi", type: "teams" },
  { label: "Utakmice", type: "matches" }
] as const;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const parsedQuery = searchQuerySchema.safeParse(params?.q ?? "");
  const query = parsedQuery.success ? parsedQuery.data : "";
  const selectedType = searchTypeSchema.parse(params?.type ?? "all");
  const results = query ? await searchSite(query) : null;
  const totalResults = results ? results.players.length + results.teams.length + results.matches.length : 0;
  const showPlayers = selectedType === "all" || selectedType === "players";
  const showTeams = selectedType === "all" || selectedType === "teams";
  const showMatches = selectedType === "all" || selectedType === "matches";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Pretraga</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Pretrazi igrace, timove i utakmice.</p>
      </div>

      <Card>
        <form className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Pojam</label>
            <input
              className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-grass-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              defaultValue={params?.q ?? ""}
              name="q"
              placeholder="Ime igraca, tim ili teren"
              type="search"
            />
            <input name="type" type="hidden" value={selectedType} />
            {params?.q && !parsedQuery.success ? (
              <p className="mt-2 text-sm text-red-600 dark:text-red-300">{parsedQuery.error.issues[0]?.message}</p>
            ) : null}
          </div>
          <button className="h-10 rounded-2xl bg-grass-600 px-4 text-sm font-semibold text-white transition hover:bg-grass-700" type="submit">
            Pretrazi
          </button>
        </form>
      </Card>

      {query ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Pronadjeno rezultata: <span className="font-bold text-slate-950 dark:text-white">{totalResults}</span>
            </p>
            <div className="flex gap-2 overflow-x-auto">
              {searchFilters.map((filter) => (
                <Link
                  key={filter.type}
                  className={cn(
                    "shrink-0 rounded-2xl border px-3 py-2 text-sm font-semibold transition",
                    selectedType === filter.type
                      ? "border-grass-600 bg-grass-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  )}
                  href={`/search?q=${encodeURIComponent(query)}&type=${filter.type}`}
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          </div>

          <section className="grid gap-4 lg:grid-cols-3">
            {showPlayers ? <PlayersResults players={results?.players ?? []} /> : null}
            {showTeams ? <TeamsResults teams={results?.teams ?? []} /> : null}
            {showMatches ? <MatchesResults matches={results?.matches ?? []} /> : null}
          </section>
        </div>
      ) : (
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300">Unesite najmanje 2 karaktera za pretragu.</p>
        </Card>
      )}
    </div>
  );
}

function PlayersResults({ players }: { players: PlayerWithTeam[] }) {
  return (
    <Card>
      <h2 className="text-xl font-black text-slate-950 dark:text-white">Igraci</h2>
      <div className="mt-4 space-y-3">
        {players.length > 0 ? players.map((player) => (
          <Link key={player.id} className="block rounded-2xl border border-slate-200 p-3 transition hover:border-grass-400 dark:border-slate-800" href={`/players/${player.id}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{player.name}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{player.team.name} - {player.position}</p>
              </div>
              <Badge tone="green">{player.goals} golova</Badge>
            </div>
          </Link>
        )) : <p className="text-sm text-slate-600 dark:text-slate-300">Nema igraca.</p>}
      </div>
    </Card>
  );
}

function TeamsResults({ teams }: { teams: Team[] }) {
  return (
    <Card>
      <h2 className="text-xl font-black text-slate-950 dark:text-white">Timovi</h2>
      <div className="mt-4 space-y-3">
        {teams.length > 0 ? teams.map((team) => (
          <Link key={team.id} className="block rounded-2xl border border-slate-200 p-3 transition hover:border-grass-400 dark:border-slate-800" href={`/teams/${team.id}`}>
            <p className="font-semibold text-slate-950 dark:text-white">{team.name}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{team.city} - {team.shortName}</p>
          </Link>
        )) : <p className="text-sm text-slate-600 dark:text-slate-300">Nema timova.</p>}
      </div>
    </Card>
  );
}

function MatchesResults({ matches }: { matches: MatchWithTeams[] }) {
  return (
    <Card>
      <h2 className="text-xl font-black text-slate-950 dark:text-white">Utakmice</h2>
      <div className="mt-4 space-y-3">
        {matches.length > 0 ? matches.map((match) => (
          <Link key={match.id} className="block rounded-2xl border border-slate-200 p-3 transition hover:border-grass-400 dark:border-slate-800" href={`/matches/${match.id}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{match.homeTeam.name} - {match.awayTeam.name}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDateTime(match.playedAt)} - {match.venue}</p>
              </div>
              <span className="shrink-0 rounded-2xl bg-slate-100 px-3 py-1 text-sm font-black text-slate-950 dark:bg-slate-900 dark:text-white">
                {match.status === "FINISHED" ? `${match.homeScore}:${match.awayScore}` : "vs"}
              </span>
            </div>
          </Link>
        )) : <p className="text-sm text-slate-600 dark:text-slate-300">Nema utakmica.</p>}
      </div>
    </Card>
  );
}
