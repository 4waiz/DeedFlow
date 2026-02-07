"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import ToastStack from "@/components/ToastStack";
import DemoScriptModal from "@/components/DemoScriptModal";
import {
  Target,
  Lightbulb,
  TrendingUp,
  Clock,
  FileCheck,
  Shield,
  Zap,
  ArrowRight,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function JudgePage() {
  const { lang, initializeDeals, deals } = useStore();
  const [initialized, setInitialized] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (!initialized && deals.length === 0) {
      initializeDeals();
      setInitialized(true);
    }
  }, [initialized, deals.length, initializeDeals]);

  // Compute live metrics from mock data
  const totalDeals = deals.length;
  const activeDeals = deals.filter((d) => d.status === "active").length;
  const completedDeals = deals.filter((d) => d.status === "completed").length;
  const avgCompliance = totalDeals > 0 ? Math.round(deals.reduce((sum, d) => sum + d.metrics.complianceScore, 0) / totalDeals) : 0;
  const totalValue = deals.reduce((sum, d) => sum + d.totalValue, 0);
  const totalDocs = deals.reduce((sum, d) => sum + d.docs.length, 0);
  const verifiedDocs = deals.reduce((sum, d) => sum + d.docs.filter((doc) => doc.verificationStatus === "verified").length, 0);
  const totalSteps = deals.reduce((sum, d) => sum + d.steps.length, 0);
  const completedSteps = deals.reduce((sum, d) => sum + d.steps.filter((s) => s.status === "done").length, 0);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div dir={dir} className="min-h-screen bg-sand-50">
      <TopBar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div {...fadeUp} className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-bold bg-gold-100 text-gold-700 rounded-full mb-4 border border-gold-300">
            Judge View
          </span>
          <h1 className="text-3xl font-black text-gray-900 mb-3">
            DeedFlow: AI-Powered Property Compliance
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            TurboTax + DocuSign + compliance ops for fractional/tokenized real estate in the UAE
          </p>
        </motion.div>

        {/* Problem → Solution → Why UAE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: Target,
              label: "The Problem",
              color: "text-red-500",
              bg: "bg-red-50 border-red-200",
              points: [
                "UAE property transactions involve 8+ compliance steps across multiple regulators",
                "Fractional ownership adds complexity — multi-party KYC, shared governance, rent splits",
                "Manual workflows lead to 45+ day closings and frequent compliance failures",
              ],
            },
            {
              icon: Lightbulb,
              label: "Our Solution",
              color: "text-emerald-600",
              bg: "bg-emerald-50 border-emerald-200",
              points: [
                "AI agent guides users through the entire compliance workflow step-by-step",
                "Automated doc extraction, verification, and gating — no step can be skipped",
                "Compliance Copilot provides real-time recommendations: PROCEED / HOLD / ESCALATE",
              ],
            },
            {
              icon: TrendingUp,
              label: "Why UAE Now",
              color: "text-gold-600",
              bg: "bg-gold-50 border-gold-200",
              points: [
                "VARA & RERA creating tokenized property frameworks — compliance tools essential",
                "$80B+ annual real estate transactions with growing fractional ownership demand",
                "UAE positioned as global hub for innovative property investment models",
              ],
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={`rounded-2xl border shadow-soft p-5 ${card.bg}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <card.icon size={20} className={card.color} />
                <h3 className="text-sm font-bold text-gray-900">{card.label}</h3>
              </div>
              <ul className="space-y-2">
                {card.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed">
                    <span className="mt-1 flex-shrink-0">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Live Metrics Dashboard */}
        <motion.section {...fadeUp} transition={{ delay: 0.3 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={20} className="text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">Live Demo Metrics</h2>
            <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full animate-pulse">
              LIVE
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Deals", value: totalDeals, icon: FileCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Active Deals", value: activeDeals, icon: Zap, color: "text-gold-600", bg: "bg-gold-50" },
              { label: "Completed", value: completedDeals, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Avg Compliance", value: `${avgCompliance}%`, icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Total Value", value: `AED ${(totalValue / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Docs Uploaded", value: totalDocs, icon: FileCheck, color: "text-gray-600", bg: "bg-gray-50" },
              { label: "Docs Verified", value: verifiedDocs, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Steps Done", value: `${completedSteps}/${totalSteps}`, icon: Clock, color: "text-gold-600", bg: "bg-gold-50" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className={`${metric.bg} rounded-xl p-4 border border-gray-100`}
              >
                <metric.icon size={16} className={`${metric.color} mb-2`} />
                <p className="text-xs text-gray-500">{metric.label}</p>
                <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section {...fadeUp} transition={{ delay: 0.4 }} className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: "🏡", title: "Fractional Listing Creation", desc: "Create deals with shares/tokens, parties, and governance rules in minutes" },
              { icon: "📋", title: "8-Step Compliance Workflow", desc: "KYC → Title → NOC → Valuation → Escrow → Settlement → Issuance → Post-Close" },
              { icon: "🤖", title: "AI Compliance Copilot", desc: "Real-time recommendations: PROCEED / HOLD / ESCALATE with rationale" },
              { icon: "📜", title: "Smart Document Processing", desc: "Upload docs, auto-extract fields, verify — no manual data entry" },
              { icon: "👥", title: "Ownership & Parties", desc: "Track buyer shares, KYC status, and ownership breakdown in real-time" },
              { icon: "💰", title: "Post-Close Automation", desc: "Pro-rata rent distribution, maintenance splits, management assignment" },
              { icon: "📊", title: "Risk & Compliance Scoring", desc: "Dynamic scores update as docs are verified and steps completed" },
              { icon: "🌐", title: "Bilingual EN/AR", desc: "Full Arabic localization with RTL support — powered by Lingo.dev" },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4"
              >
                <span className="text-xl">{feat.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{feat.title}</h4>
                  <p className="text-xs text-gray-600">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Links */}
        <motion.section {...fadeUp} transition={{ delay: 0.5 }} className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Try It Live</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link href="/" className="group">
              <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-emerald-300 hover:shadow-md transition-all">
                <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                  Dashboard <ArrowRight size={14} className="text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-gray-500">View active deals, timeline, and compliance copilot</p>
              </div>
            </Link>
            <Link href="/?simulate=step_completed" className="group">
              <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gold-300 hover:shadow-md transition-all">
                <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                  Live Simulation <ArrowRight size={14} className="text-gold-600 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-gray-500">Watch compliance steps complete in real-time</p>
              </div>
            </Link>
            <Link href="/about" className="group">
              <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-300 hover:shadow-md transition-all">
                <h4 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                  About & Roadmap <ArrowRight size={14} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-gray-500">Learn about our vision and what&apos;s coming next</p>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          {...fadeUp}
          transition={{ delay: 0.55 }}
          className="text-center py-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500">
            Built with Next.js 14, Tailwind, shadcn/ui, Framer Motion, Recharts & Zustand
          </p>
          <p className="text-xs text-gray-400 mt-1">
            DeedFlow — Making UAE property compliance intelligent, transparent, and fast.
          </p>
        </motion.footer>
      </div>

      <DemoScriptModal />
      <ToastStack />
    </div>
  );
}
