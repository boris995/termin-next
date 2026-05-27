import { createPlayerAction, deletePlayerAction, updatePlayerAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { Input } from "@/components/ui/Input";
import { getPlayers } from "@/services/players.service";
import { getTeams } from "@/services/teams.service";

export const dynamic = "force-dynamic";

export default async function AdminPlayersPage() {
  const [teams, players] = await Promise.all([getTeams(), getPlayers()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Igraci</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Dodaj, izmijeni ili obrisi igrace iz baze.</p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Dodaj igraca</h2>
          <form action={createPlayerAction} className="mt-4 space-y-4">
            <Input name="name" aria-label="Ime igraca" placeholder="Ime i prezime" required />
            <Input name="position" aria-label="Pozicija" placeholder="Pozicija" required />
            <Input name="shirtNumber" aria-label="Broj dresa" min={1} max={99} type="number" placeholder="Broj dresa" required />
            <select
              aria-label="Tim"
              className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-grass-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              name="teamId"
              required
            >
              <option value="">Izaberi tim</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <Button type="submit">Sacuvaj igraca</Button>
          </form>
        </Card>

        <div className="space-y-4">
          {players.length > 0 ? players.map((player) => (
            <Card key={player.id} className="space-y-4">
              <form action={updatePlayerAction} className="grid gap-4 xl:grid-cols-[1.2fr_1fr_120px_1fr_auto] xl:items-end">
                <input name="id" type="hidden" value={player.id} />
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Ime</label>
                  <Input name="name" defaultValue={player.name} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Pozicija</label>
                  <Input name="position" defaultValue={player.position} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Broj</label>
                  <Input name="shirtNumber" type="number" min={1} max={99} defaultValue={player.shirtNumber} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Tim</label>
                  <select
                    className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-grass-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    defaultValue={player.teamId}
                    name="teamId"
                  >
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit">Sacuvaj</Button>
              </form>
              <form action={deletePlayerAction} className="flex justify-end">
                <input name="id" type="hidden" value={player.id} />
                <ConfirmSubmitButton message={`Da li sigurno zelis obrisati igraca ${player.name}?`} type="submit">
                  Obrisi igraca
                </ConfirmSubmitButton>
              </form>
            </Card>
          )) : (
            <Card>
              <p className="text-sm text-slate-600 dark:text-slate-300">Nema igraca za prikaz.</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
