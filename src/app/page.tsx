"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, FileCheck, Activity, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0c0f1a] relative overflow-hidden">
      {/* Background particles */}
      <div className="bg-particles" />

      {/* Simple header */}
      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="DeedFlow"
              width={140}
              height={36}
              className="h-9 w-auto brightness-0 invert opacity-90"
              priority
            />
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles size={14} />
            AI-Powered Compliance Engine
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            AI-powered transaction orchestration for{" "}
            <span className="text-gradient-hero">fractional & tokenized</span> real estate
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Guided compliance checklist, settlement gating, audit trail, and post-close automation.
            Turn complex property transactions into a streamlined, compliant workflow.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/login?demo=true">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 text-base font-bold rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_8px_32px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.35)] transition-all flex items-center gap-2"
              >
                Start Demo
                <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link href="/judge">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 text-base font-semibold rounded-xl bg-white/[0.04] text-gray-300 border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.18] transition-all"
              >
                Judge View
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Shield}
            title="Orchestrate"
            description="Multi-step workflow engine that guides parties through KYC, title verification, NOC collection, and settlement—with real-time status tracking."
            delay={0}
          />
          <FeatureCard
            icon={FileCheck}
            title="Gate"
            description="AI copilot analyzes compliance scores, risk signals, and blockers—recommending PROCEED, HOLD, or ESCALATE before settlement."
            delay={0.1}
          />
          <FeatureCard
            icon={Activity}
            title="Audit"
            description="Immutable audit trail captures every action, document upload, and status change—ensuring transparency and regulatory compliance."
            delay={0.2}
          />
        </div>
      </section>

      {/* Screenshot placeholder */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141825] to-[#0e1119] p-8 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
        >
          {/* Decorative gradient border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-transparent to-gold-500/20 opacity-50 blur-2xl" />

          <div className="relative aspect-video rounded-xl bg-[#0c0f1a] border border-white/[0.06] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-[0_8px_32px_rgba(16,185,129,0.25)]">
                <Shield size={32} className="text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-400">
                Live Dashboard Preview
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Real-time compliance tracking & AI recommendations
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer disclaimer */}
      <footer className="relative z-10 border-t border-white/[0.06] mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-gray-600">
            Demo uses synthetic data for illustration purposes only. Not legal or financial advice.
            Designed for UAE property compliance workflows.
          </p>
          <p className="text-xs text-gray-700 mt-2">
            © 2025 DeedFlow. Built for transforming fractional real estate transactions.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: typeof Shield;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon: Icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-2xl border border-white/[0.06] bg-[#141825] hover:border-white/[0.12] hover:bg-[#1a1f30] transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/15 transition-colors">
        <Icon size={24} className="text-emerald-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
