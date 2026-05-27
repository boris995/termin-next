import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import { getPlayerProfile } from "@/services/players.service";
import { getSeasons } from "@/services/seasons.service";
import type { PlayerProfileMatch } from "@/services/players.service";

type PlayerDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    seasonId?: string;
  }>;
};

export const dynamic = "force-dynamic";

function getEventLabel(type: PlayerProfileMatch["events"][number]["type"]): string {
  const labels = {
    GOAL: "Gol",
    ASSIST: "Asistencija",
    YELLOW_CARD: "Zuti karton",
    RED_CARD: "Crveni karton",
    SUBSTITUTION: "Izmjena"
  };

  return labels[type];
}

function getStatusLabel(status: PlayerProfileMatch["status"]): string {
  if (status === "LIVE") {
    return "Uzivo";
  }

  if (status === "FINISHED") {
    return "Zavrsena";
  }

  return "Zakazana";
}

export default async function PlayerDetailsPage({ params, searchParams }: PlayerDetailsPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const seasons = await getSeasons();
  const selectedSeasonId = query?.seasonId || seasons.find((season) => season.isActive)?.id || seasons[0]?.id;
  const selectedSeason = seasons.find((season) => season.id === selectedSeasonId);
  const player = await getPlayerProfile(id, selectedSeasonId);

  if (!player) {
    notFound();
  }

  const ratingTrend = player.matches
    .filter((match): match is PlayerProfileMatch & { rating: NonNullable<PlayerProfileMatch["rating"]> } => match.rating !== null)
    .slice(0, 5)
    .reverse();

  return (
    <div className="space-y-6">
      <div>
        <Link className="text-sm font-semibold text-grass-700 hover:text-grass-900 dark:text-grass-300 dark:hover:text-grass-200" href="/players">
          Nazad na igrace
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
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-grass-100 text-2xl font-black text-grass-800 dark:bg-grass-950 dark:text-grass-200">
                {player.shirtNumber}
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-950 dark:text-white">{player.name}</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{player.team.name} - {player.position}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="blue">{player.team.shortName}</Badge>
                  <Badge tone="green">Ocjena {player.rating.toFixed(1)}</Badge>
                  {selectedSeason ? <Badge tone="slate">{selectedSeason.name}</Badge> : null}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="font-semibold text-slate-950 dark:text-white">{player.team.city}</p>
              <p className="text-slate-500 dark:text-slate-400">Klub igraca</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-6">
          <PlayerStat label="Nastupi" value={player.appearances.toString()} />
          <PlayerStat label="Golovi" value={player.goals.toString()} />
          <PlayerStat label="Asistencije" value={player.assists.toString()} />
          <PlayerStat label="Ocjena" value={player.rating.toFixed(1)} />
          <PlayerStat label="Zuti kartoni" value={player.yellowCards.toString()} />
          <PlayerStat label="Crveni kartoni" value={player.redCards.toString()} />
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Utakmice igraca</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Pregled utakmica gdje igrac ima dogadjaj ili ocjenu u izabranoj sezoni.</p>
          </div>

          {player.matches.length > 0 ? player.matches.map((match) => (
            <Card key={match.id} className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link className="font-bold text-slate-950 hover:text-grass-700 dark:text-white dark:hover:text-grass-300" href={`/matches/${match.id}`}>
                    {match.homeTeam.name} - {match.awayTeam.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatDateTime(match.playedAt)} - {match.venue}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={match.status === "FINISHED" ? "green" : match.status === "LIVE" ? "red" : "blue"}>{getStatusLabel(match.status)}</Badge>
                  <span className="rounded-2xl bg-slate-100 px-3 py-1 text-sm font-black text-slate-950 dark:bg-slate-900 dark:text-white">
                    {match.status === "FINISHED" ? `${match.homeScore}:${match.awayScore}` : "vs"}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Dogadjaji</p>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {match.events.length > 0 ? match.events.map((event) => (
                      <div key={event.id} className="rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-800">
                        {event.minute}&apos; {getEventLabel(event.type)}
                      </div>
                    )) : <p>Nema dogadjaja za ovog igraca.</p>}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Ocjena</p>
                  <div className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                    {match.rating ? match.rating.rating.toFixed(1) : "Nema ocjene za ovu utakmicu."}
                  </div>
                </div>
              </div>
            </Card>
          )) : (
            <Card>
              <p className="text-sm text-slate-600 dark:text-slate-300">Jos nema utakmica za ovog igraca.</p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="h-fit">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Forma</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Posljednje ocjene u sezoni.</p>
            {ratingTrend.length > 0 ? (
              <div className="mt-5 flex h-44 items-end gap-3">
                {ratingTrend.map((match) => (
                  <div key={match.id} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-32 w-full items-end rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
                      <div
                        className="w-full rounded-xl bg-grass-600"
                        style={{
                          height: `${Math.max(10, match.rating.rating * 10)}%`
                        }}
                      />
                    </div>
                    <p className="text-xs font-bold text-slate-950 dark:text-white">{match.rating.rating.toFixed(1)}</p>
                    <p className="max-w-full truncate text-xs text-slate-500 dark:text-slate-400">
                      {match.homeTeam.shortName}-{match.awayTeam.shortName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Nema ocjena za grafikon forme.</p>
            )}
          </Card>

          <Card className="h-fit">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Profil</h2>
            <div className="mt-4 space-y-3 text-sm">
              <ProfileRow label="Ime" value={player.name} />
              <ProfileRow label="Broj" value={player.shirtNumber.toString()} />
              <ProfileRow label="Pozicija" value={player.position} />
              <ProfileRow label="Tim" value={player.team.name} />
              <ProfileRow label="Grad" value={player.team.city} />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function PlayerStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right font-semibold text-slate-950 dark:text-white">{value}</span>
    </div>
  );
}
