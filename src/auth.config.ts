import type { NextAuthOptions } from "next-auth";

export type AppRole = "OPERATOR" | "MANAGER" | "REVIEWER";

export function getBaseAuthConfig(): NextAuthOptions {
  return {
    pages: {
      signIn: "/login",
    },
    session: {
      strategy: "jwt",
    },
  };
}
