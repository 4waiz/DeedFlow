import type { Role, User } from "@prisma/client";
import { prisma } from "@/lib/db";

export function getEmailDomain(email: string): string {
  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2 || !parts[1]) {
    return "default.local";
  }
  return parts[1];
}

export async function resolveOrgAndRoleByEmail(email: string): Promise<{
  orgId: string;
  role: Role;
}> {
  const domain = getEmailDomain(email);

  const org = await prisma.organization.upsert({
    where: { name: domain },
    update: {},
    create: { name: domain },
  });

  const memberCount = await prisma.user.count({
    where: { orgId: org.id },
  });

  return {
    orgId: org.id,
    role: memberCount === 0 ? "MANAGER" : "OPERATOR",
  };
}

export async function provisionOAuthUser(params: {
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}): Promise<User> {
  const existingUser = await prisma.user.findUnique({
    where: { email: params.email },
  });

  if (existingUser) {
    return existingUser;
  }

  const { orgId, role } = await resolveOrgAndRoleByEmail(params.email);

  return prisma.user.create({
    data: {
      email: params.email,
      name: params.name,
      image: params.image,
      emailVerified: params.emailVerified ?? null,
      orgId,
      role,
    },
  });
}
