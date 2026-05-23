import Link from "next/link";
import { CalendarDays, Shield, Star, Trophy } from "lucide-react";
import { MatchCard } from "@/components/matches/MatchCard";
import { PlayerCard } from "@/components/players/PlayerCard";
import { StandingsTable } from "@/components/teams/StandingsTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { getLatestResults, getUpcomingMatches } from "@/services/matches.service";
import { getTopPlayers } from "@/services/players.service";
import { getStandings, getTeams } from "@/services/teams.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [standings, upcomingMatches, latestResults, topPlayers, teams] = await Promise.all([
    getStandings(),
    getUpcomingMatches(2),
    getLatestResults(2),
    getTopPlayers(2),
    getTeams()
  ]);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-grass-700">Sezona 2026</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Termin liga
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Jedno mjesto za tabelu, rezultate, profile timova, statistiku igraca i osnovnu administraciju lige.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="rounded-2xl bg-grass-600 px-4 py-2 text-sm font-semibold text-white hover:bg-grass-700" href="/matches">
              Pogledaj utakmice
            </Link>
            <Link className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white" href="/admin">
              Otvori admin
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <StatCard label="Timovi" value={teams.length.toString()} detail="Aktivni u ligi" icon={<Shield className="h-5 w-5" />} />
          <StatCard label="Lider" value={standings[0]?.team.shortName ?? "-"} detail={`${standings[0]?.points ?? 0} bodova`} icon={<Trophy className="h-5 w-5" />} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Sljedece utakmice" value={upcomingMatches.length.toString()} detail="U rasporedu" icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard label="Najbolji strijelac" value={topPlayers[0]?.goals.toString() ?? "0"} detail={topPlayers[0]?.name ?? "Nema podataka"} icon={<Star className="h-5 w-5" />} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Tabela</h2>
          <Link href="/teams" className="text-sm font-semibold text-grass-700 hover:text-grass-900">Svi timovi</Link>
        </div>
        <StandingsTable standings={standings} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Najnoviji rezultati</h2>
          {latestResults.map((match) => <MatchCard key={match.id} match={match} />)}
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Igraci kola</h2>
          {topPlayers.map((player) => <PlayerCard key={player.id} player={player} />)}
        </div>
      </section>
    </div>
  );
}
