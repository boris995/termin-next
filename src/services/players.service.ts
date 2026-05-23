import { ensureDatabaseConfigured, prisma } from "@/lib/db";
import type { PlayerInput } from "@/lib/validations/player";
import type { PlayerWithTeam } from "@/types";

export async function getPlayers(): Promise<PlayerWithTeam[]> {
  ensureDatabaseConfigured();

  const players = await prisma.player.findMany({
    include: {
      team: true,
      events: true,
      ratings: true
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

export async function deletePlayer(id: string): Promise<void> {
  ensureDatabaseConfigured();

  await prisma.player.delete({
    where: {
      id
    }
  });
}
