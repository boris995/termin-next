import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayerCard } from "@/components/players/PlayerCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import { getSeasons } from "@/services/seasons.service";
import { getTeamProfile } from "@/services/teams.service";
import type { TeamProfileMatch } from "@/services/teams.service";

type TeamDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    seasonId?: string;
  }>;
};

export const dynamic = "force-dynamic";

function getStatusLabel(status: TeamProfileMatch["status"]): string {
  if (status === "LIVE") {
    return "Uzivo";
  }

  if (status === "FINISHED") {
    return "Zavrsena";
  }

  return "Zakazana";
}

function getTeamResult(match: TeamProfileMatch): "P" | "N" | "I" | null {
  if (match.status !== "FINISHED" || match.homeScore === null || match.awayScore === null) {
    return null;
  }

  const teamScore = match.isHome ? match.homeScore : match.awayScore;
  const opponentScore = match.isHome ? match.awayScore : match.homeScore;

  if (teamScore > opponentScore) {
    return "P";
  }

  if (teamScore < opponentScore) {
    return "I";
  }

  return "N";
}

export default async function TeamDetailsPage({ params, searchParams }: TeamDetailsPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const seasons = await getSeasons();
  const selectedSeasonId = query?.seasonId || seasons.find((season) => season.isActive)?.id || seasons[0]?.id;
  const selectedSeason = seasons.find((season) => season.id === selectedSeasonId);
  const team = await getTeamProfile(id, selectedSeasonId);

  if (!team) {
    notFound();
  }

  const teamForm = team.matches
    .filter((match) => match.status === "FINISHED")
    .slice(0, 5)
    .map((match) => ({
      match,
      result: getTeamResult(match)
    }))
    .filter((item): item is { match: TeamProfileMatch; result: "P" | "N" | "I" } => item.result !== null);

  return (
    <div className="space-y-6">
      <div>
        <Link className="text-sm font-semibold text-grass-700 hover:text-grass-900 dark:text-grass-300 dark:hover:text-grass-200" href="/teams">
          Nazad na timove
        </Link>
      </div>

      <Card>
        <form className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
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
          <Button type="submit" variant="secondary">Prikazi sezonu</Button>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              {team.logoUrl ? (
                <div
                  aria-label={`${team.name} logo`}
                  className="h-16 w-16 rounded-2xl border border-slate-200 bg-cover bg-center dark:border-slate-800"
                  role="img"
                  style={{ backgroundImage: `url(${team.logoUrl})` }}
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black text-white" style={{ backgroundColor: team.primaryColor }}>
                  {team.shortName}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-black text-slate-950 dark:text-white">{team.name}</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{team.city} - osnovan {team.foundedYear}.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="blue">{team.shortName}</Badge>
                  {selectedSeason ? <Badge tone="slate">{selectedSeason.name}</Badge> : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-5">
          <TeamStat label="Utakmice" value={(team.standing?.played ?? 0).toString()} />
          <TeamStat label="Pobjede" value={(team.standing?.won ?? 0).toString()} />
          <TeamStat label="Gol razlika" value={(team.standing?.goalDifference ?? 0).toString()} />
          <TeamStat label="Golovi" value={`${team.standing?.goalsFor ?? 0}:${team.standing?.goalsAgainst ?? 0}`} />
          <TeamStat label="Bodovi" value={(team.standing?.points ?? 0).toString()} />
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Igraci</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Igraci i statistika u izabranoj sezoni.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {team.players.length > 0 ? team.players.map((player) => <PlayerCard key={player.id} player={player} />) : (
              <Card>
                <p className="text-sm text-slate-600 dark:text-slate-300">Nema igraca za ovaj tim.</p>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="h-fit">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Forma</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Posljednjih 5 zavrsenih utakmica.</p>
            {teamForm.length > 0 ? (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {teamForm.map(({ match, result }) => (
                    <span
                      key={match.id}
                      className={
                        result === "P"
                          ? "flex h-9 w-9 items-center justify-center rounded-2xl bg-grass-100 text-sm font-black text-grass-800 dark:bg-grass-950 dark:text-grass-200"
                          : result === "N"
                            ? "flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-100 text-sm font-black text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                            : "flex h-9 w-9 items-center justify-center rounded-2xl bg-red-100 text-sm font-black text-red-800 dark:bg-red-950 dark:text-red-200"
                      }
                    >
                      {result}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  {teamForm.map(({ match, result }) => (
                    <Link key={match.id} className="block rounded-2xl border border-slate-200 p-3 transition hover:border-grass-400 dark:border-slate-800" href={`/matches/${match.id}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                            {result} - {match.isHome ? "vs" : "kod"} {match.opponent.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDateTime(match.playedAt)}</p>
                        </div>
                        <p className="shrink-0 text-sm font-black text-slate-950 dark:text-white">{match.homeScore}:{match.awayScore}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Jos nema zavrsenih utakmica za formu.</p>
            )}
          </Card>

          <Card className="h-fit">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Utakmice</h2>
            <div className="mt-4 space-y-3">
              {team.matches.length > 0 ? team.matches.map((match) => (
                <Link key={match.id} className="block rounded-2xl border border-slate-200 p-3 transition hover:border-grass-400 dark:border-slate-800" href={`/matches/${match.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">
                        {match.isHome ? "vs" : "kod"} {match.opponent.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDateTime(match.playedAt)}</p>
                    </div>
                    <div className="text-right">
                      <Badge tone={match.status === "FINISHED" ? "green" : match.status === "LIVE" ? "red" : "blue"}>{getStatusLabel(match.status)}</Badge>
                      <p className="mt-2 text-sm font-black text-slate-950 dark:text-white">
                        {match.status === "FINISHED" ? `${match.homeScore}:${match.awayScore}` : "vs"}
                      </p>
                    </div>
                  </div>
                </Link>
              )) : <p className="text-sm text-slate-600 dark:text-slate-300">Nema utakmica u izabranoj sezoni.</p>}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function TeamStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
