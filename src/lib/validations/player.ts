import { z } from "zod";

export const playerSchema = z.object({
  name: z.string().min(2).max(80),
  position: z.string().min(2).max(40),
  shirtNumber: z.coerce.number().int().min(1).max(99),
  teamId: z.string().min(1)
});

export type PlayerInput = z.infer<typeof playerSchema>;
