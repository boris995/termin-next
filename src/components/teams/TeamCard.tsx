import { Card } from "@/components/ui/Card";
import type { Team } from "@/types";

type TeamCardProps = {
  team: Team;
};

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        {team.logoUrl ? (
          <div
            aria-label={`${team.name} logo`}
            className="h-14 w-14 rounded-2xl border border-slate-200 bg-cover bg-center dark:border-slate-800"
            role="img"
            style={{ backgroundImage: `url(${team.logoUrl})` }}
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white" style={{ backgroundColor: team.primaryColor }}>
            {team.shortName}
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">{team.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{team.city} - osnovan {team.foundedYear}.</p>
        </div>
      </div>
    </Card>
  );
}
