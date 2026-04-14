import { idParamSchema } from "@/lib/api/schemas/common";
import { handleRouteError, jsonError, jsonOk } from "@/lib/api/route-helpers";
import { requireApiSession } from "@/lib/auth/require-session";
import { getDealByIdForOrg } from "@/lib/services/deal-service";

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const auth = await requireApiSession("deals:read");
  if (!auth.ok) {
    return auth.response;
  }

  if (!auth.session.user.orgId) {
    return jsonError("Organization is required", 403);
  }

  const parsedParams = idParamSchema.safeParse(context.params);
  if (!parsedParams.success) {
    return jsonError("Invalid deal id", 400, parsedParams.error.flatten());
  }

  try {
    const deal = await getDealByIdForOrg({
      orgId: auth.session.user.orgId,
      dealId: parsedParams.data.id,
    });

    if (!deal) {
      return jsonError("Deal not found", 404);
    }

    return jsonOk({ deal });
  } catch (error) {
    return handleRouteError(error);
  }
}
