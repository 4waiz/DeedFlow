import { getPrismaClient } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function createAuditEvent(input: {
  dealId: string;
  actorUserId?: string | null;
  type: string;
  payloadJson?: Prisma.InputJsonValue;
}) {
  const prisma = getPrismaClient();
  const payloadJson: Prisma.InputJsonValue = (input.payloadJson ?? {}) as Prisma.InputJsonValue;

  return prisma.auditEvent.create({
    data: {
      dealId: input.dealId,
      actorUserId: input.actorUserId ?? null,
      type: input.type,
      payloadJson,
    },
  });
}
