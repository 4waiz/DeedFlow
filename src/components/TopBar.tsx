"use client";

import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Globe,
  Zap,
  BookOpen,
  LayoutDashboard,
  Info,
  Gavel,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export default function TopBar() {
  const { lang, setLang, setDemoScriptOpen } = useStore();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("nav.dashboard", lang), icon: LayoutDashboard },
    { href: "/about", label: t("nav.about", lang), icon: Info },
    { href: "/judge", label: t("nav.judge", lang), icon: Gavel },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass border-b border-emerald-100"
    >
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Logo + Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold">D</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient leading-tight">
                {t("app.title", lang)}
              </h1>
              <p className="text-[10px] text-emerald-600/70 leading-tight">
                {t("app.subtitle", lang)}
              </p>
            </div>
          </Link>
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="px-2 py-0.5 text-[10px] font-semibold bg-gold-100 text-gold-700 rounded-full border border-gold-300"
          >
            {t("demo.mode", lang)}
          </motion.span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Demo Script */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDemoScriptOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            <BookOpen size={14} />
            {t("demo.script", lang)}
          </motion.button>

          {/* Simulate Event */}
          <SimulateDropdown />

          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <Globe size={14} />
            {t("lang.toggle", lang)}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

function SimulateDropdown() {
  const { lang, selectedDealId, simulateEvent } = useStore();
  const events = [
    { type: "step_completed" as const, label: "Complete Step", icon: "✅" },
    { type: "doc_verified" as const, label: "Verify Document", icon: "📜" },
    { type: "missing_doc" as const, label: t("sim.missing_doc", lang), icon: "⚠️" },
    { type: "noc_delay" as const, label: "NOC Delay", icon: "⏳" },
    { type: "risk_surge" as const, label: t("sim.risk_surge", lang), icon: "📈" },
    { type: "approval_delay" as const, label: t("sim.approval_delay", lang), icon: "⏱️" },
  ];

  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gold-50 text-gold-700 rounded-lg hover:bg-gold-100 transition-colors border border-gold-300"
      >
        <Zap size={14} />
        {t("simulate.event", lang)}
      </motion.button>
      <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-1">
          {events.map((ev) => (
            <button
              key={ev.type}
              onClick={() => {
                if (selectedDealId) {
                  simulateEvent({ type: ev.type, dealId: selectedDealId });
                }
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <span>{ev.icon}</span>
              {ev.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
