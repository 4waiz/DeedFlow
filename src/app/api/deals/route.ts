import { createDealSchema } from "@/lib/api/schemas/deals";
import { handleRouteError, jsonError, jsonOk, parseJsonBody } from "@/lib/api/route-helpers";
import { requireApiSession } from "@/lib/auth/require-session";
import { createDealForOrg, listDealsForOrg } from "@/lib/services/deal-service";

export async function GET() {
  const auth = await requireApiSession("deals:read");
  if (!auth.ok) {
    return auth.response;
  }

  if (!auth.session.user.orgId) {
    return jsonError("Organization is required", 403);
  }

  try {
    const deals = await listDealsForOrg(auth.session.user.orgId);
    return jsonOk({ deals });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireApiSession("deals:write");
  if (!auth.ok) {
    return auth.response;
  }

  if (!auth.session.user.orgId) {
    return jsonError("Organization is required", 403);
  }

  const parsed = await parseJsonBody(request, createDealSchema);
  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    const deal = await createDealForOrg({
      orgId: auth.session.user.orgId,
      title: parsed.data.title,
      propertyMetaJson: parsed.data.propertyMetaJson,
      actorUserId: auth.session.user.id,
    });
    return jsonOk({ deal }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
