import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(2).max(120).optional(),
  password: z.string().min(8).max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;
