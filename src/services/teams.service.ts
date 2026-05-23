import { ensureDatabaseConfigured, prisma } from "@/lib/db";
import type { TeamInput, TeamUpdateInput } from "@/lib/validations/team";
import type { StandingWithTeam, Team } from "@/types";

export async function getTeams(): Promise<Team[]> {
  ensureDatabaseConfigured();

  return prisma.team.findMany({
    orderBy: {
      name: "asc"
    }
  });
}

export async function getTeamById(id: string): Promise<Team | null> {
  ensureDatabaseConfigured();

  return prisma.team.findUnique({
    where: {
      id
    }
  });
}

export async function getStandings(): Promise<StandingWithTeam[]> {
  ensureDatabaseConfigured();

  const standings = await prisma.standing.findMany({
    include: {
      team: true
    },
    orderBy: [
      {
        points: "desc"
      },
      {
        goalsFor: "desc"
      }
    ]
  });

  return standings
    .map((standing) => ({
      teamId: standing.teamId,
      played: standing.played,
      won: standing.won,
      drawn: standing.drawn,
      lost: standing.lost,
      goalsFor: standing.goalsFor,
      goalsAgainst: standing.goalsAgainst,
      points: standing.points,
      team: standing.team,
      goalDifference: standing.goalsFor - standing.goalsAgainst
    }))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
}

export async function createTeam(input: TeamInput): Promise<Team> {
  ensureDatabaseConfigured();

  return prisma.team.create({
    data: {
      ...input,
      logoUrl: input.logoUrl || null
    }
  });
}

export async function updateTeam(input: TeamUpdateInput): Promise<Team> {
  ensureDatabaseConfigured();

  return prisma.team.update({
    where: {
      id: input.id
    },
    data: {
      name: input.name,
      shortName: input.shortName,
      city: input.city,
      foundedYear: input.foundedYear,
      primaryColor: input.primaryColor,
      logoUrl: input.logoUrl || null
    }
  });
}
