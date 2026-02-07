"use client";

import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Plus, Building2, Coins, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { TokenizationMode } from "@/lib/types";

export default function DealPicker() {
  const { deals, selectedDealId, selectDeal, lang } = useStore();
  const [filter, setFilter] = useState<"all" | TokenizationMode>("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = filter === "all" ? deals : deals.filter((d) => d.tokenizationMode === filter);

  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-400",
    active: "bg-emerald-500/10 text-emerald-400",
    completed: "bg-yellow-500/10 text-yellow-400",
    on_hold: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="flex flex-col h-full bg-[#0e1119]">
      <div className="p-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">
            {t("deals.title", lang)}
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors border border-emerald-500/20"
          >
            <Plus size={12} />
            {t("deals.create", lang)}
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex gap-1">
          {(["all", "fractional", "tokenized"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                filter === f
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-400 border border-transparent"
              )}
            >
              {f === "all" ? t("deals.filter.all", lang) : f === "fractional" ? t("deals.filter.fractional", lang) : t("deals.filter.tokenized", lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Create Deal Form */}
      {showCreate && <CreateDealForm onClose={() => setShowCreate(false)} />}

      {/* Deal List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filtered.map((deal, i) => {
          const isSelected = deal.id === selectedDealId;
          const completedSteps = deal.steps.filter((s) => s.status === "done").length;
          return (
            <motion.button
              key={deal.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => selectDeal(deal.id)}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all border backdrop-blur-sm",
                isSelected
                  ? "bg-emerald-500/[0.08] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.10)]"
                  : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]"
              )}
            >
              <div className="flex items-start justify-between mb-1.5">
                <h3 className="text-sm font-semibold text-white leading-tight pr-2">
                  {lang === "ar" ? deal.nameAr : deal.name}
                </h3>
                <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap", statusColors[deal.status])}>
                  {t(`status.${deal.status}`, lang)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2">
                <span className="flex items-center gap-0.5">
                  <MapPin size={10} />
                  {deal.city}
                </span>
                <span className="flex items-center gap-0.5">
                  {deal.tokenizationMode === "fractional" ? <Building2 size={10} /> : <Coins size={10} />}
                  {deal.tokenizationMode}
                </span>
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedSteps / deal.steps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
                <span className="text-[10px] font-medium text-gray-500">
                  {completedSteps}/{deal.steps.length}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function CreateDealForm({ onClose }: { onClose: () => void }) {
  const { deals, setDeals, selectDeal, addToast } = useStore();
  const [name, setName] = useState("");
  const [city, setCity] = useState<"Dubai" | "Abu Dhabi">("Dubai");
  const [mode, setMode] = useState<TokenizationMode>("fractional");

  const handleCreate = () => {
    if (!name.trim()) {
      addToast("Please enter a deal name", "warning");
      return;
    }
    const newId = `deal-${String(deals.length + 1).padStart(3, "0")}`;
    const newDeal = {
      id: newId,
      name: name.trim(),
      nameAr: name.trim() + " (AR)",
      city: city as "Dubai" | "Abu Dhabi",
      propertyType: "residential" as const,
      tokenizationMode: mode,
      totalShares: 100,
      sharePrice: 10000,
      currency: "AED" as const,
      totalValue: 1000000,
      propertyAddress: `${city}, UAE`,
      propertyAddressAr: city === "Dubai" ? "دبي، الإمارات" : "أبوظبي، الإمارات",
      status: "draft" as const,
      createdAt: new Date().toISOString(),
      parties: [{ id: `p-${Date.now()}`, name: "Property Owner", role: "seller" as const, sharePercent: 100, kycStatus: "pending" as const, email: "owner@example.ae" }],
      steps: [
        { id: `s-${Date.now()}-1`, title: "KYC/AML Verification", titleAr: "التحقق من الهوية", status: "todo" as const, requiredDocs: ["kyc_doc", "passport"], notes: [], order: 1 },
        { id: `s-${Date.now()}-2`, title: "Title Deed Verification", titleAr: "التحقق من سند الملكية", status: "todo" as const, requiredDocs: ["title_deed"], notes: [], order: 2 },
        { id: `s-${Date.now()}-3`, title: "NOC Collection", titleAr: "جمع شهادات عدم الممانعة", status: "todo" as const, requiredDocs: ["noc"], notes: [], order: 3 },
        { id: `s-${Date.now()}-4`, title: "Property Valuation", titleAr: "تقييم العقار", status: "todo" as const, requiredDocs: ["valuation_report"], notes: [], order: 4 },
        { id: `s-${Date.now()}-5`, title: "Escrow Setup", titleAr: "إعداد حساب الضمان", status: "todo" as const, requiredDocs: ["escrow_agreement"], notes: [], order: 5 },
        { id: `s-${Date.now()}-6`, title: "Settlement", titleAr: "التسوية", status: "todo" as const, requiredDocs: ["spa"], notes: [], order: 6 },
        { id: `s-${Date.now()}-7`, title: "Token/Share Issuance", titleAr: "إصدار الحصص", status: "todo" as const, requiredDocs: [], notes: [], order: 7 },
        { id: `s-${Date.now()}-8`, title: "Post-Close Automation", titleAr: "أتمتة ما بعد الإغلاق", status: "todo" as const, requiredDocs: [], notes: [], order: 8 },
      ],
      docs: [],
      audit: [{ ts: new Date().toISOString(), actor: "System", action: "Deal Created", detail: `New deal "${name}" created — yalla!`, emoji: "🏡" }],
      fieldReports: [],
      metrics: { complianceScore: 0, riskScore: 30, estTimeToCloseDays: 30 },
    };
    setDeals([...deals, newDeal]);
    selectDeal(newId);
    addToast(`Deal "${name}" created!`, "success");
    onClose();
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="border-b border-white/[0.06] overflow-hidden"
    >
      <div className="p-3 space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Deal name..."
          className="w-full px-3 py-1.5 text-sm rounded-lg border border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-500 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-colors"
        />
        <div className="flex gap-2">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value as "Dubai" | "Abu Dhabi")}
            className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-white/[0.08] bg-white/[0.04] text-gray-400 focus:border-emerald-500/40 outline-none transition-colors"
          >
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
          </select>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as TokenizationMode)}
            className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-white/[0.08] bg-white/[0.04] text-gray-400 focus:border-emerald-500/40 outline-none transition-colors"
          >
            <option value="fractional">Fractional</option>
            <option value="tokenized">Tokenized</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCreate} className="flex-1 px-3 py-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 border border-emerald-500/20 transition-colors">
            Create
          </button>
          <button onClick={onClose} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-400 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}
