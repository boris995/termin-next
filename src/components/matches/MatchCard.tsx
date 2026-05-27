import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import type { MatchWithTeams } from "@/types";

type MatchCardProps = {
  match: MatchWithTeams;
};

export function MatchCard({ match }: MatchCardProps) {
  const isFinished = match.status === "FINISHED";

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{formatDateTime(match.playedAt)}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{match.venue}</p>
        </div>
        <Badge tone={isFinished ? "green" : "blue"}>{isFinished ? "Zavrseno" : "Zakazano"}</Badge>
      </div>
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <p className="font-bold text-slate-950 dark:text-white">{match.homeTeam.name}</p>
        <div className="rounded-2xl bg-slate-100 px-4 py-2 text-center text-lg font-bold text-slate-950 dark:bg-slate-900 dark:text-white">
          {isFinished ? `${match.homeScore}:${match.awayScore}` : "vs"}
        </div>
        <p className="text-right font-bold text-slate-950 dark:text-white">{match.awayTeam.name}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Link className="text-sm font-semibold text-grass-700 hover:text-grass-900" href={`/matches/${match.id}`}>
          Detalji utakmice
        </Link>
      </div>
    </Card>
  );
}
