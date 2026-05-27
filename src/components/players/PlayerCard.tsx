import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { PlayerWithTeam } from "@/types";

type PlayerCardProps = {
  player: PlayerWithTeam;
};

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {player.shirtNumber}
            </span>
            <div>
              <h3 className="font-bold text-slate-950 dark:text-white">{player.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{player.team.name}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Badge tone="blue">{player.position}</Badge>
            <Badge tone="green">Ocjena {player.rating.toFixed(1)}</Badge>
          </div>
        </div>
        <div className="text-right text-sm">
          <p className="font-bold text-slate-950 dark:text-white">{player.goals} golova</p>
          <p className="text-slate-500 dark:text-slate-400">{player.assists} asistencija</p>
        </div>
      </div>
      <Link className="mt-4 inline-flex text-sm font-semibold text-grass-700 hover:text-grass-900 dark:text-grass-300 dark:hover:text-grass-200" href={`/players/${player.id}`}>
        Pogledaj profil
      </Link>
    </Card>
  );
}
