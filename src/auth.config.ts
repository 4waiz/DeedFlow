import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getServerEnv } from "@/lib/env";

export type AppRole = "OPERATOR" | "MANAGER" | "REVIEWER";

export function getAuthConfig(): NextAuthOptions {
  const serverEnv = getServerEnv();

  return {
    providers: [
      GoogleProvider({
        clientId: serverEnv.GOOGLE_CLIENT_ID,
        clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
      }),
    ],
    secret: serverEnv.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login",
    },
    session: {
      strategy: "jwt",
    },
  };
}
