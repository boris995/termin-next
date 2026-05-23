import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(2).max(80),
  shortName: z.string().min(2).max(5),
  city: z.string().min(2).max(80),
  foundedYear: z.coerce.number().int().min(1850).max(new Date().getFullYear()),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#14904a")
});

export type TeamInput = z.infer<typeof teamSchema>;
