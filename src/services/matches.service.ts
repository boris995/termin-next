import { MatchStatus as PrismaMatchStatus, Prisma } from "@prisma/client";
import { ServiceError } from "@/lib/errors";
import { ensureDatabaseConfigured, prisma } from "@/lib/db";
import type { MatchEventInput, MatchInput, MatchResultInput, MatchUpdateInput, PlayerRatingInput } from "@/lib/validations/match";
import type { MatchReport, MatchStatus, MatchWithTeams } from "@/types";

type MatchWithRelations = Prisma.MatchGetPayload<{
  include: {
    homeTeam: true;
    awayTeam: true;
  };
}>;

export type AdminMatch = MatchWithTeams & {
  events: Array<{
    id: string;
    playerName: string;
    type: string;
    minute: number;
  }>;
  ratings: Array<{
    id: string;
    playerName: string;
    rating: number;
  }>;
};

function mapMatch(match: MatchWithRelations): MatchWithTeams {
  return {
    id: match.id,
    seasonId: match.seasonId,
    homeTeamId: match.homeTeamId,
    awayTeamId: match.awayTeamId,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    playedAt: match.playedAt.toISOString(),
    venue: match.venue,
    status: match.status,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam
  };
}

export async function getMatches(status?: MatchStatus, seasonId?: string): Promise<MatchWithTeams[]> {
  ensureDatabaseConfigured();

  const matches = await prisma.match.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(seasonId ? { seasonId } : {})
    },
    include: {
      homeTeam: true,
      awayTeam: true
    },
    orderBy: {
      playedAt: "asc"
    }
  });

  return matches.map(mapMatch);
}

export async function getAdminMatches(seasonId?: string): Promise<AdminMatch[]> {
  ensureDatabaseConfigured();

  const matches = await prisma.match.findMany({
    where: seasonId ? { seasonId } : undefined,
    include: {
      homeTeam: true,
      awayTeam: true,
      events: {
        include: {
          player: true
        },
        orderBy: {
          minute: "asc"
        }
      },
      ratings: {
        include: {
          player: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    },
    orderBy: {
      playedAt: "desc"
    }
  });

  return matches.map((match) => ({
    ...mapMatch(match),
    events: match.events.map((event) => ({
      id: event.id,
      playerName: event.player.name,
      type: event.type,
      minute: event.minute
    })),
    ratings: match.ratings.map((rating) => ({
      id: rating.id,
      playerName: rating.player.name,
      rating: Number(rating.rating)
    }))
  }));
}

export async function getMatchReport(id: string): Promise<MatchReport | null> {
  ensureDatabaseConfigured();

  const match = await prisma.match.findUnique({
    where: {
      id
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      events: {
        include: {
          player: {
            include: {
              team: true
            }
          }
        },
        orderBy: [
          {
            minute: "asc"
          },
          {
            createdAt: "asc"
          }
        ]
      },
      ratings: {
        include: {
          player: {
            include: {
              team: true
            }
          }
        },
        orderBy: [
          {
            rating: "desc"
          },
          {
            createdAt: "asc"
          }
        ]
      }
    }
  });

  if (!match) {
    return null;
  }

  return {
    ...mapMatch(match),
    events: match.events.map((event) => ({
      id: event.id,
      minute: event.minute,
      type: event.type,
      playerName: event.player.name,
      teamName: event.player.team.name
    })),
    ratings: match.ratings.map((rating) => ({
      id: rating.id,
      playerName: rating.player.name,
      teamName: rating.player.team.name,
      rating: Number(rating.rating)
    }))
  };
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

export async function createMatch(input: MatchInput): Promise<MatchWithTeams> {
  ensureDatabaseConfigured();

  const seasonId = input.seasonId ?? (await getActiveSeasonId());

  const match = await prisma.match.create({
    data: {
      seasonId,
      homeTeamId: input.homeTeamId,
      awayTeamId: input.awayTeamId,
      homeScore: input.homeScore,
      awayScore: input.awayScore,
      playedAt: input.playedAt,
      venue: input.venue,
      status: input.homeScore !== null && input.homeScore !== undefined && input.awayScore !== null && input.awayScore !== undefined
        ? PrismaMatchStatus.FINISHED
        : PrismaMatchStatus.SCHEDULED
    },
    include: {
      homeTeam: true,
      awayTeam: true
    }
  });

  return mapMatch(match);
}

export async function updateMatchResult(input: MatchResultInput): Promise<string> {
  ensureDatabaseConfigured();

  const match = await prisma.match.update({
    where: {
      id: input.id
    },
    data: {
      homeScore: input.homeScore,
      awayScore: input.awayScore,
      status: PrismaMatchStatus.FINISHED
    },
    select: {
      seasonId: true
    }
  });

  return match.seasonId;
}

export async function updateMatch(input: MatchUpdateInput): Promise<string> {
  ensureDatabaseConfigured();

  const match = await prisma.match.update({
    where: {
      id: input.id
    },
    data: {
      homeTeamId: input.homeTeamId,
      awayTeamId: input.awayTeamId,
      playedAt: input.playedAt,
      venue: input.venue,
      status: input.status
    },
    select: {
      seasonId: true
    }
  });

  return match.seasonId;
}

export async function deleteMatch(id: string): Promise<string> {
  ensureDatabaseConfigured();

  const match = await prisma.match.delete({
    where: {
      id
    },
    select: {
      seasonId: true
    }
  });

  return match.seasonId;
}

export async function deleteMatchEvent(id: string): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.matchEvent.delete({
    where: {
      id
    }
  });
}

export async function createMatchEvent(input: MatchEventInput): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.matchEvent.create({
    data: {
      matchId: input.matchId,
      playerId: input.playerId,
      type: input.type,
      minute: input.minute,
      relatedPlayerId: input.relatedPlayerId || null
    }
  });
}

export async function upsertPlayerRating(input: PlayerRatingInput): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.playerRating.upsert({
    where: {
      matchId_playerId: {
        matchId: input.matchId,
        playerId: input.playerId
      }
    },
    update: {
      rating: input.rating
    },
    create: {
      matchId: input.matchId,
      playerId: input.playerId,
      rating: input.rating
    }
  });
}

export async function deletePlayerRating(id: string): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.playerRating.delete({
    where: {
      id
    }
  });
}

async function getActiveSeasonId(): Promise<string> {
  const activeSeason = await prisma.season.findFirst({
    where: {
      isActive: true
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
