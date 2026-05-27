import { ensureDatabaseConfigured, prisma } from "@/lib/db";
import { ServiceError } from "@/lib/errors";
import type { StandingUpdateInput } from "@/lib/validations/standing";
import type { TeamInput, TeamUpdateInput } from "@/lib/validations/team";
import type { MatchStatus, PlayerWithTeam, StandingWithTeam, Team } from "@/types";

export type TeamProfileMatch = {
  id: string;
  playedAt: string;
  venue: string;
  status: MatchStatus;
  opponent: Team;
  isHome: boolean;
  homeScore: number | null;
  awayScore: number | null;
};

export type TeamProfile = Team & {
  standing: StandingWithTeam | null;
  players: PlayerWithTeam[];
  matches: TeamProfileMatch[];
};

type StandingTotals = {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

function createEmptyStandingTotals(): StandingTotals {
  return {
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0
  };
}

function applyMatchToStandings(
  standingsByTeamId: Map<string, StandingTotals>,
  homeTeamId: string,
  awayTeamId: string,
  homeScore: number,
  awayScore: number
): void {
  const homeStanding = standingsByTeamId.get(homeTeamId) ?? createEmptyStandingTotals();
  const awayStanding = standingsByTeamId.get(awayTeamId) ?? createEmptyStandingTotals();

  homeStanding.played += 1;
  awayStanding.played += 1;
  homeStanding.goalsFor += homeScore;
  homeStanding.goalsAgainst += awayScore;
  awayStanding.goalsFor += awayScore;
  awayStanding.goalsAgainst += homeScore;

  if (homeScore > awayScore) {
    homeStanding.won += 1;
    homeStanding.points += 3;
    awayStanding.lost += 1;
  } else if (homeScore < awayScore) {
    awayStanding.won += 1;
    awayStanding.points += 3;
    homeStanding.lost += 1;
  } else {
    homeStanding.drawn += 1;
    awayStanding.drawn += 1;
    homeStanding.points += 1;
    awayStanding.points += 1;
  }

  standingsByTeamId.set(homeTeamId, homeStanding);
  standingsByTeamId.set(awayTeamId, awayStanding);
}

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

export async function getTeamProfile(id: string, seasonId?: string): Promise<TeamProfile | null> {
  ensureDatabaseConfigured();

  const selectedSeasonId = seasonId ?? (await getActiveSeasonId());
  const team = await prisma.team.findUnique({
    where: {
      id
    },
    include: {
      players: {
        include: {
          team: true,
          events: {
            where: {
              match: {
                seasonId: selectedSeasonId
              }
            }
          },
          ratings: {
            where: {
              match: {
                seasonId: selectedSeasonId
              }
            }
          }
        },
        orderBy: {
          shirtNumber: "asc"
        }
      },
      homeMatches: {
        where: {
          seasonId: selectedSeasonId
        },
        include: {
          awayTeam: true
        },
        orderBy: {
          playedAt: "desc"
        }
      },
      awayMatches: {
        where: {
          seasonId: selectedSeasonId
        },
        include: {
          homeTeam: true
        },
        orderBy: {
          playedAt: "desc"
        }
      }
    }
  });

  if (!team) {
    return null;
  }

  const standings = await getStandings(selectedSeasonId);
  const standing = standings.find((row) => row.teamId === team.id) ?? null;

  const players = team.players.map((player) => {
    const goals = player.events.filter((event) => event.type === "GOAL").length;
    const assists = player.events.filter((event) => event.type === "ASSIST").length;
    const ratingSum = player.ratings.reduce((sum, rating) => sum + Number(rating.rating), 0);
    const rating = player.ratings.length > 0 ? ratingSum / player.ratings.length : 0;

    return {
      id: player.id,
      name: player.name,
      position: player.position,
      shirtNumber: player.shirtNumber,
      teamId: player.teamId,
      goals,
      assists,
      rating,
      team: player.team
    };
  });

  const matches = [
    ...team.homeMatches.map((match) => ({
      id: match.id,
      playedAt: match.playedAt.toISOString(),
      venue: match.venue,
      status: match.status,
      opponent: match.awayTeam,
      isHome: true,
      homeScore: match.homeScore,
      awayScore: match.awayScore
    })),
    ...team.awayMatches.map((match) => ({
      id: match.id,
      playedAt: match.playedAt.toISOString(),
      venue: match.venue,
      status: match.status,
      opponent: match.homeTeam,
      isHome: false,
      homeScore: match.homeScore,
      awayScore: match.awayScore
    }))
  ].sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());

  return {
    id: team.id,
    name: team.name,
    shortName: team.shortName,
    city: team.city,
    foundedYear: team.foundedYear,
    primaryColor: team.primaryColor,
    logoUrl: team.logoUrl,
    standing,
    players,
    matches
  };
}

async function getActiveSeasonId(): Promise<string> {
  const activeSeason = await prisma.season.findFirst({
    where: {
      isActive: true
    },
    select: {
      id: true
    },
    orderBy: {
      startsAt: "desc"
    }
  });

  if (!activeSeason) {
    throw new ServiceError("Aktivna sezona nije pronadjena", 409);
  }

  return activeSeason.id;
}

export async function getStandings(seasonId?: string): Promise<StandingWithTeam[]> {
  ensureDatabaseConfigured();

  const selectedSeasonId = seasonId ?? (await getActiveSeasonId());

  const standings = await prisma.standing.findMany({
    where: {
      seasonId: selectedSeasonId
    },
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
      seasonId: standing.seasonId,
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

export async function updateStanding(input: StandingUpdateInput): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.standing.update({
    where: {
      seasonId_teamId: {
        seasonId: input.seasonId,
        teamId: input.teamId
      }
    },
    data: {
      played: input.played,
      won: input.won,
      drawn: input.drawn,
      lost: input.lost,
      goalsFor: input.goalsFor,
      goalsAgainst: input.goalsAgainst,
      points: input.points
    }
  });
}

export async function recalculateSeasonStandings(seasonId: string): Promise<void> {
  ensureDatabaseConfigured();

  const [teams, matches] = await Promise.all([
    prisma.team.findMany({
      select: {
        id: true
      }
    }),
    prisma.match.findMany({
      where: {
        seasonId,
        status: "FINISHED",
        homeScore: {
          not: null
        },
        awayScore: {
          not: null
        }
      },
      select: {
        homeTeamId: true,
        awayTeamId: true,
        homeScore: true,
        awayScore: true
      }
    })
  ]);

  const standingsByTeamId = new Map<string, StandingTotals>();

  teams.forEach((team) => {
    standingsByTeamId.set(team.id, createEmptyStandingTotals());
  });

  matches.forEach((match) => {
    if (match.homeScore === null || match.awayScore === null) {
      return;
    }

    applyMatchToStandings(standingsByTeamId, match.homeTeamId, match.awayTeamId, match.homeScore, match.awayScore);
  });

  await prisma.$transaction(
    teams.map((team) => {
      const totals = standingsByTeamId.get(team.id) ?? createEmptyStandingTotals();

      return prisma.standing.upsert({
        where: {
          seasonId_teamId: {
            seasonId,
            teamId: team.id
          }
        },
        update: totals,
        create: {
          seasonId,
          teamId: team.id,
          ...totals
        }
      });
    })
  );
}

export async function recalculateActiveSeasonStandings(): Promise<void> {
  ensureDatabaseConfigured();

  const activeSeasonId = await getActiveSeasonId();
  await recalculateSeasonStandings(activeSeasonId);
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
