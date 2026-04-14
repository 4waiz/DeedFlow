import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { getAuthSession } from "@/auth";
import { hasPermission } from "@/lib/auth/rbac";
import type { Permission } from "@/lib/auth/permissions";

type AuthResult =
  | {
      ok: true;
      session: Session;
    }
  | {
      ok: false;
      response: NextResponse;
    };

export async function requireApiSession(permission?: Permission): Promise<AuthResult> {
  const session = await getAuthSession();

  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (permission && !hasPermission(session.user.role, permission)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, session };
}
