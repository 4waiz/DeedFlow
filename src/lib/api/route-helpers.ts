import { NextResponse } from "next/server";
import { ZodSchema } from "zod";

export function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { ok: false, response: jsonError("Invalid JSON body", 400) };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: jsonError("Validation failed", 400, parsed.error.flatten()),
    };
  }

  return { ok: true, data: parsed.data };
}

export function handleRouteError(error: unknown): NextResponse {
  if (error instanceof Error) {
    return jsonError(error.message, 500);
  }
  return jsonError("Unexpected server error", 500);
}
