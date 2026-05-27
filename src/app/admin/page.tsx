import Link from "next/link";
import { CalendarPlus, ShieldPlus, UsersRound } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { getMatches } from "@/services/matches.service";
import { getPlayers } from "@/services/players.service";
import { getTeams } from "@/services/teams.service";
import { getUsers } from "@/services/users.service";

export const dynamic = "force-dynamic";

const sections = [
  {
    href: "/admin/utakmice",
    title: "Utakmice",
    text: "Kalendar, rezultati, timeline dogadjaji i ocjene igraca."
  },
  {
    href: "/admin/igraci",
    title: "Igraci",
    text: "Dodavanje, izmjena, promjena tima i brisanje igraca."
  },
  {
    href: "/admin/timovi",
    title: "Timovi",
    text: "Nazivi, kratice, gradovi, boje i logo timova."
  },
  {
    href: "/admin/tabela",
    title: "Tabela",
    text: "Rucno uredjivanje bodova, golova i omjera timova."
  },
  {
    href: "/admin/sezone",
    title: "Sezone",
    text: "Kreiranje, aktiviranje i uredjivanje sezona lige."
  },
  {
    href: "/admin/korisnici",
    title: "Korisnici",
    text: "Pregled korisnika i upravljanje rolama."
  }
];

export default async function AdminPage() {
  const [teams, players, matches, users] = await Promise.all([getTeams(), getPlayers(), getMatches(), getUsers()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Admin pregled</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Brzi pregled lige i ulaz u svaku admin sekciju.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Timovi" value={teams.length.toString()} detail="Spremni za sezonu" icon={<ShieldPlus className="h-5 w-5" />} />
        <StatCard label="Igraci" value={players.length.toString()} detail="Registrovani" icon={<UsersRound className="h-5 w-5" />} />
        <StatCard label="Utakmice" value={matches.length.toString()} detail="U kalendaru" icon={<CalendarPlus className="h-5 w-5" />} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="block">
            <Card className="h-full transition hover:-translate-y-0.5 hover:border-grass-600">
              <p className="text-lg font-bold text-slate-950 dark:text-white">{section.title}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{section.text}</p>
            </Card>
          </Link>
        ))}
      </section>

      <Card>
        <p className="text-sm font-semibold text-slate-950 dark:text-white">Korisnici u sistemu</p>
        <p className="mt-1 text-3xl font-black text-grass-700 dark:text-grass-400">{users.length}</p>
      </Card>
    </div>
  );
}
