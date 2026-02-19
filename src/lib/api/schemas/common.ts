import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const stepParamSchema = z.object({
  id: z.string().min(1),
  stepId: z.string().min(1),
});

export const jsonObjectSchema = z.record(z.string(), z.any()).default({});
