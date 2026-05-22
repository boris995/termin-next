import { z } from "zod";

export const matchSchema = z.object({
  homeTeamId: z.string().min(1),
  awayTeamId: z.string().min(1),
  homeScore: z.coerce.number().int().min(0).nullable().optional(),
  awayScore: z.coerce.number().int().min(0).nullable().optional(),
  playedAt: z.coerce.date(),
  venue: z.string().min(2).max(120)
});

export type MatchInput = z.infer<typeof matchSchema>;
