import { z } from "zod";

export const searchQuerySchema = z
  .string()
  .trim()
  .min(2, "Unesite najmanje 2 karaktera")
  .max(80, "Pretraga je preduga");

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;

export const searchTypeSchema = z.enum(["all", "players", "teams", "matches"]).default("all");

export type SearchTypeInput = z.infer<typeof searchTypeSchema>;
