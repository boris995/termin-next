import { MatchStatus as PrismaMatchStatus, Prisma } from "@prisma/client";
import { ServiceError } from "@/lib/errors";
import { ensureDatabaseConfigured, prisma } from "@/lib/db";
import type { MatchInput } from "@/lib/validations/match";
import type { MatchStatus, MatchWithTeams } from "@/types";

type MatchWithRelations = Prisma.MatchGetPayload<{
  include: {
    homeTeam: true;
    awayTeam: true;
  };
}>;

function mapMatch(match: MatchWithRelations): MatchWithTeams {
  return {
    id: match.id,
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

export async function getMatches(status?: MatchStatus): Promise<MatchWithTeams[]> {
  ensureDatabaseConfigured();

  const matches = await prisma.match.findMany({
    where: status ? { status } : undefined,
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
