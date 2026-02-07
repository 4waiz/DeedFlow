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

  const recColors: Record<string, { bg: string; text: string; icon: typeof Shield; border: string }> = {
    PROCEED: { bg: "bg-emerald-50", text: "text-emerald-700", icon: Shield, border: "border-emerald-300" },
    HOLD: { bg: "bg-gold-50", text: "text-gold-700", icon: AlertTriangle, border: "border-gold-300" },
    ESCALATE: { bg: "bg-red-50", text: "text-red-600", icon: Zap, border: "border-red-300" },
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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">
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
        className={cn("p-3 rounded-xl border-2 mb-3", config.bg, config.border)}
      >
        <div className="flex items-center gap-2 mb-1">
          <RecIcon size={18} className={config.text} />
          <span className={cn("text-lg font-black", config.text)}>
            {lang === "ar" ? t(`agent.${insight.recommendation.toLowerCase()}`, lang) : insight.recommendation}
          </span>
        </div>
        <div className="h-0.5 bg-white/50 rounded my-2" />
        <ul className="space-y-1.5">
          {(lang === "ar" ? insight.rationaleAr : insight.rationale).map((r: string, i: number) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-1.5 text-xs text-gray-700"
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
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left"
          >
            <span className="text-xs font-medium text-gray-900">
              {lang === "ar" ? action.labelAr : action.label}
            </span>
            <ArrowRight size={14} className="text-gray-400" />
          </motion.button>
        ))}
      </div>

      {/* Deal metrics summary */}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-1.5 bg-gray-50 rounded-lg">
            <p className="text-[10px] text-gray-500">Score</p>
            <p className="text-sm font-bold text-emerald-600">{deal.metrics.complianceScore}</p>
          </div>
          <div className="p-1.5 bg-gray-50 rounded-lg">
            <p className="text-[10px] text-gray-500">Risk</p>
            <p className="text-sm font-bold text-gold-600">{deal.metrics.riskScore}</p>
          </div>
          <div className="p-1.5 bg-gray-50 rounded-lg">
            <p className="text-[10px] text-gray-500">Days</p>
            <p className="text-sm font-bold text-gray-700">{deal.metrics.estTimeToCloseDays}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
