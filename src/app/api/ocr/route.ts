import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth/require-session";

// Expected fields per document type — Groq AI will extract these from raw OCR text
const expectedFieldsMap: Record<string, string[]> = {
  emirates_id: ["full_name", "id_number", "nationality", "date_of_birth", "expiry_date", "gender", "issuing_authority"],
  passport: ["full_name", "passport_number", "nationality", "date_of_birth", "expiry_date", "place_of_issue", "type"],
  title_deed: ["property_number", "plot_number", "area", "city", "size_sqft", "registered_owner", "registration_date", "deed_type"],
  noc: ["noc_number", "issuer", "property_reference", "issued_date", "valid_until", "status", "conditions", "authorized_signatory"],
  valuation_report: ["report_number", "property_address", "valuation_date", "market_value_aed", "property_type", "built_up_area", "valuator", "methodology"],
  kyc_doc: ["document_type", "applicant_name", "verification_status", "risk_level", "pep_check", "sanctions_check", "source_of_funds", "verification_date"],
  escrow_agreement: ["agreement_number", "escrow_agent", "total_amount_aed", "buyer_name", "seller_name", "effective_date", "release_conditions"],
  spa: ["agreement_number", "seller", "buyer", "property", "sale_price_aed", "payment_plan", "completion_date", "governing_law"],
  power_of_attorney: ["poa_number", "principal", "attorney", "scope", "effective_date", "expiry_date", "notarized_by"],
};

// Mock OCR results for different document types (used in demo mode)
const mockOcrResults: Record<string, Record<string, string>> = {
  emirates_id: {
    full_name: "Ahmed Al Maktoum",
    id_number: "784-1990-1234567-1",
    nationality: "UAE",
    date_of_birth: "15/03/1990",
    expiry_date: "21/06/2028",
    card_number: "ID-2024-78412",
    gender: "Male",
    issuing_authority: "Federal Authority for Identity & Citizenship",
  },
  passport: {
    full_name: "Sarah Johnson",
    passport_number: "P12345678",
    nationality: "United Kingdom",
    date_of_birth: "22/07/1985",
    expiry_date: "15/09/2029",
    place_of_issue: "London",
    type: "P",
    mrz_line_1: "P<GBSJOHNSON<<SARAH<<<<<<<<<<<<<<<<<<<<<<<<",
    mrz_line_2: "P123456789GBR8507224F2909159<<<<<<<<<<<<<<06",
  },
  title_deed: {
    property_number: "DM-2024-45892",
    plot_number: "345-JBR-12",
    area: "Jumeirah Beach Residence",
    city: "Dubai",
    size_sqft: "1,250",
    registered_owner: "Marina Heights LLC",
    registration_date: "12/01/2024",
    land_department: "Dubai Land Department",
    deed_type: "Freehold",
  },
  noc: {
    noc_number: "NOC-2024-7891",
    issuer: "Emaar Properties",
    property_reference: "DM-2024-45892",
    issued_date: "05/02/2025",
    valid_until: "05/08/2025",
    status: "Approved",
    conditions: "No outstanding service charges",
    authorized_signatory: "Mohammed Al Rashid",
  },
  valuation_report: {
    report_number: "VAL-2024-3456",
    property_address: "Unit 1205, Marina Heights, JBR",
    valuation_date: "28/01/2025",
    market_value_aed: "4,250,000",
    property_type: "Residential Apartment",
    built_up_area: "1,250 sq ft",
    valuator: "RICS Chartered Surveyors UAE",
    methodology: "Comparable Sales Approach",
  },
  kyc_doc: {
    document_type: "KYC Verification Form",
    applicant_name: "Ahmed Al Maktoum",
    verification_status: "Passed",
    risk_level: "Low",
    pep_check: "Clear",
    sanctions_check: "Clear",
    source_of_funds: "Employment Income",
    verification_date: "20/01/2025",
  },
  escrow_agreement: {
    agreement_number: "ESC-2024-8901",
    escrow_agent: "Emirates NBD Escrow Services",
    total_amount_aed: "4,250,000",
    buyer_name: "Ahmed Al Maktoum",
    seller_name: "Marina Heights LLC",
    effective_date: "01/02/2025",
    release_conditions: "Title transfer completion",
    bank_account: "ENBD-ESC-****7892",
  },
  spa: {
    agreement_number: "SPA-2024-5678",
    seller: "Marina Heights LLC",
    buyer: "Ahmed Al Maktoum",
    property: "Unit 1205, Marina Heights Tower, JBR",
    sale_price_aed: "4,250,000",
    payment_plan: "60% upfront, 40% on completion",
    completion_date: "30/06/2025",
    governing_law: "UAE Federal Law",
  },
  power_of_attorney: {
    poa_number: "POA-2024-2345",
    principal: "Ahmed Al Maktoum",
    attorney: "Sarah Johnson (Legal Consultant)",
    scope: "Property sale and transfer",
    effective_date: "15/01/2025",
    expiry_date: "15/01/2026",
    notarized_by: "Dubai Courts Notary Public",
    notarization_date: "15/01/2025",
  },
};

interface TraceWord {
  value: string;
  confidence: number;
  geometry: number[];
}

interface TraceLine {
  geometry: number[];
  words: TraceWord[];
}

interface TraceBlock {
  geometry: number[];
  lines: TraceLine[];
}

interface TracePage {
  blocks: TraceBlock[];
}

interface TraceResult {
  name: string;
  dimensions: number[];
  pages: TracePage[];
}

function parseTraceOcrResponse(
  result: TraceResult,
  docType: string
): { extractedText: string; extractedFields: Record<string, string>; confidence: number } {
  const allWords: { value: string; confidence: number }[] = [];

  for (const page of result.pages) {
    for (const block of page.blocks) {
      for (const line of block.lines) {
        for (const word of line.words) {
          allWords.push({ value: word.value, confidence: word.confidence });
        }
      }
    }
  }

  const fullLines: string[] = [];
  for (const page of result.pages) {
    for (const block of page.blocks) {
      for (const line of block.lines) {
        fullLines.push(line.words.map((w) => w.value).join(" "));
      }
    }
  }

  const extractedText = fullLines.join("\n");
  const avgConfidence =
    allWords.length > 0
      ? allWords.reduce((sum, w) => sum + w.confidence, 0) / allWords.length
      : 0;

  const extractedFields: Record<string, string> = {
    ocr_engine: "Trace OCR",
    total_words: String(allWords.length),
    avg_confidence: `${(avgConfidence * 100).toFixed(1)}%`,
    document_type: docType,
    raw_text_preview: extractedText.slice(0, 200) + (extractedText.length > 200 ? "..." : ""),
  };

  return { extractedText, extractedFields, confidence: avgConfidence };
}

// AI field extraction using Groq — takes raw OCR text and extracts structured fields
async function extractFieldsWithGroq(
  rawText: string,
  docType: string
): Promise<Record<string, string> | null> {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) return null;

  const expectedFields = expectedFieldsMap[docType];
  if (!expectedFields) return null;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              'You are a UAE real estate document data extractor. Extract structured fields from OCR-scanned text. Return ONLY a valid JSON object with the requested field names as keys and their extracted values as strings. If a field cannot be found in the text, use "N/A".',
          },
          {
            role: "user",
            content: `Document type: ${docType.replace(/_/g, " ")}\n\nExtract these fields as a JSON object:\n${expectedFields.map((f) => `- ${f}`).join("\n")}\n\nOCR scanned text:\n${rawText.slice(0, 4000)}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 1024,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("Groq API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      result[key] = String(value);
    }
    return result;
  } catch (error) {
    console.error("Groq extraction error:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireApiSession("documents:upload");
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const docType = (formData.get("docType") as string) || "unknown";

    // If we have a real file, call Trace OCR directly (no API key needed!)
    if (file && file.size > 0) {
      try {
        const traceFormData = new FormData();
        traceFormData.append("files", file);

        const response = await fetch("https://ocr-api.trace.so/ocr/", {
          method: "POST",
          body: traceFormData,
        });

        if (response.ok) {
          const results: TraceResult[] = await response.json();

          if (results && results.length > 0) {
            const { extractedText, extractedFields: basicFields, confidence } =
              parseTraceOcrResponse(results[0], docType);

            // Step 2: AI extraction with Groq — parse raw text into structured fields
            const aiFields = await extractFieldsWithGroq(extractedText, docType);

            if (aiFields) {
              // Validate: if most fields are "N/A", the document doesn't match the type
              const totalFields = Object.keys(aiFields).length;
              const naCount = Object.values(aiFields).filter(
                (v) => v === "N/A" || v === "n/a" || v.trim() === ""
              ).length;
              const validRatio = totalFields > 0 ? (totalFields - naCount) / totalFields : 0;

              if (validRatio < 0.3) {
                // Less than 30% of fields found — reject as invalid document
                return NextResponse.json({
                  success: false,
                  mode: "live",
                  docType,
                  error: "invalid_document",
                  message: `This file doesn't appear to be a valid ${docType.replace(/_/g, " ")}. Please upload the correct document type.`,
                  fieldsFound: totalFields - naCount,
                  fieldsExpected: totalFields,
                });
              }

              return NextResponse.json({
                success: true,
                mode: "live",
                docType,
                extractedFields: aiFields,
                confidence,
                aiExtracted: true,
                message: "Document processed by Trace OCR + Groq AI",
              });
            }

            // No Groq API key or extraction failed — return basic OCR fields
            return NextResponse.json({
              success: true,
              mode: "live",
              docType,
              extractedFields: basicFields,
              confidence,
              aiExtracted: false,
              message: "Document processed by Trace OCR",
            });
          }
        } else {
          const errorText = await response.text();
          console.error("Trace OCR error:", response.status, errorText);
        }
      } catch (fetchError) {
        console.error("Trace OCR fetch error:", fetchError);
      }
    }

    // Mock fallback — no file uploaded, or Trace OCR call failed
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const fields = mockOcrResults[docType] || mockOcrResults.emirates_id;

    return NextResponse.json({
      success: true,
      mode: file && file.size > 0 ? "mock_fallback" : "demo",
      docType,
      extractedFields: fields,
      confidence: 0.973,
      aiExtracted: true,
      message:
        file && file.size > 0
          ? "Trace OCR unavailable — using demo extraction"
          : "Demo mode — upload a real file for live OCR via Trace",
    });
  } catch (error) {
    console.error("OCR route error:", error);
    return NextResponse.json(
      { success: false, error: "OCR processing failed" },
      { status: 500 }
    );
  }
}
