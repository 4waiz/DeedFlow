import { NextRequest, NextResponse } from "next/server";
import { DealDoc } from "@/lib/types";
import { requireApiSession } from "@/lib/auth/require-session";

// Mock extracted fields based on document type
const mockExtractedFields: Record<string, Record<string, string>> = {
  title_deed: { property_id: "DXB-2025-4412", owner: "Extracted Owner Name", area_sqft: "1,850", plot_no: "P-7842" },
  noc: { developer: "Emaar Properties", property: "DXB-2025-4412", status: "No Objection", valid_until: "2026-01-15" },
  valuation_report: { valuer: "JLL UAE", value_aed: "1,750,000", method: "DCF + Comparable Sales", date: new Date().toISOString().split("T")[0] },
  kyc_doc: { risk_level: "Low", source_of_funds: "Business Income", pep_status: "No", sanctions_check: "Clear" },
  escrow_agreement: { bank: "Emirates NBD", account: "ESC-2025-NEW", amount: "Pending", release_conditions: "SPA completion" },
  spa: { parties: "Seller + Buyer(s)", property: "DXB-2025-4412", price: "As per deal terms", completion_date: "TBD" },
  passport: { full_name: "Extracted Name", nationality: "UAE", passport_no: "P1234567", expiry: "2028-12-31" },
  emirates_id: { full_name: "Extracted Name", id_number: "784-XXXX-XXXXXXX-X", expiry: "2027-06-30" },
  power_of_attorney: { grantor: "Extracted Grantor", grantee: "Extracted Grantee", scope: "Property sale", valid_until: "2026-06-30" },
};

export async function POST(req: NextRequest) {
  const auth = await requireApiSession("documents:upload");
  if (!auth.ok) {
    return auth.response;
  }

  const body = await req.json();
  const { dealId, docType, filename, uploadedBy } = body;

  if (!dealId || !docType || !filename) {
    return NextResponse.json({ error: "Missing required fields: dealId, docType, filename" }, { status: 400 });
  }

  const newDoc: DealDoc = {
    id: `doc-${Date.now()}`,
    type: docType,
    filename: filename || `${docType}_${Date.now()}.pdf`,
    uploadedAt: new Date().toISOString(),
    extractedFields: mockExtractedFields[docType] || { note: "No extraction rules for this doc type" },
    verificationStatus: "pending",
    uploadedBy: uploadedBy || "Unknown",
  };

  return NextResponse.json({
    doc: newDoc,
    message: `Document "${filename}" uploaded and fields extracted. Verification pending.`,
  });
}
