import { z } from "zod";

const nullableScore = z.preprocess((value) => (value === "" ? null : value), z.coerce.number().int().min(0).nullable().optional());

export const matchSchema = z.object({
  seasonId: z.string().min(1).optional(),
  homeTeamId: z.string().min(1),
  awayTeamId: z.string().min(1),
  homeScore: nullableScore,
  awayScore: nullableScore,
  playedAt: z.coerce.date(),
  venue: z.string().min(2).max(120)
}).refine((value) => value.homeTeamId !== value.awayTeamId, {
  message: "Domaci i gostujuci tim ne mogu biti isti",
  path: ["awayTeamId"]
});

export type MatchInput = z.infer<typeof matchSchema>;

export const matchResultSchema = z.object({
  id: z.string().min(1),
  homeScore: z.coerce.number().int().min(0),
  awayScore: z.coerce.number().int().min(0)
});

export type MatchResultInput = z.infer<typeof matchResultSchema>;

export const matchUpdateSchema = z.object({
  id: z.string().min(1),
  homeTeamId: z.string().min(1),
  awayTeamId: z.string().min(1),
  playedAt: z.coerce.date(),
  venue: z.string().min(2).max(120),
  status: z.enum(["SCHEDULED", "LIVE", "FINISHED"])
}).refine((value) => value.homeTeamId !== value.awayTeamId, {
  message: "Domaci i gostujuci tim ne mogu biti isti",
  path: ["awayTeamId"]
});

export type MatchUpdateInput = z.infer<typeof matchUpdateSchema>;

export const matchItemDeleteSchema = z.object({
  id: z.string().min(1)
});

export type MatchItemDeleteInput = z.infer<typeof matchItemDeleteSchema>;

export const matchEventSchema = z.object({
  matchId: z.string().min(1),
  playerId: z.string().min(1),
  type: z.enum(["GOAL", "ASSIST", "YELLOW_CARD", "RED_CARD", "SUBSTITUTION"]),
  minute: z.coerce.number().int().min(0).max(130),
  relatedPlayerId: z.string().optional().nullable()
});

export type MatchEventInput = z.infer<typeof matchEventSchema>;

export const playerRatingSchema = z.object({
  matchId: z.string().min(1),
  playerId: z.string().min(1),
  rating: z.coerce.number().min(1).max(10)
});

export type PlayerRatingInput = z.infer<typeof playerRatingSchema>;
