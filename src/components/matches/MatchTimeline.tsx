import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { MatchEventView, PlayerRatingView } from "@/types";

const eventLabels: Record<MatchEventView["type"], string> = {
  GOAL: "Gol",
  ASSIST: "Asistencija",
  YELLOW_CARD: "Zuti karton",
  RED_CARD: "Crveni karton",
  SUBSTITUTION: "Izmjena"
};

type MatchTimelineProps = {
  events: MatchEventView[];
  ratings: PlayerRatingView[];
};

export function MatchTimeline({ events, ratings }: MatchTimelineProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Timeline utakmice</h2>
        <div className="mt-4 space-y-3">
          {events.length > 0 ? (
            events.map((event) => (
              <div className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3 dark:border-slate-800" key={event.id}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-900 dark:bg-slate-900 dark:text-white">
                  {event.minute}&apos;
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-slate-950 dark:text-white">{event.playerName}</p>
                    <Badge tone={event.type === "GOAL" ? "green" : event.type === "RED_CARD" ? "red" : "slate"}>
                      {eventLabels[event.type]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{event.teamName}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              Jos nema unesenih dogadjaja za ovu utakmicu.
            </p>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Ocjene igraca</h2>
        <div className="mt-4 space-y-3">
          {ratings.length > 0 ? (
            ratings.map((rating) => (
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 p-3 dark:border-slate-800" key={rating.id}>
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{rating.playerName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{rating.teamName}</p>
                </div>
                <div className="rounded-2xl bg-grass-100 px-3 py-2 text-sm font-black text-grass-700">
                  {rating.rating.toFixed(1)}
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              Ocjene igraca jos nisu unesene.
            </p>
          )}
        </div>
      </Card>
    </section>
  );
}
