import { z } from "zod";

export const standingUpdateSchema = z.object({
  seasonId: z.string().min(1),
  teamId: z.string().min(1),
  played: z.coerce.number().int().min(0),
  won: z.coerce.number().int().min(0),
  drawn: z.coerce.number().int().min(0),
  lost: z.coerce.number().int().min(0),
  goalsFor: z.coerce.number().int().min(0),
  goalsAgainst: z.coerce.number().int().min(0),
  points: z.coerce.number().int().min(0)
});

export type StandingUpdateInput = z.infer<typeof standingUpdateSchema>;
