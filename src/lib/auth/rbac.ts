import type { AppRole } from "@/auth.config";
import type { Permission } from "@/lib/auth/permissions";
import { ROLE_PERMISSIONS } from "@/lib/auth/permissions";

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function assertOrgAccess(userOrgId: string | null, resourceOrgId: string): boolean {
  if (!userOrgId) {
    return false;
  }
  return userOrgId === resourceOrgId;
}
