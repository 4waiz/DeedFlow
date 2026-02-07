"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import DealPicker from "@/components/DealPicker";
import DealTimeline from "@/components/DealTimeline";
import DocsPanel from "@/components/DocsPanel";
import DealFlowHeader from "@/components/DealFlowHeader";
import ComplianceMeter from "@/components/ComplianceMeter";
import GovernanceCard from "@/components/GovernanceCard";
import AgentPanel from "@/components/AgentPanel";
import AuditFeed from "@/components/AuditFeed";
import ForecastChart from "@/components/ForecastChart";
import DemoScriptModal from "@/components/DemoScriptModal";
import ToastStack from "@/components/ToastStack";
import ConfettiEffect from "@/components/ConfettiEffect";
import { cn } from "@/lib/cn";
import { MapPin, Building2, Coins, DollarSign, Hash, Calendar } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const {
    deals,
    lang,
    user,
    initializeDeals,
    simulateEvent,
    getSelectedDeal,
    selectedStepId,
    setSelectedStepId,
    setDocsFilterRequired,
  } = useStore();
  const [initialized, setInitialized] = useState(false);

  // Route guard: redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Initialize deals on mount
  useEffect(() => {
    if (!initialized && user) {
      initializeDeals();
      setInitialized(true);
    }
  }, [initialized, initializeDeals, user]);

  // Auto-simulation every ~15 seconds
  useEffect(() => {
    if (deals.length === 0) return;
    const timer = setInterval(() => {
      const activeDeal = deals.find((d) => d.status === "active");
      if (activeDeal) {
        const events = ["doc_verified", "step_completed", "approval_delay"] as const;
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        simulateEvent({ type: randomEvent, dealId: activeDeal.id });
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [deals, simulateEvent]);

  const deal = getSelectedDeal();
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Show nothing while checking auth
  if (!user) {
    return null;
  }

  if (!initialized || deals.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0c0f1a]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-[0_8px_32px_rgba(16,185,129,0.25)]">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">DeedFlow</h1>
          <p className="text-sm text-gray-500">Loading deals...</p>
          <div className="mt-4 flex justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/20 animate-pulse [animation-delay:0.4s]" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div dir={dir} className="h-screen flex flex-col bg-[#0c0f1a]">
      <div className="bg-particles" />
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel — Deal Picker */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-72 border-r border-white/[0.06] bg-[#0e1119] flex-shrink-0 overflow-hidden flex flex-col"
        >
          <DealPicker />
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-[#0c0f1a]">
          {deal ? (
            <div className="max-w-5xl mx-auto space-y-4">
              {/* Deal Header Card */}
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4 overflow-hidden"
              >
                {/* Subtle gradient top border */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {lang === "ar" ? deal.nameAr : deal.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {deal.city}
                      </span>
                      <span className="flex items-center gap-1">
                        {deal.tokenizationMode === "fractional" ? <Building2 size={12} /> : <Coins size={12} />}
                        {deal.tokenizationMode}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={12} />
                        AED {deal.totalValue.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Hash size={12} />
                        {deal.totalShares} shares @ AED {deal.sharePrice.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(deal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <DealStatusBadge status={deal.status} lang={lang} />
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 gap-3">
                  <ComplianceMeter score={deal.metrics.complianceScore} type="compliance" />
                  <ComplianceMeter score={deal.metrics.riskScore} type="risk" />
                </div>
              </motion.div>

              {/* Deal Flow Header */}
              <DealFlowHeader deal={deal} />

              {/* Main Grid */}
              <div className="grid grid-cols-12 gap-4">
                {/* Timeline + Docs (left 7 cols) */}
                <div className="col-span-7 space-y-4">
                  {/* Timeline */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4"
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

                  {/* Documents */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4"
                    id="docs-panel"
                  >
                    <DocsPanel docs={deal.docs} steps={deal.steps} dealId={deal.id} />
                  </motion.div>

                  {/* Forecast Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4"
                  >
                    <ForecastChart
                      complianceScore={deal.metrics.complianceScore}
                      riskScore={deal.metrics.riskScore}
                      estDays={deal.metrics.estTimeToCloseDays}
                    />
                  </motion.div>
                </div>

                {/* Right side (5 cols) — Agent + Governance */}
                <div className="col-span-5 space-y-4">
                  {/* Agent Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4"
                  >
                    <AgentPanel deal={deal} />
                  </motion.div>

                  {/* Governance */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4"
                  >
                    <GovernanceCard
                      parties={deal.parties}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Bottom — Audit Feed */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4"
              >
                <AuditFeed entries={deal.audit} />
              </motion.div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-sm">Select a deal to view details</p>
            </div>
          )}
        </main>
      </div>

      {/* Overlays */}
      <DemoScriptModal />
      <ToastStack />
      <ConfettiEffect />
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
      className={cn("px-3 py-1 text-xs font-bold rounded-full border", colors[status])}
    >
      {t(`status.${status}`, lang)}
    </motion.span>
  );
}
