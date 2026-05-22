import { MatchCard } from "@/components/matches/MatchCard";
import { getMatches } from "@/services/matches.service";

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Utakmice</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Pregled odigranih i zakazanih utakmica.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {matches.map((match) => <MatchCard key={match.id} match={match} />)}
      </div>
    </div>
  );
}
