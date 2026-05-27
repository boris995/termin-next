import { ensureDatabaseConfigured, prisma } from "@/lib/db";
import type { SearchQueryInput } from "@/lib/validations/search";
import type { MatchWithTeams, PlayerWithTeam, Team } from "@/types";

export type SearchResults = {
  players: PlayerWithTeam[];
  teams: Team[];
  matches: MatchWithTeams[];
};

export type SearchSuggestion = {
  href: string;
  id: string;
  label: string;
  meta: string;
  type: "Igrac" | "Tim" | "Utakmica";
};

export async function searchSite(query: SearchQueryInput): Promise<SearchResults> {
  ensureDatabaseConfigured();

  const [players, teams, matches] = await Promise.all([
    prisma.player.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            position: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            team: {
              name: {
                contains: query,
                mode: "insensitive"
              }
            }
          }
        ]
      },
      include: {
        team: true,
        events: true,
        ratings: true
      },
      orderBy: {
        name: "asc"
      },
      take: 12
    }),
    prisma.team.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            shortName: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            city: {
              contains: query,
              mode: "insensitive"
            }
          }
        ]
      },
      orderBy: {
        name: "asc"
      },
      take: 12
    }),
    prisma.match.findMany({
      where: {
        OR: [
          {
            venue: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            homeTeam: {
              name: {
                contains: query,
                mode: "insensitive"
              }
            }
          },
          {
            awayTeam: {
              name: {
                contains: query,
                mode: "insensitive"
              }
            }
          }
        ]
      },
      include: {
        homeTeam: true,
        awayTeam: true
      },
      orderBy: {
        playedAt: "desc"
      },
      take: 12
    })
  ]);

  return {
    players: players.map((player) => {
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
    }),
    teams,
    matches: matches.map((match) => ({
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
    }))
  };
}

export async function getSearchSuggestions(query: SearchQueryInput): Promise<SearchSuggestion[]> {
  const results = await searchSite(query);
  const playerSuggestions = results.players.slice(0, 4).map((player) => ({
    href: `/players/${player.id}`,
    id: player.id,
    label: player.name,
    meta: `${player.team.name} - ${player.position}`,
    type: "Igrac" as const
  }));
  const teamSuggestions = results.teams.slice(0, 4).map((team) => ({
    href: `/teams/${team.id}`,
    id: team.id,
    label: team.name,
    meta: `${team.city} - ${team.shortName}`,
    type: "Tim" as const
  }));
  const matchSuggestions = results.matches.slice(0, 4).map((match) => ({
    href: `/matches/${match.id}`,
    id: match.id,
    label: `${match.homeTeam.name} - ${match.awayTeam.name}`,
    meta: match.venue,
    type: "Utakmica" as const
  }));

  return [...playerSuggestions, ...teamSuggestions, ...matchSuggestions].slice(0, 8);
}
