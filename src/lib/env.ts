const asBool = (value: string | undefined): boolean => value === "true";

export const env = {
  DEMO_MODE: asBool(process.env.DEMO_MODE),
  NEXT_PUBLIC_DEMO_MODE: asBool(process.env.NEXT_PUBLIC_DEMO_MODE),
} as const;

export function getServerDemoMode(): boolean {
  return env.DEMO_MODE || env.NEXT_PUBLIC_DEMO_MODE;
}
