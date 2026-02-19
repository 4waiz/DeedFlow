import { NextRequest, NextResponse } from "next/server";
import { createMockDeals } from "@/lib/mock-data";
import { Deal } from "@/lib/types";
import { requireApiSession } from "@/lib/auth/require-session";

let deals: Deal[] | null = null;

function getDeals(): Deal[] {
  if (!deals) {
    deals = createMockDeals();
  }
  return deals;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireApiSession("deals:read");
  if (!auth.ok) {
    return auth.response;
  }

  const allDeals = getDeals();
  const deal = allDeals.find((d) => d.id === params.id);
  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  return NextResponse.json(deal);
}
