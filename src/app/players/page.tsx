import { PlayerCard } from "@/components/players/PlayerCard";
import { getPlayers } from "@/services/players.service";

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Igraci</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Statistika golova, asistencija i ocjena.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {players.map((player) => <PlayerCard key={player.id} player={player} />)}
      </div>
    </div>
  );
}
