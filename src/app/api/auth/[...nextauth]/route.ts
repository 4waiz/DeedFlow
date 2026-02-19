import NextAuth from "next-auth";
import { getAuthOptions } from "@/auth";

export async function GET(request: Request, context: { params: { nextauth: string[] } }) {
  const handler = NextAuth(getAuthOptions());
  return handler(request, context);
}

export async function POST(request: Request, context: { params: { nextauth: string[] } }) {
  const handler = NextAuth(getAuthOptions());
  return handler(request, context);
}
