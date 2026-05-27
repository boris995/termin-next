export type Team = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  foundedYear: number;
  primaryColor: string;
  logoUrl: string | null;
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

export type Season = {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

export type Match = {
  id: string;
  seasonId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  playedAt: string;
  venue: string;
  status: MatchStatus;
};

export type Standing = {
  seasonId: string;
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

export type MatchEventView = {
  id: string;
  minute: number;
  type: "GOAL" | "ASSIST" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION";
  playerName: string;
  teamName: string;
};

export type PlayerRatingView = {
  id: string;
  playerName: string;
  teamName: string;
  rating: number;
};

export type MatchReport = MatchWithTeams & {
  events: MatchEventView[];
  ratings: PlayerRatingView[];
};

export type StandingWithTeam = Standing & {
  team: Team;
  goalDifference: number;
};

export type PlayerWithTeam = Player & {
  team: Team;
};
