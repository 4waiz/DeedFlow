"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import ToastStack from "@/components/ToastStack";
import DemoScriptModal from "@/components/DemoScriptModal";
import {
  Shield,
  Eye,
  Lock,
  Rocket,
  Building,
  Globe,
  Zap,
  FileCheck,
  Scale,
  Landmark,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const { lang, initializeDeals, deals } = useStore();
  const [initialized, setInitialized] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (!initialized && deals.length === 0) {
      initializeDeals();
      setInitialized(true);
    }
  }, [initialized, deals.length, initializeDeals]);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div dir={dir} className="min-h-screen bg-[#0c0f1a]">
      <TopBar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-6 shadow-[0_8px_32px_rgba(16,185,129,0.3)]">
            <span className="text-white text-3xl font-bold">D</span>
          </div>
          <h1 className="text-4xl font-black mb-4" style={{
            background: "linear-gradient(135deg, #6ee7b7, #34d399, #a7f3d0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>DeedFlow</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            An AI agent that turns fractional and tokenized property transactions
            into a guided, compliant workflow — purpose-built for the UAE real estate
            ecosystem.
          </p>
        </motion.div>

        {/* Adaptive City Relevance */}
        <motion.section {...fadeUp} transition={{ delay: 0.1 }} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Building size={24} className="text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Why the UAE, Why Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Landmark,
                title: "Regulatory Momentum",
                body: "Dubai and Abu Dhabi are leading the charge on tokenized real estate regulation. VARA, RERA, and ADGM are creating frameworks that demand compliance tooling.",
              },
              {
                icon: Globe,
                title: "Global Investor Demand",
                body: "International buyers want fractional ownership in UAE properties but face a maze of KYC, NOC, and escrow requirements. DeedFlow simplifies the path.",
              },
              {
                icon: Zap,
                title: "Market Timing",
                body: "With $80B+ in UAE real estate transactions annually and growing tokenization pilots, the gap between innovation and compliance infrastructure is widening.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5"
              >
                <item.icon size={20} className="text-emerald-400 mb-3" />
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Core Values */}
        <motion.section {...fadeUp} transition={{ delay: 0.2 }} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Scale size={24} className="text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Our Principles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Shield,
                title: "Fairness",
                body: "Every party gets transparent access to deal status, documents, and compliance rules. Full visibility into ownership and workflow progress.",
                color: "text-emerald-400",
              },
              {
                icon: Eye,
                title: "Trust",
                body: "Immutable audit trails, AI-verified documents, and gated workflows ensure no step is skipped. The system is the source of truth.",
                color: "text-blue-400",
              },
              {
                icon: Lock,
                title: "Privacy",
                body: "KYC data stays encrypted. Parties only see what they need. Compliance officers get full visibility while personal data stays protected.",
                color: "text-purple-400",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.1 }}
                className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5"
              >
                <item.icon size={20} className={`${item.color} mb-3`} />
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Roadmap */}
        <motion.section {...fadeUp} transition={{ delay: 0.3 }} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Rocket size={24} className="text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Roadmap</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                phase: "Phase 1 — Foundation",
                status: "Current",
                items: [
                  "AI-guided compliance workflow with 8-step gating",
                  "Document upload, extraction & verification (mock OCR)",
                  "Post-close automation: rent distribution & maintenance",
                ],
              },
              {
                phase: "Phase 2 — Integration",
                status: "Next",
                items: [
                  "Real KYC/AML provider integration (UAE Pass, Emirates ID)",
                  "DLD and RERA API connections for live title verification",
                  "Escrow provider APIs (ADCB, Emirates NBD)",
                ],
              },
              {
                phase: "Phase 3 — Scale",
                status: "Future",
                items: [
                  "On-chain token issuance (Polygon/Ethereum)",
                  "Multi-jurisdiction support (GCC, Europe)",
                  "AI-powered risk scoring with market data feeds",
                ],
              },
            ].map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">{phase.phase}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    phase.status === "Current" ? "bg-emerald-500/15 text-emerald-400" :
                    phase.status === "Next" ? "bg-amber-500/15 text-amber-400" :
                    "bg-white/[0.06] text-gray-400"
                  }`}>
                    {phase.status}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-400">
                      <FileCheck size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="text-center rounded-2xl p-8 border border-emerald-500/20"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.15))",
          }}
        >
          <h2 className="text-xl font-bold text-white mb-2">Ready to see it in action?</h2>
          <p className="text-sm text-emerald-300/70 mb-4">
            Head to the dashboard to explore live deals and simulate compliance workflows.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl font-semibold text-sm hover:bg-emerald-500/30 border border-emerald-500/25 transition-all"
          >
            Go to Dashboard <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      <DemoScriptModal />
      <ToastStack />
    </div>
  );
}
