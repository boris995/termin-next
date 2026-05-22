import { Card } from "@/components/ui/Card";
import type { Team } from "@/types";

type TeamCardProps = {
  team: Team;
};

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white" style={{ backgroundColor: team.primaryColor }}>
          {team.shortName}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">{team.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{team.city} - osnovan {team.foundedYear}.</p>
        </div>
      </div>
    </Card>
  );
}
