"use client";

import { useEffect } from "react";
import type { Session } from "next-auth";
import { useStore } from "@/lib/store";
import type { AppRole } from "@/auth.config";

function normalizeRole(role: string | null | undefined): AppRole {
  if (role === "MANAGER" || role === "REVIEWER") {
    return role;
  }
  return "OPERATOR";
}

export default function AuthSessionSync({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    if (!session.user) {
      return;
    }

    setUser({
      name: session.user.name ?? "User",
      email: session.user.email ?? "",
      role: normalizeRole(session.user.role),
      org: session.user.orgId ?? undefined,
    });
  }, [session, setUser]);

  return <>{children}</>;
}
