import { CalendarPlus, ShieldPlus, UsersRound } from "lucide-react";
import { createPlayerAction, deletePlayerAction, updateTeamAction, updateUserAction } from "@/app/admin/actions";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth";
import { getMatches } from "@/services/matches.service";
import { getPlayers } from "@/services/players.service";
import { getTeams } from "@/services/teams.service";
import { getUsers } from "@/services/users.service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const [teams, players, matches, users] = await Promise.all([getTeams(), getPlayers(), getMatches(), getUsers()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Admin pregled</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Osnovni panel za upravljanje timovima, igracima i utakmicama.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Timovi" value={teams.length.toString()} detail="Spremni za sezonu" icon={<ShieldPlus className="h-5 w-5" />} />
        <StatCard label="Igraci" value={players.length.toString()} detail="Registrovani" icon={<UsersRound className="h-5 w-5" />} />
        <StatCard label="Utakmice" value={matches.length.toString()} detail="U kalendaru" icon={<CalendarPlus className="h-5 w-5" />} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Korisnici</h2>
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <form action={updateUserAction} className="grid gap-4 lg:grid-cols-[1fr_1.2fr_160px_auto] lg:items-end">
                <input name="id" type="hidden" value={user.id} />
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Ime</label>
                  <Input name="name" defaultValue={user.name} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Email</label>
                  <Input name="email" type="email" defaultValue={user.email} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Rola</label>
                  <select
                    className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-grass-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    defaultValue={user.role}
                    name="role"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="USER">Korisnik</option>
                  </select>
                </div>
                <Button type="submit">Sacuvaj</Button>
              </form>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Timovi</h2>
        <div className="grid gap-4">
          {teams.map((team) => (
            <Card key={team.id}>
              <form action={updateTeamAction} className="grid gap-4 xl:grid-cols-[1.1fr_120px_1fr_130px_130px_1.4fr_auto] xl:items-end">
                <input name="id" type="hidden" value={team.id} />
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Naziv</label>
                  <Input name="name" defaultValue={team.name} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Kratko</label>
                  <Input name="shortName" defaultValue={team.shortName} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Grad</label>
                  <Input name="city" defaultValue={team.city} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Godina</label>
                  <Input name="foundedYear" type="number" defaultValue={team.foundedYear} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Boja</label>
                  <Input name="primaryColor" type="color" defaultValue={team.primaryColor} required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Logo URL</label>
                  <Input name="logoUrl" type="url" defaultValue={team.logoUrl ?? ""} placeholder="https://..." />
                </div>
                <Button type="submit">Sacuvaj</Button>
              </form>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
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
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Upravljanje igracima</h2>
          <div className="grid gap-3">
            {players.map((player) => (
              <Card key={player.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{player.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    #{player.shirtNumber} - {player.position} - {player.team.name}
                  </p>
                </div>
                <form action={deletePlayerAction}>
                  <input name="id" type="hidden" value={player.id} />
                  <Button type="submit" variant="secondary">
                    Obrisi
                  </Button>
                </form>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
