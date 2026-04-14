import type { AppRole } from "@/auth.config";

export type Permission =
  | "deals:read"
  | "deals:write"
  | "steps:update"
  | "documents:upload"
  | "documents:review"
  | "audit:read"
  | "review:read";

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  OPERATOR: ["deals:read", "deals:write", "steps:update", "documents:upload", "audit:read"],
  MANAGER: [
    "deals:read",
    "deals:write",
    "steps:update",
    "documents:upload",
    "documents:review",
    "audit:read",
    "review:read",
  ],
  REVIEWER: ["deals:read", "audit:read", "review:read"],
};
