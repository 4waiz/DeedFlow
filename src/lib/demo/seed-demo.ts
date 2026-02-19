import type { PrismaClient } from "@prisma/client";
import {
  DealDocumentStatus,
  DealStatus,
  NotificationSeverity,
  StepStatus,
} from "@prisma/client";

const SAMPLE_DEAL_TITLE = "Marina Heights Tower";
const DEMO_ORG_DOMAIN = "demo.deedflow.local";

export async function seedDemoData(prisma: PrismaClient): Promise<void> {
  if (process.env.DEMO_MODE !== "true") {
    return;
  }

  const organization = await prisma.organization.upsert({
    where: { name: DEMO_ORG_DOMAIN },
    update: {},
    create: { name: DEMO_ORG_DOMAIN },
  });

  const manager = await prisma.user.upsert({
    where: { email: `manager@${DEMO_ORG_DOMAIN}` },
    update: {},
    create: {
      email: `manager@${DEMO_ORG_DOMAIN}`,
      name: "Demo Manager",
      role: "MANAGER",
      orgId: organization.id,
    },
  });

  const existingDeal = await prisma.deal.findFirst({
    where: {
      orgId: organization.id,
      title: SAMPLE_DEAL_TITLE,
    },
  });

  const deal =
    existingDeal ??
    (await prisma.deal.create({
      data: {
        orgId: organization.id,
        title: SAMPLE_DEAL_TITLE,
        status: DealStatus.ACTIVE,
        propertyMetaJson: {
          city: "Dubai",
          propertyType: "residential",
          tokenizationMode: "fractional",
          totalValue: 1500000,
          address: "Dubai Marina, UAE",
        },
        complianceScore: 55,
        riskScore: 25,
      },
    }));

  const steps = [
    { key: "kyc_aml", title: "KYC/AML Verification", status: StepStatus.DONE },
    { key: "title_deed", title: "Title Deed Verification", status: StepStatus.DONE },
    { key: "noc", title: "NOC Collection", status: StepStatus.IN_PROGRESS },
    { key: "valuation", title: "Property Valuation", status: StepStatus.TODO },
    { key: "escrow", title: "Escrow Setup", status: StepStatus.TODO },
    { key: "settlement", title: "Settlement", status: StepStatus.TODO },
    { key: "issuance", title: "Token/Share Issuance", status: StepStatus.TODO },
    { key: "post_close", title: "Post-Close Automation", status: StepStatus.TODO },
  ];

  for (const step of steps) {
    await prisma.dealStep.upsert({
      where: {
        dealId_key: {
          dealId: deal.id,
          key: step.key,
        },
      },
      update: {
        title: step.title,
        status: step.status,
      },
      create: {
        dealId: deal.id,
        key: step.key,
        title: step.title,
        status: step.status,
        ownerUserId: manager.id,
      },
    });
  }

  const hasDoc = await prisma.dealDocument.findFirst({
    where: { dealId: deal.id, type: "title_deed" },
  });

  if (!hasDoc) {
    await prisma.dealDocument.create({
      data: {
        dealId: deal.id,
        type: "title_deed",
        filename: "marina_heights_title_deed.pdf",
        storageKey: `demo/${deal.id}/title_deed.pdf`,
        status: DealDocumentStatus.APPROVED,
        extractedJson: {
          property_number: "DM-2025-4412",
          registered_owner: "Demo Manager",
        },
        validationJson: {
          confidence: 0.98,
          missing_required_fields: [],
          reviewed: true,
        },
      },
    });
  }

  await prisma.auditEvent.create({
    data: {
      dealId: deal.id,
      actorUserId: manager.id,
      type: "DEAL_SEEDED",
      payloadJson: {
        message: "Demo deal seeded for scripted workflow replay",
      },
    },
  });

  await prisma.notification.upsert({
    where: {
      dealId_dedupeKey: {
        dealId: deal.id,
        dedupeKey: "demo-seed-welcome",
      },
    },
    update: {},
    create: {
      dealId: deal.id,
      severity: NotificationSeverity.INFO,
      message: "Demo dataset ready for guided replay.",
      dedupeKey: "demo-seed-welcome",
    },
  });
}
