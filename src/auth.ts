import { getServerSession } from "next-auth";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import type { NextAuthOptions, Session } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig, type AppRole } from "@/auth.config";
import { prisma } from "@/lib/db";
import { provisionOAuthUser, resolveOrgAndRoleByEmail } from "@/lib/auth/provision-user";

const baseAdapter = PrismaAdapter(prisma);

const adapter: Adapter = {
  ...baseAdapter,
  createUser: async (data: AdapterUser) => {
    if (!data.email) {
      throw new Error("OAuth user email is required");
    }

    return provisionOAuthUser({
      email: data.email,
      name: data.name,
      image: data.image,
      emailVerified: data.emailVerified,
    });
  },
};

export const authOptions: NextAuthOptions = {
  ...authConfig,
  adapter,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { id: true, orgId: true, role: true },
      });

      if (!dbUser) {
        return false;
      }

      if (!dbUser.orgId) {
        const { orgId, role } = await resolveOrgAndRoleByEmail(user.email);
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { orgId, role },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, role: true, orgId: true },
        });

        if (dbUser) {
          token.sub = dbUser.id;
          token.role = dbUser.role as AppRole;
          token.orgId = dbUser.orgId;
        }
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

export async function getAuthSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}
