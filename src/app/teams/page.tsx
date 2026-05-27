import { StandingsTable } from "@/components/teams/StandingsTable";
import { TeamCard } from "@/components/teams/TeamCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getSeasons } from "@/services/seasons.service";
import { getStandings, getTeams } from "@/services/teams.service";

export const dynamic = "force-dynamic";

type TeamsPageProps = {
  searchParams?: Promise<{
    seasonId?: string;
  }>;
};

export default async function TeamsPage({ searchParams }: TeamsPageProps) {
  const params = await searchParams;
  const seasons = await getSeasons();
  const selectedSeasonId = params?.seasonId || seasons.find((season) => season.isActive)?.id || seasons[0]?.id;
  const [teams, standings] = await Promise.all([getTeams(), getStandings(selectedSeasonId)]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Timovi i tabela</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Aktivni timovi, osnovni podaci i poredak u ligi po sezoni.</p>
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

      <StandingsTable standings={standings} />
      <div className="grid gap-4 md:grid-cols-2">
        {teams.map((team) => <TeamCard key={team.id} team={team} />)}
      </div>
    </div>
  );
}
