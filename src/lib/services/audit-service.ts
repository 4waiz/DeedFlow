import { prisma } from "@/lib/db";

export async function createAuditEvent(input: {
  dealId: string;
  actorUserId?: string | null;
  type: string;
  payloadJson?: Record<string, unknown>;
}) {
  return prisma.auditEvent.create({
    data: {
      dealId: input.dealId,
      actorUserId: input.actorUserId ?? null,
      type: input.type,
      payloadJson: input.payloadJson ?? {},
    },
  });
}
