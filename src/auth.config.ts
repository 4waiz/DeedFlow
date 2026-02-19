import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export type AppRole = "OPERATOR" | "MANAGER" | "REVIEWER";

function deriveOrgIdFromEmail(email: string | null | undefined): string | null {
  if (!email) {
    return null;
  }
  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2 || !parts[1]) {
    return null;
  }
  return parts[1];
}

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.email) {
        token.role = (token.role as AppRole | undefined) ?? "OPERATOR";
        token.orgId = (token.orgId as string | undefined) ?? deriveOrgIdFromEmail(profile.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as AppRole | undefined) ?? "OPERATOR";
        session.user.orgId = (token.orgId as string | undefined) ?? null;
      }
      return session;
    },
  },
};
