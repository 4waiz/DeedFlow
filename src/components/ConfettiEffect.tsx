"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function ConfettiEffect() {
  const { showConfetti } = useStore();

  useEffect(() => {
    if (!showConfetti) return;

    // Dynamic import to avoid SSR issues
    import("canvas-confetti").then((confetti) => {
      const fire = confetti.default;

      // First burst
      fire({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#f59e0b", "#059669", "#fbbf24", "#d97706"],
      });

      // Second burst
      setTimeout(() => {
        fire({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#10b981", "#f59e0b"],
        });
      }, 200);

      setTimeout(() => {
        fire({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#059669", "#fbbf24"],
        });
      }, 400);
    });
  }, [showConfetti]);

  return null;
}
