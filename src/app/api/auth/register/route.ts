import { Prisma } from "@prisma/client";
import { registerSchema } from "@/lib/api/schemas/auth";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/route-helpers";
import { provisionCredentialsUser } from "@/lib/auth/provision-user";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: Request) {
  const parsed = await parseJsonBody(request, registerSchema);
  if (!parsed.ok) {
    return parsed.response;
  }

  try {
    const passwordHash = await hashPassword(parsed.data.password);
    const user = await provisionCredentialsUser({
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name,
      passwordHash,
    });

    return jsonOk(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      201
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError("An account with this email already exists", 409);
    }

    if (error instanceof Error && error.message.includes("already exists")) {
      return jsonError(error.message, 409);
    }

    return jsonError("Failed to create account", 500);
  }
}
