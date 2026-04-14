import { NotificationSeverity } from "@prisma/client";
import { getPrismaClient } from "@/lib/db";

export async function upsertNotification(input: {
  dealId: string;
  severity: NotificationSeverity;
  message: string;
  dedupeKey: string;
}) {
  const prisma = getPrismaClient();

  return prisma.notification.upsert({
    where: {
      dealId_dedupeKey: {
        dealId: input.dealId,
        dedupeKey: input.dedupeKey,
      },
    },
    update: {
      severity: input.severity,
      message: input.message,
    },
    create: {
      dealId: input.dealId,
      severity: input.severity,
      message: input.message,
      dedupeKey: input.dedupeKey,
    },
  });
}

export async function listDealNotifications(input: {
  dealId: string;
  orgId: string;
  unreadOnly?: boolean;
}) {
  const prisma = getPrismaClient();

  return prisma.notification.findMany({
    where: {
      dealId: input.dealId,
      deal: { orgId: input.orgId },
      ...(input.unreadOnly ? { readAt: null } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
