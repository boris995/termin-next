import { recalculateStandingsAction, updateStandingAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getSeasons } from "@/services/seasons.service";
import { getStandings } from "@/services/teams.service";

export const dynamic = "force-dynamic";

type AdminStandingsPageProps = {
  searchParams?: Promise<{
    seasonId?: string;
  }>;
};

export default async function AdminStandingsPage({ searchParams }: AdminStandingsPageProps) {
  const params = await searchParams;
  const seasons = await getSeasons();
  const selectedSeasonId = params?.seasonId || seasons.find((season) => season.isActive)?.id || seasons[0]?.id;
  const standings = selectedSeasonId ? await getStandings(selectedSeasonId) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Tabela lige</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Rucno uredjivanje poretka, bodova i golova po timu.</p>
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

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-slate-950 dark:text-white">Automatsko racunanje</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Preracunaj tabelu iz svih zavrsenih utakmica izabrane sezone.</p>
        </div>
        <form action={recalculateStandingsAction}>
          {selectedSeasonId ? <input name="seasonId" type="hidden" value={selectedSeasonId} /> : null}
          <Button type="submit">Preracunaj tabelu</Button>
        </form>
      </Card>

      <section className="grid gap-4">
        {standings.length > 0 ? standings.map((standing, index) => (
          <Card key={`${standing.seasonId}-${standing.teamId}`} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-slate-500">Pozicija {index + 1}</p>
                <p className="truncate text-lg font-bold text-slate-950 dark:text-white">{standing.team.name}</p>
              </div>
              <div className="rounded-2xl bg-grass-50 px-4 py-2 text-right dark:bg-grass-950/40">
                <p className="text-xs font-semibold uppercase text-grass-700 dark:text-grass-300">Bodovi</p>
                <p className="text-2xl font-black text-grass-700 dark:text-grass-300">{standing.points}</p>
              </div>
            </div>

            <form action={updateStandingAction} className="grid gap-4 lg:grid-cols-[repeat(7,minmax(80px,1fr))_110px] lg:items-end">
              <input name="seasonId" type="hidden" value={standing.seasonId} />
              <input name="teamId" type="hidden" value={standing.teamId} />
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Odigrano</label>
                <Input name="played" type="number" min={0} defaultValue={standing.played} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Pobjede</label>
                <Input name="won" type="number" min={0} defaultValue={standing.won} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Nerijeseno</label>
                <Input name="drawn" type="number" min={0} defaultValue={standing.drawn} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Porazi</label>
                <Input name="lost" type="number" min={0} defaultValue={standing.lost} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Golovi za</label>
                <Input name="goalsFor" type="number" min={0} defaultValue={standing.goalsFor} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Golovi protiv</label>
                <Input name="goalsAgainst" type="number" min={0} defaultValue={standing.goalsAgainst} required />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Bodovi</label>
                <Input name="points" type="number" min={0} defaultValue={standing.points} required />
              </div>
              <Button type="submit">Sacuvaj</Button>
            </form>
          </Card>
        )) : (
          <Card>
            <p className="text-sm text-slate-600 dark:text-slate-300">Nema podataka u tabeli za prikaz.</p>
          </Card>
        )}
      </section>
    </div>
  );
}
