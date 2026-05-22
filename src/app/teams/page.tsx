import { StandingsTable } from "@/components/teams/StandingsTable";
import { TeamCard } from "@/components/teams/TeamCard";
import { getStandings, getTeams } from "@/services/teams.service";

export default async function TeamsPage() {
  const [teams, standings] = await Promise.all([getTeams(), getStandings()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Timovi i tabela</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Aktivni timovi, osnovni podaci i poredak u ligi.</p>
      </div>
      <StandingsTable standings={standings} />
      <div className="grid gap-4 md:grid-cols-2">
        {teams.map((team) => <TeamCard key={team.id} team={team} />)}
      </div>
    </div>
  );
}
