import { getServerSession } from "next-auth";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import type { NextAuthOptions, Session } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getBaseAuthConfig, type AppRole } from "@/auth.config";
import { getPrismaClient } from "@/lib/db";
import { provisionOAuthUser, resolveOrgAndRoleByEmail } from "@/lib/auth/provision-user";
import { verifyPassword } from "@/lib/auth/password";
import { getServerEnv } from "@/lib/env";

function createAdapter(): Adapter {
  const prisma = getPrismaClient();
  const baseAdapter = PrismaAdapter(prisma);

  return {
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
}

export function getAuthOptions(): NextAuthOptions {
  const prisma = getPrismaClient();
  const serverEnv = getServerEnv();

  return {
    ...getBaseAuthConfig(),
    secret: serverEnv.NEXTAUTH_SECRET,
    providers: [
      GoogleProvider({
        clientId: serverEnv.GOOGLE_CLIENT_ID,
        clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
      }),
      CredentialsProvider({
        name: "Email and password",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const email = credentials?.email?.toLowerCase().trim();
          const password = credentials?.password;

          if (!email || !password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              passwordHash: true,
            },
          });

          if (!user?.passwordHash) {
            return null;
          }

          const validPassword = await verifyPassword(password, user.passwordHash);
          if (!validPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        },
      }),
    ],
    adapter: createAdapter(),
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
}

export async function getAuthSession(): Promise<Session | null> {
  return getServerSession(getAuthOptions());
}
