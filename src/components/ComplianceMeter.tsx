"use client";

import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface Props {
  score: number;
  type: "compliance" | "risk";
}

export default function ComplianceMeter({ score, type }: Props) {
  const { lang } = useStore();

  const isCompliance = type === "compliance";
  const label = isCompliance ? t("deal.compliance", lang) : t("deal.risk", lang);
  const emoji = isCompliance ? (score >= 80 ? "✅" : score >= 50 ? "⚠️" : "🚨") : (score >= 60 ? "🚨" : score >= 30 ? "⚠️" : "✅");

  const getColor = () => {
    if (isCompliance) {
      if (score >= 80) return "from-emerald-400 to-emerald-600";
      if (score >= 50) return "from-gold-400 to-gold-600";
      return "from-red-400 to-red-600";
    }
    if (score >= 60) return "from-red-400 to-red-600";
    if (score >= 30) return "from-gold-400 to-gold-600";
    return "from-emerald-400 to-emerald-600";
  };

  const getBgColor = () => {
    if (isCompliance) {
      if (score >= 80) return "bg-emerald-500/[0.08] border-emerald-500/20";
      if (score >= 50) return "bg-amber-500/[0.08] border-amber-500/20";
      return "bg-red-500/[0.08] border-red-500/20";
    }
    if (score >= 60) return "bg-red-500/[0.08] border-red-500/20";
    if (score >= 30) return "bg-amber-500/[0.08] border-amber-500/20";
    return "bg-emerald-500/[0.08] border-emerald-500/20";
  };

  return (
    <div className={cn("p-3 rounded-xl border", getBgColor())}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted">{label}</span>
        <span className="text-lg font-bold text-white">
          {emoji} {score}
        </span>
      </div>
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full bg-gradient-to-r", getColor())}
        />
      </div>
      <p className="text-[10px] text-gray-500 mt-1">
        {isCompliance
          ? score >= 80 ? "Ready for settlement" : score >= 50 ? "More verification needed" : "Critical docs missing"
          : score >= 60 ? "High risk — escalation needed" : score >= 30 ? "Moderate — monitor closely" : "Low risk — all clear"}
      </p>
    </div>
  );
}
