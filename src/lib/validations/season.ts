import { z } from "zod";

const seasonBaseSchema = z.object({
  name: z.string().min(2).max(80),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date()
});

export const seasonSchema = seasonBaseSchema.refine((value) => value.endsAt > value.startsAt, {
  message: "Kraj sezone mora biti poslije pocetka",
  path: ["endsAt"]
});

export type SeasonInput = z.infer<typeof seasonSchema>;

export const seasonUpdateSchema = seasonBaseSchema.extend({
  id: z.string().min(1),
  isActive: z.preprocess((value) => value === "on" || value === "true" || value === true, z.boolean())
}).refine((value) => value.endsAt > value.startsAt, {
  message: "Kraj sezone mora biti poslije pocetka",
  path: ["endsAt"]
});

export type SeasonUpdateInput = z.infer<typeof seasonUpdateSchema>;

export const seasonIdSchema = z.object({
  id: z.string().min(1)
});

export type SeasonIdInput = z.infer<typeof seasonIdSchema>;
