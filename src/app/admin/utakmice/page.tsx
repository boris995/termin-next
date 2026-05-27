import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AdminMatchCard, NewMatchForm } from "@/components/matches/AdminMatchForms";
import { getAdminMatches } from "@/services/matches.service";
import { getPlayers } from "@/services/players.service";
import { getSeasons } from "@/services/seasons.service";
import { getTeams } from "@/services/teams.service";

export const dynamic = "force-dynamic";

type AdminMatchesPageProps = {
  searchParams?: Promise<{
    seasonId?: string;
  }>;
};

export default async function AdminMatchesPage({ searchParams }: AdminMatchesPageProps) {
  const params = await searchParams;
  const seasons = await getSeasons();
  const selectedSeasonId = params?.seasonId || seasons.find((season) => season.isActive)?.id || seasons[0]?.id;
  const [teams, players, adminMatches] = await Promise.all([getTeams(), getPlayers(), getAdminMatches(selectedSeasonId)]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Utakmice</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Kalendar, rezultati, timeline i ocjene na jednom mjestu.</p>
      </div>

      <Card>
        <form className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Sezona</label>
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

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
        <NewMatchForm selectedSeasonId={selectedSeasonId} teams={teams} />

        <div className="min-w-0 space-y-4">
          {adminMatches.length > 0 ? adminMatches.map((match) => (
            <AdminMatchCard key={match.id} match={match} players={players} teams={teams} />
          )) : (
            <Card>
              <p className="text-sm text-slate-600 dark:text-slate-300">Nema utakmica za prikaz.</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
