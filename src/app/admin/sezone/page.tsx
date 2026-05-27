import { activateSeasonAction, createSeasonAction, deleteSeasonAction, updateSeasonAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { Input } from "@/components/ui/Input";
import { getSeasons } from "@/services/seasons.service";

export const dynamic = "force-dynamic";

function toDateInput(value: string): string {
  return value.slice(0, 10);
}

export default async function AdminSeasonsPage() {
  const seasons = await getSeasons();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Sezone</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Upravljanje sezonama koje koriste utakmice i tabela lige.</p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <Card className="lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Dodaj sezonu</h2>
          <form action={createSeasonAction} className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Naziv</label>
              <Input name="name" placeholder="Sezona 2026" required />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Pocetak</label>
              <Input name="startsAt" type="date" required />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Kraj</label>
              <Input name="endsAt" type="date" required />
            </div>
            <Button type="submit">Dodaj sezonu</Button>
          </form>
        </Card>

        <div className="min-w-0 space-y-4">
          {seasons.length > 0 ? seasons.map((season) => (
            <Card key={season.id} className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-950 dark:text-white">{season.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {toDateInput(season.startsAt)} - {toDateInput(season.endsAt)}
                  </p>
                </div>
                <span className="w-fit rounded-2xl bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  {season.isActive ? "Aktivna" : "Neaktivna"}
                </span>
              </div>

              <form action={updateSeasonAction} className="grid gap-4 lg:grid-cols-[1fr_160px_160px_120px_auto] lg:items-end">
                <input name="id" type="hidden" value={season.id} />
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Naziv</label>
                  <Input name="name" defaultValue={season.name} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Pocetak</label>
                  <Input name="startsAt" type="date" defaultValue={toDateInput(season.startsAt)} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Kraj</label>
                  <Input name="endsAt" type="date" defaultValue={toDateInput(season.endsAt)} required />
                </div>
                <label className="flex h-10 items-center gap-2 rounded-2xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200">
                  <input name="isActive" type="checkbox" defaultChecked={season.isActive} />
                  Aktivna
                </label>
                <Button type="submit">Sacuvaj</Button>
              </form>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {!season.isActive ? (
                  <form action={activateSeasonAction}>
                    <input name="id" type="hidden" value={season.id} />
                    <Button type="submit" variant="secondary">
                      Aktiviraj
                    </Button>
                  </form>
                ) : null}
                <form action={deleteSeasonAction}>
                  <input name="id" type="hidden" value={season.id} />
                  <ConfirmSubmitButton message={`Da li sigurno zelis obrisati sezonu ${season.name}? Ovo brise i njene utakmice i tabelu.`} type="submit">
                    Obrisi sezonu
                  </ConfirmSubmitButton>
                </form>
              </div>
            </Card>
          )) : (
            <Card>
              <p className="text-sm text-slate-600 dark:text-slate-300">Nema sezona za prikaz.</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
