import { getServerDemoMode } from "@/lib/env";

export function isDemoModeEnabled(): boolean {
  if (typeof window === "undefined") {
    return getServerDemoMode();
  }
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}
