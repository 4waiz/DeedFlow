"use client";

import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Globe,
  Zap,
  BookOpen,
  LayoutDashboard,
  Gavel,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

export default function TopBar() {
  const { lang, setLang, setDemoScriptOpen, user, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/app", label: t("nav.dashboard", lang), icon: LayoutDashboard },
    { href: "/judge", label: t("nav.judge", lang), icon: Gavel },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50"
      style={{
        background: "rgba(20, 24, 37, 0.85)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Logo + Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="DeedFlow"
              width={140}
              height={36}
              className="h-9 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              priority
            />
          </Link>
          {/* Demo Mode badge with gold glow */}
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="px-2 py-0.5 text-[10px] font-semibold rounded-full"
            style={{
              background: "rgba(251, 191, 36, 0.1)",
              color: "#fbbf24",
              border: "1px solid rgba(251, 191, 36, 0.3)",
              boxShadow: "0 0 12px rgba(251, 191, 36, 0.15), inset 0 0 8px rgba(251, 191, 36, 0.05)",
              textShadow: "0 0 8px rgba(251, 191, 36, 0.4)",
            }}
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
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                )}
                style={
                  isActive
                    ? {
                        background: "rgba(52, 211, 153, 0.12)",
                        color: "#6ee7b7",
                        boxShadow: "0 0 12px rgba(52, 211, 153, 0.1), inset 0 0 12px rgba(52, 211, 153, 0.05)",
                        border: "1px solid rgba(52, 211, 153, 0.15)",
                      }
                    : {
                        color: "#9ca3af",
                        border: "1px solid transparent",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#e5e7eb";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    e.currentTarget.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.03)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#9ca3af";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Demo Script — emerald accent */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setDemoScriptOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
            style={{
              background: "rgba(52, 211, 153, 0.1)",
              color: "#6ee7b7",
              border: "1px solid rgba(52, 211, 153, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(52, 211, 153, 0.18)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(52, 211, 153, 0.15)";
              e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(52, 211, 153, 0.1)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.2)";
            }}
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              color: "#d1d5db",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.color = "#f3f4f6";
              e.currentTarget.style.boxShadow = "0 0 12px rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
              e.currentTarget.style.color = "#d1d5db";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            <Globe size={14} />
            {t("lang.toggle", lang)}
          </motion.button>

          {/* Settings Button */}
          <Link
            href="/app/settings"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              color: "#d1d5db",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.color = "#f3f4f6";
              e.currentTarget.style.boxShadow = "0 0 12px rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
              e.currentTarget.style.color = "#d1d5db";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            <Settings size={14} />
          </Link>

          {/* User menu */}
          {user && (
            <div className="relative group">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  color: "#d1d5db",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-400">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs">{user.name}</span>
              </motion.button>

              {/* Dropdown */}
              <div
                className="absolute right-0 top-full mt-1 w-48 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
                style={{
                  background: "rgba(20, 24, 37, 0.95)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                }}
              >
                <div className="p-3 border-b border-white/[0.06]">
                  <p className="text-xs font-semibold text-white">{user.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5 capitalize">{user.role}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}

function SimulateDropdown() {
  const { lang, selectedDealId, simulateEvent } = useStore();
  const events = [
    { type: "step_completed" as const, label: "Complete Step", icon: "\u2705" },
    { type: "doc_verified" as const, label: "Verify Document", icon: "\ud83d\udcdc" },
    { type: "missing_doc" as const, label: t("sim.missing_doc", lang), icon: "\u26a0\ufe0f" },
    { type: "noc_delay" as const, label: "NOC Delay", icon: "\u23f3" },
    { type: "risk_surge" as const, label: t("sim.risk_surge", lang), icon: "\ud83d\udcc8" },
    { type: "approval_delay" as const, label: t("sim.approval_delay", lang), icon: "\u23f1\ufe0f" },
  ];

  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
        style={{
          background: "rgba(251, 191, 36, 0.1)",
          color: "#fbbf24",
          border: "1px solid rgba(251, 191, 36, 0.25)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(251, 191, 36, 0.18)";
          e.currentTarget.style.boxShadow = "0 0 16px rgba(251, 191, 36, 0.12)";
          e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(251, 191, 36, 0.1)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.25)";
        }}
      >
        <Zap size={14} />
        {t("simulate.event", lang)}
      </motion.button>
      {/* Dark dropdown panel */}
      <div
        className="absolute right-0 top-full mt-1 w-56 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
        style={{
          background: "rgba(20, 24, 37, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="p-1">
          {events.map((ev) => (
            <button
              key={ev.type}
              onClick={() => {
                if (selectedDealId) {
                  simulateEvent({ type: ev.type, dealId: selectedDealId });
                }
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-all duration-150"
              style={{
                color: "#d1d5db",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                e.currentTarget.style.color = "#f9fafb";
                e.currentTarget.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#d1d5db";
                e.currentTarget.style.boxShadow = "none";
              }}
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
