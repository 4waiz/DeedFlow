"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Zap, Shield, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0c0f1a] relative overflow-hidden">
      {/* Background particles */}
      <div className="bg-particles" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="DeedFlow"
              width={140}
              height={36}
              className="h-9 w-auto brightness-0 invert opacity-90"
              priority
            />
          </Link>
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

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-5xl font-black text-white mb-6">
            About DeedFlow
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
            Transforming how fractional and tokenized real estate transactions work by combining AI-powered compliance orchestration with human oversight.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="bg-[#141825] rounded-2xl border border-white/[0.06] p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              Property transactions in emerging markets are complex, fragmented, and risky. Parties struggle with compliance, verification, and settlement across multiple jurisdictions.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              DeedFlow solves this by providing a single orchestration platform where compliance workflows are guided by AI, every step is gated, and complete auditability is guaranteed.
            </p>
          </div>
        </motion.section>

        {/* Core Pillars */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Core Pillars</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <PillarCard
              icon={Zap}
              title="Orchestrate"
              description="Multi-step workflow engine that guides all parties through KYC, document verification, title checks, NOC collection, and settlement."
              delay={0}
            />
            <PillarCard
              icon={Shield}
              title="Gate"
              description="AI copilot analyzes compliance scores, identifies risks, and provides recommendations before settlement—preventing costly mistakes."
              delay={0.1}
            />
            <PillarCard
              icon={Users}
              title="Audit"
              description="Immutable audit trail captures every action, document, and status change—ensuring transparency and meeting regulatory requirements."
              delay={0.2}
            />
          </div>
        </motion.section>

        {/* Why DeedFlow Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Why DeedFlow?</h2>
          <div className="space-y-4">
            <BenefitRow
              icon={CheckCircle}
              title="Compliance Made Simple"
              description="Guided checklists ensure no step is missed, with AI recommendations at every decision point."
              delay={0}
            />
            <BenefitRow
              icon={CheckCircle}
              title="Real-Time Transparency"
              description="All parties see live status, document verification progress, and blockers as they happen."
              delay={0.05}
            />
            <BenefitRow
              icon={CheckCircle}
              title="Risk Mitigation"
              description="Compliance scoring and risk analysis help identify issues before they become expensive problems."
              delay={0.1}
            />
            <BenefitRow
              icon={CheckCircle}
              title="Regulatory Confidence"
              description="Complete audit trail and immutable records provide the accountability required by regulators."
              delay={0.15}
            />
            <BenefitRow
              icon={CheckCircle}
              title="Settlement Gating"
              description="Prevent settlement until all compliance requirements are met, protecting all parties."
              delay={0.2}
            />
            <BenefitRow
              icon={CheckCircle}
              title="Post-Close Automation"
              description="Automated document distribution and stakeholder notifications after settlement completion."
              delay={0.25}
            />
          </div>
        </motion.section>

        {/* Use Cases Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Built For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <UseCaseCard
              title="Tokenized Real Estate Platforms"
              description="Manage multiple transactions simultaneously with consistent compliance workflows across all deals."
              delay={0}
            />
            <UseCaseCard
              title="Fractional Ownership Models"
              description="Orchestrate complex multi-party agreements with clear status visibility for each investor."
              delay={0.1}
            />
            <UseCaseCard
              title="Cross-Border Transactions"
              description="Handle jurisdictional requirements and compliance checks across multiple regulatory environments."
              delay={0.2}
            />
            <UseCaseCard
              title="Financial Institutions"
              description="Meet audit and compliance requirements with immutable transaction records and real-time reporting."
              delay={0.3}
            />
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center py-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Transactions?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Experience DeedFlow in action with our interactive demo, or get started with your first real transaction.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login?demo=true">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 text-base font-bold rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_8px_32px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.35)] transition-all"
              >
                Try Demo
              </motion.button>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 text-base font-semibold rounded-xl bg-white/[0.04] text-gray-300 border border-white/[0.12] hover:bg-white/[0.08] transition-all"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-gray-600">
            © 2025 DeedFlow. Built for transforming fractional real estate transactions.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface PillarCardProps {
  icon: typeof Zap;
  title: string;
  description: string;
  delay: number;
}

function PillarCard({ icon: Icon, title, description, delay }: PillarCardProps) {
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

interface BenefitRowProps {
  icon: typeof CheckCircle;
  title: string;
  description: string;
  delay: number;
}

function BenefitRow({ icon: Icon, title, description, delay }: BenefitRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex gap-4 p-4 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] transition-all"
    >
      <Icon size={24} className="text-emerald-400 flex-shrink-0 mt-1" />
      <div>
        <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </motion.div>
  );
}

interface UseCaseCardProps {
  title: string;
  description: string;
  delay: number;
}

function UseCaseCard({ title, description, delay }: UseCaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-2xl border border-white/[0.06] bg-[#141825] hover:border-white/[0.12] hover:bg-[#1a1f30] transition-all"
    >
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
