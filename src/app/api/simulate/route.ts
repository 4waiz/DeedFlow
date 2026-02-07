import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, dealId } = body;

  const validEvents = [
    "missing_doc",
    "noc_delay",
    "majority_flip",
    "risk_surge",
    "doc_verified",
    "step_completed",
    "approval_delay",
  ];

  if (!validEvents.includes(type)) {
    return NextResponse.json({ error: `Invalid event type. Valid types: ${validEvents.join(", ")}` }, { status: 400 });
  }

  if (!dealId) {
    return NextResponse.json({ error: "Missing dealId" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    event: type,
    dealId,
    message: `Simulation event "${type}" triggered for deal ${dealId}`,
    timestamp: new Date().toISOString(),
  });
}
