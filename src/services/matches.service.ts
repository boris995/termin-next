import { matches, teams } from "@/lib/data";
import type { MatchStatus, MatchWithTeams } from "@/types";

export async function getMatches(status?: MatchStatus): Promise<MatchWithTeams[]> {
  return matches
    .filter((match) => (status ? match.status === status : true))
    .map((match) => {
      const homeTeam = teams.find((team) => team.id === match.homeTeamId);
      const awayTeam = teams.find((team) => team.id === match.awayTeamId);

      if (!homeTeam || !awayTeam) {
        return null;
      }

      return {
        ...match,
        homeTeam,
        awayTeam
      };
    })
    .filter((match): match is MatchWithTeams => match !== null)
    .sort((a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime());
}

export async function getLatestResults(limit = 3): Promise<MatchWithTeams[]> {
  const finishedMatches = await getMatches("FINISHED");
  return finishedMatches
    .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
    .slice(0, limit);
}

export async function getUpcomingMatches(limit = 3): Promise<MatchWithTeams[]> {
  const scheduledMatches = await getMatches("SCHEDULED");
  return scheduledMatches.slice(0, limit);
}
