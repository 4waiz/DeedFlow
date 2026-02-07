"use client";

import { Party } from "@/lib/types";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Users } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  parties: Party[];
  majorityThreshold: number;
  totalShares: number;
  sharePrice: number;
  monthlyRent?: number;
}

export default function GovernanceCard({ parties, majorityThreshold, totalShares, sharePrice, monthlyRent = 8500 }: Props) {
  const { lang } = useStore();
  const buyers = parties.filter((p) => p.role === "buyer");
  const hasMajority = buyers.some((b) => (b.sharePercent || 0) >= majorityThreshold);
  const majorityHolder = buyers.find((b) => (b.sharePercent || 0) >= majorityThreshold);

  return (
    <div className="space-y-3">
      {/* Governance Status */}
      <div className={cn(
        "p-3 rounded-xl border",
        hasMajority ? "bg-gold-50 border-gold-300" : "bg-emerald-50 border-emerald-200"
      )}>
        <div className="flex items-center gap-2 mb-2">
          {hasMajority ? (
            <AlertTriangle size={16} className="text-gold-600" />
          ) : (
            <Shield size={16} className="text-emerald-600" />
          )}
          <span className="text-xs font-bold">
            {hasMajority ? t("governance.majority", lang) : t("governance.normal", lang)}
          </span>
        </div>
        <p className="text-[10px] text-gray-600">
          {t("governance.threshold", lang)}: {majorityThreshold}%
        </p>
        {hasMajority && majorityHolder && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-medium text-gold-700 mt-1"
          >
            🦅 {majorityHolder.name} holds {majorityHolder.sharePercent}% — management control & veto rights activated
          </motion.p>
        )}
      </div>

      {/* Ownership breakdown */}
      <div className="p-3 rounded-xl border border-gray-100 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Users size={14} className="text-gray-500" />
          <span className="text-xs font-bold text-gray-900">{t("deal.parties", lang)}</span>
        </div>
        <div className="space-y-1.5">
          {parties.filter((p) => p.sharePercent !== undefined && p.sharePercent > 0 && p.role === "buyer").map((party) => (
            <div key={party.id} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-900">{party.name}</span>
                  <span className={cn(
                    "font-bold",
                    (party.sharePercent || 0) >= majorityThreshold ? "text-gold-600" : "text-emerald-600"
                  )}>
                    {party.sharePercent}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${party.sharePercent || 0}%` }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      "h-full rounded-full",
                      (party.sharePercent || 0) >= majorityThreshold ? "bg-gold-400" : "bg-emerald-400"
                    )}
                  />
                </div>
              </div>
              <span className={cn(
                "text-[9px] font-medium px-1.5 py-0.5 rounded-full",
                party.kycStatus === "verified" ? "bg-emerald-100 text-emerald-600" : "bg-gold-100 text-gold-600"
              )}>
                {party.kycStatus === "verified" ? "✓ KYC" : "⏳ KYC"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rent Distribution */}
      <div className="p-3 rounded-xl border border-gray-100 bg-white">
        <h4 className="text-xs font-bold text-gray-900 mb-2">
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
              <div key={buyer.id} className="flex justify-between text-xs py-0.5 border-b border-gray-50 last:border-0">
                <span className="text-gray-700">{buyer.name}</span>
                <span className="font-semibold text-emerald-700">
                  AED {rent.toLocaleString()}/mo <span className="text-gray-400">({share}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
