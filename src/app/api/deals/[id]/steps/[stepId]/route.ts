import { StepStatus } from "@prisma/client";
import { stepParamSchema } from "@/lib/api/schemas/common";
import { updateStepSchema } from "@/lib/api/schemas/deals";
import { handleRouteError, jsonError, jsonOk, parseJsonBody } from "@/lib/api/route-helpers";
import { requireApiSession } from "@/lib/auth/require-session";
import { updateDealStepForOrg } from "@/lib/services/deal-service";

export async function PATCH(
  request: Request,
  context: { params: { id: string; stepId: string } }
) {
  const auth = await requireApiSession("steps:update");
  if (!auth.ok) {
    return auth.response;
  }

  if (!auth.session.user.orgId) {
    return jsonError("Organization is required", 403);
  }

  const parsedParams = stepParamSchema.safeParse(context.params);
  if (!parsedParams.success) {
    return jsonError("Invalid route params", 400, parsedParams.error.flatten());
  }

  const parsedBody = await parseJsonBody(request, updateStepSchema);
  if (!parsedBody.ok) {
    return parsedBody.response;
  }

  const dueDate = parsedBody.data.dueDate ? new Date(parsedBody.data.dueDate) : undefined;
  if (parsedBody.data.dueDate && Number.isNaN(dueDate?.getTime())) {
    return jsonError("Invalid dueDate", 400);
  }

  try {
    const step = await updateDealStepForOrg({
      orgId: auth.session.user.orgId,
      dealId: parsedParams.data.id,
      stepId: parsedParams.data.stepId,
      status: parsedBody.data.status as StepStatus,
      blockingReason: parsedBody.data.blockingReason ?? null,
      ownerUserId: parsedBody.data.ownerUserId ?? undefined,
      dueDate,
      actorUserId: auth.session.user.id,
    });

    if (!step) {
      return jsonError("Step not found", 404);
    }

    return jsonOk({ step });
  } catch (error) {
    return handleRouteError(error);
  }
}
