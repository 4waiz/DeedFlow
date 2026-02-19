import { z } from "zod";

const boolStringSchema = z.enum(["true", "false"]).optional();

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  DEMO_MODE: boolStringSchema,
  NEXT_PUBLIC_DEMO_MODE: boolStringSchema,
});

const publicEnvSchema = z.object({
  NEXT_PUBLIC_DEMO_MODE: boolStringSchema,
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

function asBool(value: string | undefined): boolean {
  return value === "true";
}

export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() can only be used on the server");
  }

  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid server env: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`);
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}

const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
});

const serverEnv = typeof window === "undefined" ? getServerEnv() : null;

export const env = {
  DEMO_MODE: asBool(serverEnv?.DEMO_MODE),
  NEXT_PUBLIC_DEMO_MODE: asBool(publicEnv.NEXT_PUBLIC_DEMO_MODE),
} as const;

export function getServerDemoMode(): boolean {
  return env.DEMO_MODE || env.NEXT_PUBLIC_DEMO_MODE;
}
