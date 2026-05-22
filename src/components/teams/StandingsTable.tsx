import type { StandingWithTeam } from "@/types";

type StandingsTableProps = {
  standings: StandingWithTeam[];
};

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Tim</th>
            <th className="px-4 py-3">O</th>
            <th className="px-4 py-3">P</th>
            <th className="px-4 py-3">N</th>
            <th className="px-4 py-3">I</th>
            <th className="px-4 py-3">Golovi</th>
            <th className="px-4 py-3">Razlika</th>
            <th className="px-4 py-3">Bodovi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {standings.map((standing, index) => (
            <tr key={standing.teamId}>
              <td className="px-4 py-3 font-semibold text-slate-500">{index + 1}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: standing.team.primaryColor }} />
                  <span className="font-semibold text-slate-950 dark:text-white">{standing.team.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">{standing.played}</td>
              <td className="px-4 py-3">{standing.won}</td>
              <td className="px-4 py-3">{standing.drawn}</td>
              <td className="px-4 py-3">{standing.lost}</td>
              <td className="px-4 py-3">{standing.goalsFor}:{standing.goalsAgainst}</td>
              <td className="px-4 py-3">{standing.goalDifference}</td>
              <td className="px-4 py-3 font-bold text-grass-700">{standing.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
