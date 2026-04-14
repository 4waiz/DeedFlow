import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Document titles per type
const docTitles: Record<string, string> = {
  emirates_id: "Emirates ID",
  passport: "Passport Details",
  title_deed: "Title Deed",
  noc: "No Objection Certificate (NOC)",
  valuation_report: "Property Valuation Report",
  kyc_doc: "KYC Verification Document",
  escrow_agreement: "Escrow Agreement",
  spa: "Sale & Purchase Agreement (SPA)",
  power_of_attorney: "Power of Attorney",
};

// Field display labels
const fieldLabels: Record<string, string> = {
  full_name: "Full Name",
  id_number: "ID Number",
  nationality: "Nationality",
  date_of_birth: "Date of Birth",
  expiry_date: "Expiry Date",
  gender: "Gender",
  issuing_authority: "Issuing Authority",
  passport_number: "Passport Number",
  place_of_issue: "Place of Issue",
  type: "Document Type",
  property_number: "Property Number",
  plot_number: "Plot Number",
  area: "Area / Location",
  city: "City",
  size_sqft: "Size (sq ft)",
  registered_owner: "Registered Owner",
  registration_date: "Registration Date",
  deed_type: "Deed Type",
  noc_number: "NOC Number",
  issuer: "Issuer",
  property_reference: "Property Reference",
  issued_date: "Issued Date",
  valid_until: "Valid Until",
  status: "Status",
  conditions: "Conditions",
  authorized_signatory: "Authorized Signatory",
  report_number: "Report Number",
  property_address: "Property Address",
  valuation_date: "Valuation Date",
  market_value_aed: "Market Value (AED)",
  property_type: "Property Type",
  built_up_area: "Built-Up Area",
  valuator: "Valuator",
  methodology: "Valuation Methodology",
  document_type: "Document Type",
  applicant_name: "Applicant Name",
  verification_status: "Verification Status",
  risk_level: "Risk Level",
  pep_check: "PEP Check",
  sanctions_check: "Sanctions Check",
  source_of_funds: "Source of Funds",
  verification_date: "Verification Date",
  agreement_number: "Agreement Number",
  escrow_agent: "Escrow Agent",
  total_amount_aed: "Total Amount (AED)",
  buyer_name: "Buyer Name",
  seller_name: "Seller Name",
  effective_date: "Effective Date",
  release_conditions: "Release Conditions",
  seller: "Seller",
  buyer: "Buyer",
  property: "Property",
  sale_price_aed: "Sale Price (AED)",
  payment_plan: "Payment Plan",
  completion_date: "Completion Date",
  governing_law: "Governing Law",
  poa_number: "POA Number",
  principal: "Principal",
  attorney: "Attorney",
  scope: "Scope",
  notarized_by: "Notarized By",
};

export async function POST(request: NextRequest) {
  try {
    const { docType, fields } = await request.json();

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = 595.28; // A4
    const pageHeight = 841.89;
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // Header bar
    page.drawRectangle({
      x: 0,
      y: pageHeight - 80,
      width: pageWidth,
      height: 80,
      color: rgb(0.047, 0.059, 0.102), // #0c0f1a
    });

    // Logo text
    page.drawText("DeedFlow", {
      x: margin,
      y: pageHeight - 45,
      size: 22,
      font: fontBold,
      color: rgb(0.063, 0.725, 0.506), // emerald
    });

    // Subtitle
    page.drawText("UAE Real Estate Compliance Platform", {
      x: margin,
      y: pageHeight - 62,
      size: 9,
      font,
      color: rgb(0.6, 0.6, 0.6),
    });

    // Date on right
    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const dateWidth = font.widthOfTextAtSize(dateStr, 9);
    page.drawText(dateStr, {
      x: pageWidth - margin - dateWidth,
      y: pageHeight - 45,
      size: 9,
      font,
      color: rgb(0.6, 0.6, 0.6),
    });

    y = pageHeight - 110;

    // Document title
    const title = docTitles[docType] || docType.replace(/_/g, " ");
    page.drawText(title.toUpperCase(), {
      x: margin,
      y,
      size: 16,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 8;

    // Underline
    page.drawRectangle({
      x: margin,
      y,
      width: contentWidth,
      height: 2,
      color: rgb(0.063, 0.725, 0.506),
    });
    y -= 25;

    // Auto-filled badge
    page.drawText("AUTO-FILLED BY DEEDFLOW AI", {
      x: margin,
      y,
      size: 8,
      font: fontBold,
      color: rgb(0.063, 0.725, 0.506),
    });
    y -= 20;

    // Fields
    const entries = Object.entries(fields).filter(([key]) => !key.startsWith("_"));

    for (const [key, value] of entries) {
      // Check if we need a new page
      if (y < margin + 40) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }

      const label = fieldLabels[key] || key.replace(/_/g, " ");
      const valueStr = String(value);

      // Field label
      page.drawText(label, {
        x: margin,
        y,
        size: 9,
        font: fontBold,
        color: rgb(0.4, 0.4, 0.4),
      });
      y -= 16;

      // Field value
      page.drawText(valueStr, {
        x: margin,
        y,
        size: 12,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= 8;

      // Separator line
      page.drawRectangle({
        x: margin,
        y,
        width: contentWidth,
        height: 0.5,
        color: rgb(0.9, 0.9, 0.9),
      });
      y -= 18;
    }

    // Footer
    y = margin;
    page.drawRectangle({
      x: margin,
      y: y + 10,
      width: contentWidth,
      height: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });

    const footerText = "Generated by DeedFlow — AI-powered UAE real estate compliance";
    const footerWidth = font.widthOfTextAtSize(footerText, 7);
    page.drawText(footerText, {
      x: (pageWidth - footerWidth) / 2,
      y,
      size: 7,
      font,
      color: rgb(0.6, 0.6, 0.6),
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${docType}_filled_${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { success: false, error: "PDF generation failed" },
      { status: 500 }
    );
  }
}
