import { NextRequest, NextResponse } from "next/server";
import { createMockDeals } from "@/lib/mock-data";
import { Deal } from "@/lib/types";

// In-memory store for server-side
let deals: Deal[] | null = null;

function getDeals(): Deal[] {
  if (!deals) {
    deals = createMockDeals();
  }
  return deals;
}

export async function GET() {
  const allDeals = getDeals();
  const summary = allDeals.map((d) => ({
    id: d.id,
    name: d.name,
    nameAr: d.nameAr,
    city: d.city,
    status: d.status,
    tokenizationMode: d.tokenizationMode,
    totalValue: d.totalValue,
    complianceScore: d.metrics.complianceScore,
    stepsCompleted: d.steps.filter((s) => s.status === "done").length,
    totalSteps: d.steps.length,
  }));
  return NextResponse.json(summary);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const allDeals = getDeals();

  const newDeal: Deal = {
    id: `deal-${String(allDeals.length + 1).padStart(3, "0")}`,
    name: body.name || "New Property Deal",
    nameAr: body.nameAr || "صفقة عقارية جديدة",
    city: body.city || "Dubai",
    propertyType: body.propertyType || "residential",
    tokenizationMode: body.tokenizationMode || "fractional",
    totalShares: body.totalShares || 100,
    sharePrice: body.sharePrice || 10000,
    currency: "AED",
    totalValue: (body.totalShares || 100) * (body.sharePrice || 10000),
    propertyAddress: body.propertyAddress || "Dubai, UAE",
    propertyAddressAr: body.propertyAddressAr || "دبي، الإمارات",
    status: "draft",
    createdAt: new Date().toISOString(),
    parties: [
      {
        id: `p-${Date.now()}`,
        name: body.sellerName || "Property Owner",
        role: "seller" as const,
        sharePercent: 100,
        kycStatus: "pending" as const,
        email: body.sellerEmail || "owner@example.ae",
      },
    ],
    steps: [
      { id: `s-${Date.now()}-1`, title: "KYC/AML Verification", titleAr: "التحقق من الهوية ومكافحة غسيل الأموال", status: "todo", requiredDocs: ["kyc_doc", "passport"], notes: [], order: 1 },
      { id: `s-${Date.now()}-2`, title: "Title Deed Verification", titleAr: "التحقق من سند الملكية", status: "todo", requiredDocs: ["title_deed"], notes: [], order: 2 },
      { id: `s-${Date.now()}-3`, title: "NOC Collection", titleAr: "جمع شهادات عدم الممانعة", status: "todo", requiredDocs: ["noc"], notes: [], order: 3 },
      { id: `s-${Date.now()}-4`, title: "Property Valuation", titleAr: "تقييم العقار", status: "todo", requiredDocs: ["valuation_report"], notes: [], order: 4 },
      { id: `s-${Date.now()}-5`, title: "Escrow Setup", titleAr: "إعداد حساب الضمان", status: "todo", requiredDocs: ["escrow_agreement"], notes: [], order: 5 },
      { id: `s-${Date.now()}-6`, title: "Settlement", titleAr: "التسوية", status: "todo", requiredDocs: ["spa"], notes: [], order: 6 },
      { id: `s-${Date.now()}-7`, title: "Token/Share Issuance", titleAr: "إصدار الحصص/الرموز", status: "todo", requiredDocs: [], notes: [], order: 7 },
      { id: `s-${Date.now()}-8`, title: "Post-Close Automation", titleAr: "أتمتة ما بعد الإغلاق", status: "todo", requiredDocs: [], notes: [], order: 8 },
    ],
    docs: [],
    audit: [
      { ts: new Date().toISOString(), actor: "System", action: "Deal Created", detail: `New deal "${body.name || "New Property Deal"}" created — yalla let's go!`, emoji: "🏡" },
    ],
    fieldReports: [],
    metrics: { complianceScore: 0, riskScore: 30, estTimeToCloseDays: 30 },
  };

  allDeals.push(newDeal);
  return NextResponse.json(newDeal, { status: 201 });
}
