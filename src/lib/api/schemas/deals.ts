import { z } from "zod";
import { jsonObjectSchema } from "@/lib/api/schemas/common";

export const createDealSchema = z.object({
  title: z.string().min(3).max(150),
  propertyMetaJson: jsonObjectSchema.optional(),
});

export const updateStepSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "BLOCKED"]),
  blockingReason: z.string().max(500).nullable().optional(),
  ownerUserId: z.string().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const notificationQuerySchema = z.object({
  unreadOnly: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

export type CreateDealInput = z.infer<typeof createDealSchema>;
export type UpdateStepInput = z.infer<typeof updateStepSchema>;
