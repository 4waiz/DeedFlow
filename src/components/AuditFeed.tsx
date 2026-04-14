"use client";

import { AuditEntry } from "@/lib/types";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

interface Props {
  entries: AuditEntry[];
}

export default function AuditFeed({ entries }: Props) {
  const { lang } = useStore();

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Activity size={16} className="text-emerald-400" />
        <h3 className="text-sm font-bold text-white">
          {t("audit.title", lang)}
        </h3>
        <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
          {entries.length} events
        </span>
      </div>
      <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {entries.slice(0, 10).map((entry) => (
            <motion.div
              key={entry.ts + entry.action}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              <span className="text-base mt-0.5 flex-shrink-0">{entry.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-300">{entry.actor}</span>
                  <span className="text-sm text-emerald-400 font-medium">{entry.action}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{entry.detail}</p>
              </div>
              <span className="text-xs text-gray-600 flex-shrink-0 mt-0.5">
                {formatTimeAgo(entry.ts)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function formatTimeAgo(ts: string): string {
  const now = Date.now();
  const date = new Date(ts).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
