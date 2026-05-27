import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MatchTimeline } from "@/components/matches/MatchTimeline";
import { formatDateTime } from "@/lib/utils";
import { getMatchReport } from "@/services/matches.service";

type MatchDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function MatchDetailsPage({ params }: MatchDetailsPageProps) {
  const { id } = await params;
  const match = await getMatchReport(id);

  if (!match) {
    notFound();
  }

  const isFinished = match.status === "FINISHED";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link className="text-sm font-semibold text-grass-700 hover:text-grass-900" href="/matches">
            Nazad na utakmice
          </Link>
          <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Izvjestaj utakmice</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{formatDateTime(match.playedAt)} - {match.venue}</p>
        </div>
        <Badge tone={isFinished ? "green" : "blue"}>{isFinished ? "Zavrseno" : "Zakazano"}</Badge>
      </div>

      <Card>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div>
            <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Domacin</p>
            <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">{match.homeTeam.name}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-5 py-3 text-center text-2xl font-black text-slate-950 dark:bg-slate-900 dark:text-white">
            {isFinished ? `${match.homeScore}:${match.awayScore}` : "vs"}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Gost</p>
            <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">{match.awayTeam.name}</p>
          </div>
        </div>
      </Card>

      <MatchTimeline events={match.events} ratings={match.ratings} />
    </div>
  );
}
