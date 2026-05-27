import { PlayerCard } from "@/components/players/PlayerCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getPlayers } from "@/services/players.service";
import { getSeasons } from "@/services/seasons.service";
import { getTeams } from "@/services/teams.service";
import type { PlayerWithTeam } from "@/types";

export const dynamic = "force-dynamic";

type PlayersPageProps = {
  searchParams?: Promise<{
    seasonId?: string;
    teamId?: string;
  }>;
};

export default async function PlayersPage({ searchParams }: PlayersPageProps) {
  const params = await searchParams;
  const seasons = await getSeasons();
  const selectedSeasonId = params?.seasonId || seasons.find((season) => season.isActive)?.id || seasons[0]?.id;
  const selectedTeamId = params?.teamId || "";
  const [teams, players] = await Promise.all([getTeams(), getPlayers(selectedSeasonId, selectedTeamId || undefined)]);
  const topScorers = [...players].sort((a, b) => b.goals - a.goals || b.assists - a.assists || b.rating - a.rating).slice(0, 5);
  const topAssists = [...players].sort((a, b) => b.assists - a.assists || b.goals - a.goals || b.rating - a.rating).slice(0, 5);
  const topRated = [...players].sort((a, b) => b.rating - a.rating || b.goals - a.goals || b.assists - a.assists).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Igraci</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Statistika golova, asistencija i ocjena po sezoni.</p>
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
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Tim</label>
            <select
              className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-grass-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              defaultValue={selectedTeamId}
              name="teamId"
            >
              <option value="">Svi timovi</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="secondary">Prikazi sezonu</Button>
        </form>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        <RankingCard label="Najbolji strijelci" players={topScorers} value={(player) => `${player.goals} golova`} />
        <RankingCard label="Najbolji asistenti" players={topAssists} value={(player) => `${player.assists} asistencija`} />
        <RankingCard label="Najbolje ocjene" players={topRated} value={(player) => player.rating.toFixed(1)} />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {players.length > 0 ? players.map((player) => <PlayerCard key={player.id} player={player} />) : (
          <Card>
            <p className="text-sm text-slate-600 dark:text-slate-300">Nema igraca za prikaz.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function RankingCard({
  label,
  players,
  value
}: {
  label: string;
  players: PlayerWithTeam[];
  value: (player: PlayerWithTeam) => string;
}) {
  return (
    <Card>
      <h2 className="text-lg font-black text-slate-950 dark:text-white">{label}</h2>
      <div className="mt-4 space-y-3">
        {players.length > 0 ? players.map((player, index) => (
          <div key={player.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-800">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xs font-black text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{player.name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{player.team.name}</p>
              </div>
            </div>
            <p className="shrink-0 text-sm font-black text-slate-950 dark:text-white">{value(player)}</p>
          </div>
        )) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">Nema podataka.</p>
        )}
      </div>
    </Card>
  );
}
