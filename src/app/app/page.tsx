"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import DealTimeline from "@/components/DealTimeline";
import DocsPanel from "@/components/DocsPanel";
import GovernanceCard from "@/components/GovernanceCard";
import AgentPanel from "@/components/AgentPanel";
import AuditFeed from "@/components/AuditFeed";
import DemoScriptModal from "@/components/DemoScriptModal";
import ToastStack from "@/components/ToastStack";
import ChatBot from "@/components/ChatBot";
import { cn } from "@/lib/cn";
import {
  MapPin, Building2, Coins, DollarSign, Calendar,
  TrendingUp, Upload, ShieldCheck, AlertTriangle, Clock,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const {
    deals, lang, user, initializeDeals, simulateEvent,
    getSelectedDeal, selectedStepId, setSelectedStepId, setDocsFilterRequired,
  } = useStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => { if (!user) router.push("/login"); }, [user, router]);
  useEffect(() => { if (!initialized && user) { initializeDeals(); setInitialized(true); } }, [initialized, initializeDeals, user]);
  useEffect(() => {
    if (deals.length === 0) return;
    const timer = setInterval(() => {
      const d = deals.find((d) => d.status === "active");
      if (d) { const ev = ["doc_verified", "step_completed", "approval_delay"] as const; simulateEvent({ type: ev[Math.floor(Math.random() * ev.length)], dealId: d.id }); }
    }, 15000);
    return () => clearInterval(timer);
  }, [deals, simulateEvent]);

  const deal = getSelectedDeal();
  const dir = lang === "ar" ? "rtl" : "ltr";

  if (!user) return null;

  if (!initialized || deals.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0c0f1a]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-[0_8px_32px_rgba(16,185,129,0.25)]">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">DeedFlow</h1>
          <p className="text-sm text-gray-500">Loading deals...</p>
        </motion.div>
      </div>
    );
  }

  const compScore = deal?.metrics.complianceScore ?? 0;
  const riskScore = deal?.metrics.riskScore ?? 0;
  const daysLeft = deal?.metrics.estTimeToCloseDays ?? 0;

  const compColor = compScore >= 80 ? "text-emerald-400" : compScore >= 50 ? "text-amber-400" : "text-red-400";
  const riskColor = riskScore >= 60 ? "text-red-400" : riskScore >= 30 ? "text-amber-400" : "text-emerald-400";

  return (
    <div dir={dir} className="h-screen flex flex-col bg-[#0c0f1a]">
      <div className="bg-particles" />
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto px-8 py-6 bg-[#0c0f1a]">
          {deal ? (
            <div className="max-w-6xl mx-auto space-y-6">

              {/* ====== DEAL HEADER — everything at a glance ====== */}
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

                {/* Top: Name + Status + Actions */}
                <div className="px-6 pt-6 pb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {lang === "ar" ? deal.nameAr : deal.name}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-500" />{deal.city}</span>
                      <span className="flex items-center gap-1.5">
                        {deal.tokenizationMode === "fractional" ? <Building2 size={14} className="text-gray-500" /> : <Coins size={14} className="text-gray-500" />}
                        {deal.tokenizationMode}
                      </span>
                      <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-gray-500" />AED {deal.totalValue.toLocaleString()}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-500" />{new Date(deal.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => document.getElementById("docs-panel")?.scrollIntoView({ behavior: "smooth" })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-sm font-medium text-emerald-400"
                    >
                      <Upload size={14} /> Upload Doc
                    </button>
                    <Link
                      href="/app/property"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all text-sm font-medium text-blue-400"
                    >
                      <TrendingUp size={14} /> My Property
                    </Link>
                    <DealStatusBadge status={deal.status} lang={lang} />
                  </div>
                </div>

                {/* Bottom: 3 Key Metrics */}
                <div className="px-6 pb-5 grid grid-cols-3 gap-4">
                  <MetricCard icon={ShieldCheck} label="Compliance Score" value={compScore} suffix="/100" color={compColor} />
                  <MetricCard icon={AlertTriangle} label="Risk Score" value={riskScore} suffix="/100" color={riskColor} />
                  <MetricCard icon={Clock} label="Est. Days to Close" value={daysLeft} suffix=" days" color="text-white" />
                </div>
              </motion.div>

              {/* ====== COPILOT + TIMELINE ====== */}
              <div className="grid grid-cols-12 gap-5">
                <motion.div
                  id="compliance-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="col-span-7 bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-5"
                >
                  <AgentPanel deal={deal} />
                </motion.div>

                <motion.div
                  id="deal-timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="col-span-5 bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-5"
                >
                  <DealTimeline
                    steps={deal.steps}
                    onStepClick={(step) => {
                      setSelectedStepId(step.id);
                      setDocsFilterRequired(step.requiredDocs.length > 0 ? [...step.requiredDocs] : []);
                    }}
                    selectedStepId={selectedStepId || undefined}
                  />
                </motion.div>
              </div>

              {/* ====== DOCUMENTS ====== */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-5"
                id="docs-panel"
              >
                <DocsPanel docs={deal.docs} steps={deal.steps} dealId={deal.id} deal={deal} />
              </motion.div>

              {/* ====== GOVERNANCE + ACTIVITY ====== */}
              <div className="grid grid-cols-12 gap-5">
                <motion.div
                  id="governance-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="col-span-5 bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-5"
                >
                  <GovernanceCard parties={deal.parties} />
                </motion.div>

                <motion.div
                  id="activity-feed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="col-span-7 bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-5"
                >
                  <AuditFeed entries={deal.audit} />
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-sm">Select a deal to view details</p>
            </div>
          )}
        </main>
      </div>

      <DemoScriptModal />
      <ToastStack />
      <ChatBot />
    </div>
  );
}

/* ---- Subcomponents ---- */

function MetricCard({ icon: Icon, label, value, suffix, color }: {
  icon: typeof ShieldCheck; label: string; value: number; suffix: string; color: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
        <Icon size={18} className={color} />
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className={cn("text-xl font-bold", color)}>
          {value}<span className="text-sm font-normal text-gray-500">{suffix}</span>
        </p>
      </div>
    </div>
  );
}

function DealStatusBadge({ status, lang }: { status: string; lang: "en" | "ar" }) {
  const colors: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 pulse-glow",
    completed: "bg-gold-500/10 text-gold-400 border-gold-500/20",
    on_hold: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <motion.span
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={cn("px-3 py-1.5 text-sm font-bold rounded-full border", colors[status])}
    >
      {t(`status.${status}`, lang)}
    </motion.span>
  );
}
