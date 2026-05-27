import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getPlayers } from "@/services/players.service";
import { getSeasons } from "@/services/seasons.service";
import type { PlayerWithTeam } from "@/types";

type StatsPageProps = {
  searchParams?: Promise<{
    seasonId?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const params = await searchParams;
  const seasons = await getSeasons();
  const selectedSeasonId = params?.seasonId || seasons.find((season) => season.isActive)?.id || seasons[0]?.id;
  const players = await getPlayers(selectedSeasonId);
  const scorers = [...players].sort((a, b) => b.goals - a.goals || b.assists - a.assists || b.rating - a.rating);
  const assists = [...players].sort((a, b) => b.assists - a.assists || b.goals - a.goals || b.rating - a.rating);
  const ratings = [...players].sort((a, b) => b.rating - a.rating || b.goals - a.goals || b.assists - a.assists);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Statistika</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Kompletne rang liste igraca po sezoni.</p>
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

      <section className="grid gap-4 xl:grid-cols-3">
        <RankingTable title="Strijelci" players={scorers} valueLabel="Golovi" value={(player) => player.goals.toString()} />
        <RankingTable title="Asistenti" players={assists} valueLabel="Asistencije" value={(player) => player.assists.toString()} />
        <RankingTable title="Ocjene" players={ratings} valueLabel="Ocjena" value={(player) => player.rating.toFixed(1)} />
      </section>
    </div>
  );
}

function RankingTable({
  players,
  title,
  value,
  valueLabel
}: {
  players: PlayerWithTeam[];
  title: string;
  value: (player: PlayerWithTeam) => string;
  valueLabel: string;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Igrac</th>
              <th className="px-4 py-3 text-right">{valueLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {players.length > 0 ? players.map((player, index) => (
              <tr key={player.id}>
                <td className="px-4 py-3 font-black text-slate-950 dark:text-white">{index + 1}</td>
                <td className="px-4 py-3">
                  <Link className="font-semibold text-slate-950 hover:text-grass-700 dark:text-white dark:hover:text-grass-300" href={`/players/${player.id}`}>
                    {player.name}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{player.team.name}</p>
                </td>
                <td className="px-4 py-3 text-right font-black text-slate-950 dark:text-white">{value(player)}</td>
              </tr>
            )) : (
              <tr>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300" colSpan={3}>
                  Nema podataka za prikaz.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
