import { idParamSchema } from "@/lib/api/schemas/common";
import { notificationQuerySchema } from "@/lib/api/schemas/deals";
import { handleRouteError, jsonError, jsonOk } from "@/lib/api/route-helpers";
import { requireApiSession } from "@/lib/auth/require-session";
import { getDealByIdForOrg } from "@/lib/services/deal-service";
import { listDealNotifications } from "@/lib/services/notification-service";

export async function GET(
  request: Request,
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

  const url = new URL(request.url);
  const queryParsed = notificationQuerySchema.safeParse({
    unreadOnly: url.searchParams.get("unreadOnly") ?? undefined,
  });
  if (!queryParsed.success) {
    return jsonError("Invalid query params", 400, queryParsed.error.flatten());
  }

  try {
    const deal = await getDealByIdForOrg({
      orgId: auth.session.user.orgId,
      dealId: parsedParams.data.id,
    });

    if (!deal) {
      return jsonError("Deal not found", 404);
    }

    const notifications = await listDealNotifications({
      orgId: auth.session.user.orgId,
      dealId: parsedParams.data.id,
      unreadOnly: queryParsed.data.unreadOnly,
    });

    return jsonOk({ notifications });
  } catch (error) {
    return handleRouteError(error);
  }
}
