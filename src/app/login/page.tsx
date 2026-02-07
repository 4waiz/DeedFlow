"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Mail, Lock, Zap, Shield, Building2, Gavel } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsDemoMode(params.get("demo") === "true");
  }, []);

  const handleLogin = () => {
    setUser({
      name: email.split("@")[0] || "User",
      email: email || "demo@deedflow.ae",
      role: "demo",
    });
    router.push("/app");
  };

  const handleDemoMode = () => {
    setUser({
      name: "Demo User",
      email: "demo@deedflow.ae",
      role: "demo",
    });
    router.push("/app");
  };

  const handleQuickLogin = (role: "compliance" | "asset_manager" | "regulator") => {
    const roleData = {
      compliance: { name: "Sarah Johnson", email: "sarah.j@compliance.ae", role: "compliance" as const },
      asset_manager: { name: "Ahmed Al-Farsi", email: "ahmed@assetmgmt.ae", role: "asset_manager" as const },
      regulator: { name: "Judge Hassan", email: "hassan@dubaicourts.ae", role: "regulator" as const },
    };

    setUser(roleData[role]);
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-[#0c0f1a] relative overflow-hidden flex items-center justify-center">
      <div className="bg-particles" />

      {/* Simple header */}
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
            href="/signup"
            className="text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            Need an account? <span className="text-emerald-400 font-semibold">Sign up</span>
          </Link>
        </div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#141825] rounded-2xl border border-white/[0.08] p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-sm text-gray-400">
              {isDemoMode ? "Starting in demo mode — no authentication required" : "Sign in to continue to DeedFlow"}
            </p>
          </div>

          {/* Login form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.ae"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-600 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">
                Password {isDemoMode && <span className="text-gray-600">(optional in demo)</span>}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-600 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>
          </div>

          {/* Primary button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-[0_8px_32px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.35)] transition-all mb-3"
          >
            Continue
          </motion.button>

          {/* Demo mode button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleDemoMode}
            className="w-full py-3 rounded-xl bg-amber-500/10 text-amber-400 font-semibold text-sm border border-amber-500/30 hover:bg-amber-500/15 transition-all flex items-center justify-center gap-2 mb-6"
          >
            <Zap size={16} />
            Continue in Demo Mode
          </motion.button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#141825] text-xs text-gray-600">Quick login as...</span>
            </div>
          </div>

          {/* Quick role buttons */}
          <div className="space-y-2">
            <QuickRoleButton
              icon={Shield}
              label="Compliance Officer"
              onClick={() => handleQuickLogin("compliance")}
            />
            <QuickRoleButton
              icon={Building2}
              label="Asset Manager"
              onClick={() => handleQuickLogin("asset_manager")}
            />
            <QuickRoleButton
              icon={Gavel}
              label="Regulator / Judge"
              onClick={() => handleQuickLogin("regulator")}
            />
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-600 mt-6">
          This is a hackathon demo. Authentication is simulated for demonstration purposes.
        </p>
      </div>
    </div>
  );
}

interface QuickRoleButtonProps {
  icon: typeof Shield;
  label: string;
  onClick: () => void;
}

function QuickRoleButton({ icon: Icon, label, onClick }: QuickRoleButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01, x: 2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full py-2.5 px-4 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all text-left flex items-center gap-3 group"
    >
      <Icon size={16} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </motion.button>
  );
}
