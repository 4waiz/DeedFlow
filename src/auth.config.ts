import type { NextAuthOptions } from "next-auth";

export type AppRole = "OPERATOR" | "MANAGER" | "REVIEWER";

export function getBaseAuthConfig(): NextAuthOptions {
  return {
    providers: [],
    pages: {
      signIn: "/login",
    },
    session: {
      strategy: "jwt",
    },
  };
}
