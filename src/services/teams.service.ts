import { standings, teams } from "@/lib/data";
import type { StandingWithTeam, Team } from "@/types";

export async function getTeams(): Promise<Team[]> {
  return teams;
}

export async function getTeamById(id: string): Promise<Team | null> {
  return teams.find((team) => team.id === id) ?? null;
}

export async function getStandings(): Promise<StandingWithTeam[]> {
  return standings
    .map((standing) => {
      const team = teams.find((item) => item.id === standing.teamId);

      if (!team) {
        return null;
      }

      return {
        ...standing,
        team,
        goalDifference: standing.goalsFor - standing.goalsAgainst
      };
    })
    .filter((standing): standing is StandingWithTeam => standing !== null)
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
}
