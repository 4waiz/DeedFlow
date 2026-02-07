import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { dealId, stepId } = body;

  if (!dealId || !stepId) {
    return NextResponse.json({ error: "Missing required fields: dealId, stepId" }, { status: 400 });
  }

  // In a real app, this would update the in-memory store
  // For the demo, the client-side store handles the actual state
  return NextResponse.json({
    success: true,
    message: `Step ${stepId} marked as completed for deal ${dealId}`,
    completedAt: new Date().toISOString(),
  });
}
