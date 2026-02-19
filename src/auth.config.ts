import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export type AppRole = "OPERATOR" | "MANAGER" | "REVIEWER";

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
};
