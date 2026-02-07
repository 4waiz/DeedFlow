"use client";

import { DealStep, StepStatus } from "@/lib/types";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Check, Clock, AlertCircle, Circle } from "lucide-react";
import { cn } from "@/lib/cn";

const statusConfig: Record<StepStatus, { icon: typeof Check; color: string; bg: string }> = {
  done: { icon: Check, color: "text-emerald-600", bg: "bg-emerald-100 border-emerald-300" },
  in_progress: { icon: Clock, color: "text-gold-600", bg: "bg-gold-100 border-gold-300" },
  blocked: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-100 border-red-300" },
  todo: { icon: Circle, color: "text-gray-400", bg: "bg-gray-100 border-gray-200" },
};

interface Props {
  steps: DealStep[];
  onStepClick?: (step: DealStep) => void;
  selectedStepId?: string;
}

export default function DealTimeline({ steps, onStepClick, selectedStepId }: Props) {
  const { lang } = useStore();

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-bold text-gray-900 mb-3">
        {t("deal.timeline", lang)}
      </h3>
      <div className="relative">
        {steps.map((step, i) => {
          const config = statusConfig[step.status];
          const Icon = config.icon;
          const isSelected = step.id === selectedStepId;
          const isLast = i === steps.length - 1;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative flex gap-3 pb-3 last:pb-0"
            >
              {/* Connector line */}
              {!isLast && (
                <div className="absolute left-[13px] top-[26px] w-0.5 h-[calc(100%-14px)] bg-gray-200" />
              )}

              {/* Step icon */}
              <button
                onClick={() => onStepClick?.(step)}
                className={cn(
                  "relative z-10 flex-shrink-0 w-[26px] h-[26px] rounded-full border-2 flex items-center justify-center transition-all",
                  config.bg,
                  isSelected && "ring-2 ring-emerald-400 ring-offset-1"
                )}
              >
                <Icon size={12} className={config.color} />
              </button>

              {/* Step content */}
              <button
                onClick={() => onStepClick?.(step)}
                className={cn(
                  "flex-1 text-left p-2 rounded-lg transition-all -mt-0.5",
                  isSelected ? "bg-emerald-50" : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-900">
                    {lang === "ar" ? step.titleAr : step.title}
                  </span>
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", config.bg, config.color)}>
                    {t(`status.${step.status}`, lang)}
                  </span>
                </div>
                {step.blockedReason && (
                  <p className="text-[10px] text-red-500 mt-0.5">
                    {step.blockedReason}
                  </p>
                )}
                {step.notes.length > 0 && (
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {step.notes[step.notes.length - 1]}
                  </p>
                )}
                {step.completedAt && (
                  <p className="text-[10px] text-emerald-500 mt-0.5">
                    Completed {new Date(step.completedAt).toLocaleDateString()}
                  </p>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
