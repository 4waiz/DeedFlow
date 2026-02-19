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

const demoEnvSchema = z.object({
  DEMO_MODE: boolStringSchema,
  NEXT_PUBLIC_DEMO_MODE: boolStringSchema,
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

function asBool(value: string | undefined): boolean {
  return value === "true";
}

function asBoolString(value: string | undefined): "true" | "false" | undefined {
  if (value === "true" || value === "false") {
    return value;
  }

  return undefined;
}

function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function formatIssues(issues: z.ZodIssue[]): string {
  return issues.map((issue) => issue.message).join(", ");
}

export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() can only be used on the server");
  }

  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const parsed = serverEnvSchema.safeParse(process.env);
  if (parsed.success) {
    cachedServerEnv = parsed.data;
    return cachedServerEnv;
  }

  if (isBuildPhase()) {
    return {
      DATABASE_URL: process.env.DATABASE_URL ?? "build-placeholder-database-url",
      DIRECT_URL: process.env.DIRECT_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "build-placeholder-nextauth-secret",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "build-placeholder-google-client-id",
      GOOGLE_CLIENT_SECRET:
        process.env.GOOGLE_CLIENT_SECRET ?? "build-placeholder-google-client-secret",
      DEMO_MODE: asBoolString(process.env.DEMO_MODE),
      NEXT_PUBLIC_DEMO_MODE: asBoolString(process.env.NEXT_PUBLIC_DEMO_MODE),
    };
  }

  throw new Error(`Invalid server env: ${formatIssues(parsed.error.issues)}`);
}

export function getServerDemoMode(): boolean {
  if (typeof window !== "undefined") {
    return asBool(process.env.NEXT_PUBLIC_DEMO_MODE);
  }

  const parsed = demoEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    return false;
  }

  return asBool(parsed.data.DEMO_MODE) || asBool(parsed.data.NEXT_PUBLIC_DEMO_MODE);
}

export const env = {
  get DEMO_MODE() {
    return getServerDemoMode();
  },
  get NEXT_PUBLIC_DEMO_MODE() {
    return asBool(process.env.NEXT_PUBLIC_DEMO_MODE);
  },
} as const;
