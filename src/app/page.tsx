"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import DealPicker from "@/components/DealPicker";
import DealTimeline from "@/components/DealTimeline";
import DocsPanel from "@/components/DocsPanel";
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
  const { deals, lang, initializeDeals, simulateEvent, getSelectedDeal } = useStore();
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize deals on mount
  useEffect(() => {
    if (!initialized) {
      initializeDeals();
      setInitialized(true);
    }
  }, [initialized, initializeDeals]);

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

  if (!initialized || deals.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-sand-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <h1 className="text-xl font-bold text-gradient mb-2">DeedFlow</h1>
          <p className="text-sm text-gray-500">Loading deals...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div dir={dir} className="h-screen flex flex-col bg-sand-50">
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel — Deal Picker */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-72 border-r border-gray-100 bg-white flex-shrink-0 overflow-hidden flex flex-col"
        >
          <DealPicker />
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {deal ? (
            <div className="max-w-5xl mx-auto space-y-4">
              {/* Deal Header Card */}
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
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

              {/* Main Grid */}
              <div className="grid grid-cols-12 gap-4">
                {/* Timeline + Docs (left 7 cols) */}
                <div className="col-span-7 space-y-4">
                  {/* Timeline */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4"
                  >
                    <DealTimeline
                      steps={deal.steps}
                      onStepClick={(step) => setSelectedStep(step.id)}
                      selectedStepId={selectedStep || undefined}
                    />
                  </motion.div>

                  {/* Documents */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4"
                  >
                    <DocsPanel docs={deal.docs} steps={deal.steps} dealId={deal.id} />
                  </motion.div>

                  {/* Forecast Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4"
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
                    className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4"
                  >
                    <AgentPanel deal={deal} />
                  </motion.div>

                  {/* Governance */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4"
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
                className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4"
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
    draft: "bg-gray-100 text-gray-600 border-gray-300",
    active: "bg-emerald-100 text-emerald-700 border-emerald-300 pulse-glow",
    completed: "bg-gold-100 text-gold-700 border-gold-300",
    on_hold: "bg-red-100 text-red-600 border-red-300",
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
