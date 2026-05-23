import { z } from "zod";

export const userUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"])
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
