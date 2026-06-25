import type { Session } from "next-auth";
import type { AppRole } from "@/auth.config";

// Authentication has been removed from the app. Every request runs as this
// single default user so pages, layouts and API routes keep working without
// any login, sign-up or database lookup.
const DEFAULT_SESSION: Session = {
  user: {
    id: "local-user",
    name: "DeedFlow User",
    email: "user@deedflow.local",
    role: "MANAGER" as AppRole,
    orgId: "local-org",
  },
  expires: "2999-12-31T23:59:59.000Z",
};

export async function getAuthSession(): Promise<Session | null> {
  return DEFAULT_SESSION;
}
