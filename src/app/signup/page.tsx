"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Building2 } from "lucide-react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/app" });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden flex items-center justify-center">
      <div className="bg-particles" />

      <div className="absolute top-0 left-0 right-0 z-20 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="DeedFlow"
              width={140}
              height={36}
              className="h-8 sm:h-9 w-auto brightness-0 invert opacity-90"
              priority
            />
          </Link>
          <Link
            href="/login"
            className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors"
          >
            Already have an account? <span className="text-emerald-400 font-semibold">Log in</span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 shadow-soft"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Create your DeedFlow account</h1>
            <p className="text-sm text-muted">
              Sign in with Google. Your organization is derived from your email domain.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-[0_8px_32px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.35)] transition-all disabled:opacity-70"
          >
            {isLoading ? "Redirecting..." : "Sign up with Google"}
          </motion.button>

          <div className="mt-6 p-3 rounded-xl border border-white/[0.08] bg-white/[0.03]">
            <p className="text-xs text-muted flex items-start gap-2">
              <Building2 size={14} className="text-emerald-400 mt-0.5" />
              First user from a domain will be provisioned as org manager during DB wiring.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
