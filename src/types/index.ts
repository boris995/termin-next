export type Team = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  foundedYear: number;
  primaryColor: string;
};

export type Player = {
  id: string;
  name: string;
  position: string;
  shirtNumber: number;
  teamId: string;
  goals: number;
  assists: number;
  rating: number;
};

export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED";

export type Match = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  playedAt: string;
  venue: string;
  status: MatchStatus;
};

export type Standing = {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export type MatchWithTeams = Match & {
  homeTeam: Team;
  awayTeam: Team;
};

export type StandingWithTeam = Standing & {
  team: Team;
  goalDifference: number;
};

export type PlayerWithTeam = Player & {
  team: Team;
};
