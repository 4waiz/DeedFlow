"use client";

import { AuditEntry } from "@/lib/types";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Trophy } from "lucide-react";
import { mockLeaderboard } from "@/lib/mock-data";

interface Props {
  entries: AuditEntry[];
}

export default function AuditFeed({ entries }: Props) {
  const { lang } = useStore();

  return (
    <div className="flex gap-4 h-full">
      {/* Activity Feed */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={14} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-white">
            {t("audit.title", lang)}
          </h3>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">
            {entries.length} events
          </span>
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {entries.slice(0, 10).map((entry) => (
              <motion.div
                key={entry.ts + entry.action}
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-sm mt-0.5 flex-shrink-0">{entry.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-300">{entry.actor}</span>
                    <span className="text-[10px] text-emerald-400 font-medium">{entry.action}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{entry.detail}</p>
                </div>
                <span className="text-[9px] text-gray-600 flex-shrink-0">
                  {formatTimeAgo(entry.ts)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="w-52 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={14} className="text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            {t("audit.leaderboard", lang)}
          </h3>
        </div>
        <div className="space-y-1">
          {mockLeaderboard.map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"
            >
              <span className="text-sm">{entry.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-300 truncate">{entry.name}</p>
                <p className="text-[9px] text-gray-500">{entry.reviews} reviews • avg {entry.avgDays}d</p>
              </div>
              {i === 0 && <span className="text-[10px]">🥇</span>}
              {i === 1 && <span className="text-[10px]">🥈</span>}
              {i === 2 && <span className="text-[10px]">🥉</span>}
            </motion.div>
          ))}
        </div>
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
