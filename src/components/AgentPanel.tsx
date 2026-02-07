"use client";

import { Deal, CopilotInsight } from "@/lib/types";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Bot, ArrowRight, Shield, AlertTriangle, Zap } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  deal: Deal;
}

export default function AgentPanel({ deal }: Props) {
  const { lang, getCopilotInsight, addToast } = useStore();
  const insight: CopilotInsight = getCopilotInsight(deal);

  const recColors: Record<string, { bg: string; text: string; icon: typeof Shield; border: string; glow: string }> = {
    PROCEED: { bg: "bg-emerald-500/[0.08]", text: "text-emerald-400", icon: Shield, border: "border-emerald-500/30", glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]" },
    HOLD: { bg: "bg-amber-500/[0.08]", text: "text-amber-400", icon: AlertTriangle, border: "border-amber-500/30", glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]" },
    ESCALATE: { bg: "bg-red-500/[0.08]", text: "text-red-400", icon: Zap, border: "border-red-500/30", glow: "shadow-[0_0_15px_rgba(239,68,68,0.1)]" },
  };

  const config = recColors[insight.recommendation];
  const RecIcon = config.icon;

  const handleAction = (action: string, label: string) => {
    addToast(`${label} — action triggered for ${deal.name}`, "info");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.25)]">
          <Bot size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {t("agent.title", lang)}
          </h3>
          <p className="text-[10px] text-gray-500">AI-powered compliance analysis</p>
        </div>
      </div>

      {/* Recommendation Badge */}
      <motion.div
        key={insight.recommendation}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("p-3 rounded-xl border-2 mb-3", config.bg, config.border, config.glow)}
      >
        <div className="flex items-center gap-2 mb-1">
          <RecIcon size={18} className={config.text} />
          <span className={cn("text-lg font-black", config.text)}>
            {lang === "ar" ? t(`agent.${insight.recommendation.toLowerCase()}`, lang) : insight.recommendation}
          </span>
        </div>
        <div className="h-0.5 bg-white/[0.06] rounded my-2" />
        <ul className="space-y-1.5">
          {(lang === "ar" ? insight.rationaleAr : insight.rationale).map((r: string, i: number) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-1.5 text-xs text-gray-400"
            >
              <span className="text-[10px] mt-0.5">•</span>
              {r}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Action Buttons */}
      <div className="space-y-1.5">
        {insight.actions.map((action) => (
          <motion.button
            key={action.action}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction(action.action, lang === "ar" ? action.labelAr : action.label)}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/30 hover:bg-emerald-500/[0.05] transition-all text-left"
          >
            <span className="text-xs font-medium text-gray-300">
              {lang === "ar" ? action.labelAr : action.label}
            </span>
            <ArrowRight size={14} className="text-gray-500" />
          </motion.button>
        ))}
      </div>

      {/* Deal metrics summary */}
      <div className="mt-auto pt-3 border-t border-white/[0.06]">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
            <p className="text-[10px] text-gray-500">Score</p>
            <p className="text-sm font-bold text-emerald-400">{deal.metrics.complianceScore}</p>
          </div>
          <div className="p-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
            <p className="text-[10px] text-gray-500">Risk</p>
            <p className="text-sm font-bold text-amber-400">{deal.metrics.riskScore}</p>
          </div>
          <div className="p-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
            <p className="text-[10px] text-gray-500">Days</p>
            <p className="text-sm font-bold text-gray-300">{deal.metrics.estTimeToCloseDays}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
