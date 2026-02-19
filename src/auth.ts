import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authConfig } from "@/auth.config";

export const authOptions = authConfig;

export async function getAuthSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}
