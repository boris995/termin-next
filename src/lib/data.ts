import type { Match, Player, Standing, Team } from "@/types";

export const teams: Team[] = [
  {
    id: "team-termin",
    name: "Termin Junajted",
    shortName: "TER",
    city: "Sarajevo",
    foundedYear: 2018,
    primaryColor: "#14904a"
  },
  {
    id: "team-river",
    name: "Riversajd",
    shortName: "RIV",
    city: "Mostar",
    foundedYear: 2015,
    primaryColor: "#2563eb"
  },
  {
    id: "team-borac",
    name: "Borac Centar",
    shortName: "BOR",
    city: "Banja Luka",
    foundedYear: 2012,
    primaryColor: "#dc2626"
  },
  {
    id: "team-zvijezda",
    name: "Zvijezda Sjever",
    shortName: "ZVI",
    city: "Tuzla",
    foundedYear: 2020,
    primaryColor: "#9333ea"
  }
];

export const players: Player[] = [
  { id: "player-1", name: "Marko Savic", position: "Napadac", shirtNumber: 9, teamId: "team-termin", goals: 12, assists: 4, rating: 8.4 },
  { id: "player-2", name: "Adnan Kolic", position: "Vezni", shirtNumber: 10, teamId: "team-river", goals: 7, assists: 11, rating: 8.1 },
  { id: "player-3", name: "Luka Petrovic", position: "Golman", shirtNumber: 1, teamId: "team-borac", goals: 0, assists: 1, rating: 7.7 },
  { id: "player-4", name: "Emir Hadzic", position: "Krilo", shirtNumber: 11, teamId: "team-zvijezda", goals: 9, assists: 8, rating: 8.0 },
  { id: "player-5", name: "Nikola Jovanovic", position: "Stoper", shirtNumber: 5, teamId: "team-termin", goals: 2, assists: 2, rating: 7.5 },
  { id: "player-6", name: "Dino Selimovic", position: "Vezni", shirtNumber: 8, teamId: "team-borac", goals: 5, assists: 6, rating: 7.9 }
];

export const matches: Match[] = [
  {
    id: "match-1",
    homeTeamId: "team-termin",
    awayTeamId: "team-river",
    homeScore: 3,
    awayScore: 2,
    playedAt: "2026-05-18T18:00:00.000Z",
    venue: "Gradski stadion",
    status: "FINISHED"
  },
  {
    id: "match-2",
    homeTeamId: "team-borac",
    awayTeamId: "team-zvijezda",
    homeScore: 1,
    awayScore: 1,
    playedAt: "2026-05-19T19:30:00.000Z",
    venue: "Arena Centar",
    status: "FINISHED"
  },
  {
    id: "match-3",
    homeTeamId: "team-river",
    awayTeamId: "team-borac",
    homeScore: null,
    awayScore: null,
    playedAt: "2026-05-25T17:00:00.000Z",
    venue: "Riversajd park",
    status: "SCHEDULED"
  },
  {
    id: "match-4",
    homeTeamId: "team-zvijezda",
    awayTeamId: "team-termin",
    homeScore: null,
    awayScore: null,
    playedAt: "2026-05-26T20:00:00.000Z",
    venue: "Sjeverni teren",
    status: "SCHEDULED"
  }
];

export const standings: Standing[] = [
  { teamId: "team-termin", played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 21, goalsAgainst: 10, points: 19 },
  { teamId: "team-river", played: 8, won: 5, drawn: 1, lost: 2, goalsFor: 18, goalsAgainst: 13, points: 16 },
  { teamId: "team-borac", played: 8, won: 3, drawn: 3, lost: 2, goalsFor: 12, goalsAgainst: 10, points: 12 },
  { teamId: "team-zvijezda", played: 8, won: 1, drawn: 1, lost: 6, goalsFor: 9, goalsAgainst: 27, points: 4 }
];
