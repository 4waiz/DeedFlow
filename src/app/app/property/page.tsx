"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import MyProperty from "@/components/MyProperty";
import ToastStack from "@/components/ToastStack";
import DemoScriptModal from "@/components/DemoScriptModal";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PropertyPage() {
  const router = useRouter();
  const { user, deals, selectedDealId, initializeDeals, lang } = useStore();
  const [initialized, setInitialized] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Route guard: redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Initialize deals on mount
  useEffect(() => {
    if (!initialized && user) {
      initializeDeals();
      setInitialized(true);
    }
  }, [initialized, initializeDeals, user]);

  const deal = deals.find((d) => d.id === selectedDealId);

  if (!user) {
    return null;
  }

  if (!initialized || deals.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--background)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-[0_8px_32px_rgba(16,185,129,0.25)]">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">DeedFlow</h1>
          <p className="text-sm text-gray-500">Loading property data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-[100dvh] flex flex-col bg-[var(--background)]">
      <div className="bg-particles" />
      <TopBar />

      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
          >
            <Link
              href="/app"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-foreground hover:bg-white/5 rounded-lg transition-all"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">My Property</h1>
          </motion.div>

          {deal ? (
            <>
              {/* Property Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {lang === "ar" ? deal.nameAr : deal.name}
                </h2>
                <p className="text-sm text-muted">{deal.city} • {deal.propertyType}</p>
              </motion.div>

              {/* My Property Component */}
              <MyProperty deal={deal} />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-[240px] sm:min-h-[320px] lg:min-h-[400px] text-muted"
            >
              <p className="text-sm">No property selected. Please select a property from the dashboard.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Overlays */}
      <DemoScriptModal />
      <ToastStack />
    </div>
  );
}
