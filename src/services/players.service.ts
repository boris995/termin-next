import { players, teams } from "@/lib/data";
import type { PlayerWithTeam } from "@/types";

export async function getPlayers(): Promise<PlayerWithTeam[]> {
  return players
    .map((player) => {
      const team = teams.find((item) => item.id === player.teamId);

      if (!team) {
        return null;
      }

      return {
        ...player,
        team
      };
    })
    .filter((player): player is PlayerWithTeam => player !== null)
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists);
}

export async function getTopPlayers(limit = 4): Promise<PlayerWithTeam[]> {
  const allPlayers = await getPlayers();
  return allPlayers.slice(0, limit);
}
