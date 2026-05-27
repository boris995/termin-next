import { ensureDatabaseConfigured, prisma } from "@/lib/db";
import type { PlayerInput, PlayerUpdateInput } from "@/lib/validations/player";
import type { MatchEventView, MatchStatus, PlayerRatingView, PlayerWithTeam, Team } from "@/types";

export type PlayerProfileMatch = {
  id: string;
  playedAt: string;
  venue: string;
  status: MatchStatus;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  events: MatchEventView[];
  rating: PlayerRatingView | null;
};

export type PlayerProfile = PlayerWithTeam & {
  appearances: number;
  yellowCards: number;
  redCards: number;
  matches: PlayerProfileMatch[];
};

export async function getPlayers(seasonId?: string, teamId?: string): Promise<PlayerWithTeam[]> {
  ensureDatabaseConfigured();

  const players = await prisma.player.findMany({
    where: teamId
      ? {
          teamId
        }
      : undefined,
    include: {
      team: true,
      events: seasonId
        ? {
            where: {
              match: {
                seasonId
              }
            }
          }
        : true,
      ratings: seasonId
        ? {
            where: {
              match: {
                seasonId
              }
            }
          }
        : true
    },
    orderBy: {
      name: "asc"
    }
  });

  return players
    .map((player) => {
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
    })
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists || b.rating - a.rating);
}

export async function getTopPlayers(limit = 4): Promise<PlayerWithTeam[]> {
  const allPlayers = await getPlayers();
  return allPlayers.slice(0, limit);
}

export async function getPlayerProfile(id: string, seasonId?: string): Promise<PlayerProfile | null> {
  ensureDatabaseConfigured();

  const player = await prisma.player.findUnique({
    where: {
      id
    },
    include: {
      team: true,
      events: {
        ...(seasonId
          ? {
              where: {
                match: {
                  seasonId
                }
              }
            }
          : {}),
        include: {
          match: {
            include: {
              homeTeam: true,
              awayTeam: true
            }
          }
        },
        orderBy: [
          {
            match: {
              playedAt: "desc"
            }
          },
          {
            minute: "asc"
          }
        ]
      },
      ratings: {
        ...(seasonId
          ? {
              where: {
                match: {
                  seasonId
                }
              }
            }
          : {}),
        include: {
          match: {
            include: {
              homeTeam: true,
              awayTeam: true
            }
          }
        },
        orderBy: {
          match: {
            playedAt: "desc"
          }
        }
      }
    }
  });

  if (!player) {
    return null;
  }

  const goals = player.events.filter((event) => event.type === "GOAL").length;
  const assists = player.events.filter((event) => event.type === "ASSIST").length;
  const yellowCards = player.events.filter((event) => event.type === "YELLOW_CARD").length;
  const redCards = player.events.filter((event) => event.type === "RED_CARD").length;
  const ratingSum = player.ratings.reduce((sum, rating) => sum + Number(rating.rating), 0);
  const rating = player.ratings.length > 0 ? ratingSum / player.ratings.length : 0;
  const matchIds = new Set([...player.events.map((event) => event.matchId), ...player.ratings.map((playerRating) => playerRating.matchId)]);
  const matchesById = new Map<string, PlayerProfileMatch>();

  for (const event of player.events) {
    const existingMatch = matchesById.get(event.match.id);

    if (existingMatch) {
      existingMatch.events.push({
        id: event.id,
        minute: event.minute,
        type: event.type,
        playerName: player.name,
        teamName: player.team.name
      });
      continue;
    }

    matchesById.set(event.match.id, {
      id: event.match.id,
      playedAt: event.match.playedAt.toISOString(),
      venue: event.match.venue,
      status: event.match.status,
      homeTeam: event.match.homeTeam,
      awayTeam: event.match.awayTeam,
      homeScore: event.match.homeScore,
      awayScore: event.match.awayScore,
      events: [
        {
          id: event.id,
          minute: event.minute,
          type: event.type,
          playerName: player.name,
          teamName: player.team.name
        }
      ],
      rating: null
    });
  }

  for (const playerRating of player.ratings) {
    const existingMatch = matchesById.get(playerRating.match.id);
    const ratingView = {
      id: playerRating.id,
      playerName: player.name,
      teamName: player.team.name,
      rating: Number(playerRating.rating)
    };

    if (existingMatch) {
      existingMatch.rating = ratingView;
      continue;
    }

    matchesById.set(playerRating.match.id, {
      id: playerRating.match.id,
      playedAt: playerRating.match.playedAt.toISOString(),
      venue: playerRating.match.venue,
      status: playerRating.match.status,
      homeTeam: playerRating.match.homeTeam,
      awayTeam: playerRating.match.awayTeam,
      homeScore: playerRating.match.homeScore,
      awayScore: playerRating.match.awayScore,
      events: [],
      rating: ratingView
    });
  }

  return {
    id: player.id,
    name: player.name,
    position: player.position,
    shirtNumber: player.shirtNumber,
    teamId: player.teamId,
    goals,
    assists,
    rating,
    team: player.team,
    appearances: matchIds.size,
    yellowCards,
    redCards,
    matches: [...matchesById.values()].sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
  };
}

export async function createPlayer(input: PlayerInput): Promise<PlayerWithTeam> {
  ensureDatabaseConfigured();

  const player = await prisma.player.create({
    data: input,
    include: {
      team: true
    }
  });

  return {
    id: player.id,
    name: player.name,
    position: player.position,
    shirtNumber: player.shirtNumber,
    teamId: player.teamId,
    goals: 0,
    assists: 0,
    rating: 0,
    team: player.team
  };
}

export async function updatePlayer(input: PlayerUpdateInput): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.player.update({
    where: {
      id: input.id
    },
    data: {
      name: input.name,
      position: input.position,
      shirtNumber: input.shirtNumber,
      teamId: input.teamId
    }
  });
}

export async function deletePlayer(id: string): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.player.delete({
    where: {
      id
    }
  });
}
