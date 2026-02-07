"use client";

import { Party } from "@/lib/types";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  parties: Party[];
  monthlyRent?: number;
}

export default function GovernanceCard({ parties, monthlyRent = 8500 }: Props) {
  const { lang } = useStore();
  const buyers = parties.filter((p) => p.role === "buyer");

  return (
    <div className="space-y-3">
      {/* Ownership breakdown */}
      <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.03]">
        <div className="flex items-center gap-2 mb-2">
          <Users size={14} className="text-gray-500" />
          <span className="text-xs font-bold text-white">{t("deal.parties", lang)}</span>
        </div>
        <div className="space-y-1.5">
          {parties.filter((p) => p.sharePercent !== undefined && p.sharePercent > 0 && p.role === "buyer").map((party) => (
            <div key={party.id} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-300">{party.name}</span>
                  <span className="font-bold text-emerald-400">
                    {party.sharePercent}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mt-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${party.sharePercent || 0}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-emerald-500"
                  />
                </div>
              </div>
              <span className={cn(
                "text-[9px] font-medium px-1.5 py-0.5 rounded-full",
                party.kycStatus === "verified" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
              )}>
                {party.kycStatus === "verified" ? "✓ KYC" : "⏳ KYC"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rent Distribution */}
      <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.03]">
        <h4 className="text-xs font-bold text-white mb-2">
          💰 {t("deal.rent", lang)}
        </h4>
        <div className="text-[10px] text-gray-500 mb-2">
          Monthly rent: AED {monthlyRent.toLocaleString()} • Pro-rata distribution
        </div>
        <div className="space-y-1">
          {buyers.map((buyer) => {
            const share = buyer.sharePercent || 0;
            const rent = Math.round((share / 100) * monthlyRent);
            return (
              <div key={buyer.id} className="flex justify-between text-xs py-0.5 border-b border-white/[0.04] last:border-0">
                <span className="text-gray-400">{buyer.name}</span>
                <span className="font-semibold text-emerald-400">
                  AED {rent.toLocaleString()}/mo <span className="text-gray-600">({share}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
