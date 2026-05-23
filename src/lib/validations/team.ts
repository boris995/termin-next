import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(2).max(80),
  shortName: z.string().min(2).max(5),
  city: z.string().min(2).max(80),
  foundedYear: z.coerce.number().int().min(1850).max(new Date().getFullYear()),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#14904a"),
  logoUrl: z.string().url().or(z.literal("")).nullable().optional()
});

export type TeamInput = z.infer<typeof teamSchema>;

export const teamUpdateSchema = teamSchema.extend({
  id: z.string().min(1)
});

export type TeamUpdateInput = z.infer<typeof teamUpdateSchema>;
