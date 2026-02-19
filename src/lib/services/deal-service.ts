import { DealStatus, NotificationSeverity, Prisma, StepStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createAuditEvent } from "@/lib/services/audit-service";
import { upsertNotification } from "@/lib/services/notification-service";

const DEFAULT_DEAL_STEPS = [
  { key: "kyc_aml", title: "KYC/AML Verification" },
  { key: "title_deed", title: "Title Deed Verification" },
  { key: "noc", title: "NOC Collection" },
  { key: "valuation", title: "Property Valuation" },
  { key: "escrow", title: "Escrow Setup" },
  { key: "settlement", title: "Settlement" },
  { key: "issuance", title: "Token/Share Issuance" },
  { key: "post_close", title: "Post-Close Automation" },
] as const;

export async function listDealsForOrg(orgId: string) {
  const deals = await prisma.deal.findMany({
    where: { orgId },
    include: {
      steps: {
        select: { status: true },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return deals.map((deal) => {
    const stepsDone = deal.steps.filter((step) => step.status === StepStatus.DONE).length;
    return {
      id: deal.id,
      orgId: deal.orgId,
      title: deal.title,
      status: deal.status,
      complianceScore: deal.complianceScore,
      riskScore: deal.riskScore,
      stepsDone,
      totalSteps: deal.steps.length,
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt,
      propertyMetaJson: deal.propertyMetaJson,
    };
  });
}

export async function createDealForOrg(input: {
  orgId: string;
  title: string;
  propertyMetaJson?: Prisma.InputJsonValue;
  actorUserId?: string | null;
}) {
  const propertyMetaJson: Prisma.InputJsonValue = (input.propertyMetaJson ?? {}) as Prisma.InputJsonValue;

  const deal = await prisma.deal.create({
    data: {
      orgId: input.orgId,
      title: input.title,
      status: DealStatus.DRAFT,
      propertyMetaJson,
      complianceScore: 0,
      riskScore: 0,
      steps: {
        create: DEFAULT_DEAL_STEPS.map((step) => ({
          key: step.key,
          title: step.title,
          status: StepStatus.TODO,
          ownerUserId: input.actorUserId ?? null,
        })),
      },
    },
    include: {
      steps: true,
    },
  });

  await createAuditEvent({
    dealId: deal.id,
    actorUserId: input.actorUserId ?? null,
    type: "DEAL_CREATED",
    payloadJson: {
      title: deal.title,
      status: deal.status,
    },
  });

  return deal;
}

export async function getDealByIdForOrg(input: { orgId: string; dealId: string }) {
  return prisma.deal.findFirst({
    where: {
      id: input.dealId,
      orgId: input.orgId,
    },
    include: {
      steps: {
        orderBy: {
          createdAt: "asc",
        },
      },
      documents: {
        orderBy: {
          createdAt: "desc",
        },
      },
      auditEvents: {
        orderBy: {
          createdAt: "desc",
        },
      },
      notifications: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function updateDealStepForOrg(input: {
  orgId: string;
  dealId: string;
  stepId: string;
  status: StepStatus;
  blockingReason?: string | null;
  ownerUserId?: string | null;
  dueDate?: Date | null;
  actorUserId?: string | null;
}) {
  const step = await prisma.dealStep.findFirst({
    where: {
      id: input.stepId,
      dealId: input.dealId,
      deal: {
        orgId: input.orgId,
      },
    },
  });

  if (!step) {
    return null;
  }

  const updatedStep = await prisma.dealStep.update({
    where: { id: step.id },
    data: {
      status: input.status,
      blockingReason: input.blockingReason ?? null,
      ownerUserId: input.ownerUserId ?? step.ownerUserId,
      dueDate: input.dueDate ?? step.dueDate,
    },
  });

  await createAuditEvent({
    dealId: input.dealId,
    actorUserId: input.actorUserId ?? null,
    type: "STEP_STATUS_CHANGED",
    payloadJson: {
      stepId: updatedStep.id,
      key: updatedStep.key,
      status: updatedStep.status,
      blockingReason: updatedStep.blockingReason,
    },
  });

  if (updatedStep.status === StepStatus.BLOCKED) {
    await upsertNotification({
      dealId: input.dealId,
      severity: NotificationSeverity.WARNING,
      message: `${updatedStep.title} is blocked.`,
      dedupeKey: `step-blocked-${updatedStep.id}`,
    });
  }

  return updatedStep;
}
