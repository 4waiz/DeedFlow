"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import ToastStack from "@/components/ToastStack";
import DemoScriptModal from "@/components/DemoScriptModal";
import {
  ArrowLeft,
  Globe,
  Moon,
  Sun,
  LogOut,
  User,
  Lock,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { user, lang, setLang, logout, addToast } = useStore();
  const [initialized, setInitialized] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Route guard: redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setInitialized(true);
    }
  }, [user, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      addToast("Logged out successfully", "success");
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/");
    } catch {
      addToast("Logout failed", "error");
      setIsLoggingOut(false);
    }
  };

  const handleLanguageChange = (newLang: "en" | "ar") => {
    setLang(newLang);
    addToast(
      newLang === "en"
        ? "Language changed to English"
        : "تم تغيير اللغة إلى العربية",
      "success"
    );
  };

  const handleThemeChange = (theme: "dark" | "light") => {
    setIsDark(theme === "dark");
    addToast(
      `${theme === "dark" ? "Dark" : "Light"} mode activated`,
      "success"
    );
  };

  if (!user || !initialized) {
    return null;
  }

  return (
    <div dir={dir} className="min-h-[100dvh] flex flex-col bg-[#0c0f1a]">
      <div className="bg-particles" />
      <TopBar />

      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
          >
            <Link
              href="/app"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </motion.div>

          {/* Account Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4 sm:p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <User size={20} className="text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Account</h2>
            </div>

            {/* User Info */}
            <div className="bg-white/[0.02] rounded-xl p-4 mb-6 border border-white/[0.04]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-emerald-400">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                  <p className="text-xs text-emerald-400 mt-1 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogOut size={18} />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </motion.button>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4 sm:p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell size={20} className="text-blue-400" />
              <h2 className="text-lg font-bold text-white">Preferences</h2>
            </div>

            {/* Language Selection */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={16} className="text-gray-400" />
                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Language
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLanguageChange("en")}
                  className={`px-4 py-3 rounded-lg font-medium transition-all border ${
                    lang === "en"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  English
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLanguageChange("ar")}
                  className={`px-4 py-3 rounded-lg font-medium transition-all border ${
                    lang === "ar"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  العربية
                </motion.button>
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                {isDark ? (
                  <Moon size={16} className="text-gray-400" />
                ) : (
                  <Sun size={16} className="text-gray-400" />
                )}
                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Appearance
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleThemeChange("dark")}
                  className={`px-4 py-3 rounded-lg font-medium transition-all border flex items-center justify-center gap-2 ${
                    isDark
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Moon size={16} />
                  Dark
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleThemeChange("light")}
                  className={`px-4 py-3 rounded-lg font-medium transition-all border flex items-center justify-center gap-2 ${
                    !isDark
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Sun size={16} />
                  Light
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#141825] rounded-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lock size={20} className="text-amber-400" />
              <h2 className="text-lg font-bold text-white">Security</h2>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                <div>
                  <p className="text-sm font-medium text-white">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Add an extra layer of security
                  </p>
                </div>
                <div className="w-12 h-6 bg-white/10 rounded-full border border-white/20 flex items-center px-1">
                  <div className="w-5 h-5 rounded-full bg-gray-600 ml-auto transition-all" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                <div>
                  <p className="text-sm font-medium text-white">
                    Login Notifications
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Get alerts for new logins
                  </p>
                </div>
                <div className="w-12 h-6 bg-emerald-500/20 rounded-full border border-emerald-500/30 flex items-center px-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 ml-auto transition-all" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Overlays */}
      <DemoScriptModal />
      <ToastStack />
    </div>
  );
}
