"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { User, Mail, Building2, CheckCircle, Globe } from "lucide-react";

const ROLES = [
  { value: "developer", label: "Developer" },
  { value: "platform", label: "Tokenization Platform" },
  { value: "asset_manager", label: "Asset Manager" },
  { value: "compliance", label: "Compliance Officer" },
  { value: "regulator", label: "Regulator" },
  { value: "demo", label: "Demo / Judge" },
] as const;

const DEMO_DATASETS = [
  { value: "fractional", label: "Fractional Deal (Active)", desc: "Marina Heights Tower - 100 shares" },
  { value: "tokenized", label: "Tokenized Deal (On-hold)", desc: "Palm Jumeirah Villa - blockchain tokens" },
  { value: "completed", label: "Completed Deal", desc: "Downtown Dubai - Settlement finalized" },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setLang, setDemoDataset } = useStore();

  const [step, setStep] = useState<"signup" | "onboarding">("signup");

  // Signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState<typeof ROLES[number]["value"]>("demo");

  // Onboarding fields
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [dataset, setDataset] = useState<"fractional" | "tokenized" | "completed">("fractional");

  const handleSignup = () => {
    if (!name.trim() || !email.trim()) {
      return;
    }

    setUser({
      name: name.trim(),
      email: email.trim(),
      role,
      org: company.trim() || undefined,
    });

    setStep("onboarding");
  };

  const handleOnboarding = () => {
    setLang(language);
    setDemoDataset(dataset);
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden flex items-center justify-center">
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
            href="/login"
            className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors"
          >
            Already have an account? <span className="text-emerald-400 font-semibold">Log in</span>
          </Link>
        </div>
      </div>

      {/* Signup/Onboarding card */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 shadow-soft"
        >
          {step === "signup" ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Get started with DeedFlow</h1>
                <p className="text-sm text-muted">
                  Create your account to access the compliance platform
                </p>
              </div>

              {/* Signup form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-muted mb-2">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-600 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-2">Work Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.ae"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-600 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-2">
                    Company <span className="text-muted">(optional)</span>
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Real Estate"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-600 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as typeof role)}
                    className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Create account button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSignup}
                disabled={!name.trim() || !email.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-[0_8px_32px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </motion.button>

              <p className="text-center text-xs text-muted mt-6">
                By signing up, you agree to our demo terms. This is a hackathon prototype.
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={24} className="text-emerald-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Welcome aboard!</h1>
                <p className="text-sm text-gray-400">
                  Let&apos;s personalize your experience
                </p>
              </div>

              {/* Onboarding form */}
              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-3 flex items-center gap-2">
                    <Globe size={14} />
                    Preferred Language
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <LanguageButton
                      active={language === "en"}
                      onClick={() => setLanguage("en")}
                      label="English"
                      flag="🇬🇧"
                    />
                    <LanguageButton
                      active={language === "ar"}
                      onClick={() => setLanguage("ar")}
                      label="العربية"
                      flag="🇦🇪"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-3">
                    Demo Dataset
                  </label>
                  <div className="space-y-2">
                    {DEMO_DATASETS.map((ds) => (
                      <DatasetButton
                        key={ds.value}
                        active={dataset === ds.value}
                        onClick={() => setDataset(ds.value as typeof dataset)}
                        label={ds.label}
                        desc={ds.desc}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Continue button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleOnboarding}
                className="w-full py-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-[0_8px_32px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.35)] transition-all"
              >
                Continue to Dashboard
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function LanguageButton({ active, onClick, label, flag }: { active: boolean; onClick: () => void; label: string; flag: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`py-3 px-4 rounded-xl border transition-all text-sm font-semibold flex items-center justify-center gap-2 ${
        active
          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
          : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-white/[0.15]"
      }`}
    >
      <span className="text-lg">{flag}</span>
      {label}
    </motion.button>
  );
}

function DatasetButton({ active, onClick, label, desc }: { active: boolean; onClick: () => void; label: string; desc: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full py-3 px-4 rounded-xl border transition-all text-left ${
        active
          ? "bg-emerald-500/20 border-emerald-500/40"
          : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15]"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-semibold ${active ? "text-emerald-400" : "text-gray-300"}`}>
          {label}
        </span>
        {active && <CheckCircle size={16} className="text-emerald-400" />}
      </div>
      <p className="text-xs text-gray-500">{desc}</p>
    </motion.button>
  );
}
