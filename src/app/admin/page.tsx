import { CalendarPlus, ShieldPlus, UsersRound } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth";
import { getMatches } from "@/services/matches.service";
import { getPlayers } from "@/services/players.service";
import { getTeams } from "@/services/teams.service";

export default async function AdminPage() {
  await requireAdmin();

  const [teams, players, matches] = await Promise.all([getTeams(), getPlayers(), getMatches()]);

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

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Brzi unos tima</h2>
          <form className="mt-4 space-y-4">
            <Input aria-label="Naziv tima" placeholder="Naziv tima" />
            <Input aria-label="Grad" placeholder="Grad" />
            <Input aria-label="Skraceni naziv" placeholder="Skraceni naziv" />
            <Button type="button">Sacuvaj tim</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Brzi unos utakmice</h2>
          <form className="mt-4 space-y-4">
            <Input aria-label="Domaci tim" placeholder="Domaci tim" />
            <Input aria-label="Gostujuci tim" placeholder="Gostujuci tim" />
            <Input aria-label="Termin" type="datetime-local" />
            <Button type="button">Sacuvaj utakmicu</Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
