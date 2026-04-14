"use client";

import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";

const toastConfig = {
  success: { icon: CheckCircle, bg: "bg-emerald-500/15 border-emerald-500/30", text: "text-emerald-300", iconColor: "text-emerald-400" },
  warning: { icon: AlertTriangle, bg: "bg-amber-500/15 border-amber-500/30", text: "text-amber-300", iconColor: "text-amber-400" },
  info: { icon: Info, bg: "bg-blue-500/15 border-blue-500/30", text: "text-blue-300", iconColor: "text-blue-400" },
  error: { icon: AlertCircle, bg: "bg-red-500/15 border-red-500/30", text: "text-red-300", iconColor: "text-red-400" },
};

export default function ToastStack() {
  const { toasts, removeToast } = useStore();
  const pathname = usePathname();

  if (pathname !== "/app") {
    return null;
  }

  return (
    <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-4 z-[200] space-y-2 max-w-[calc(100vw-2rem)] sm:max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              className={cn("flex items-start gap-2 p-3 rounded-xl border shadow-lg", config.bg)}
              style={{
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              <Icon size={16} className={cn("flex-shrink-0 mt-0.5", config.iconColor)} />
              <p className={cn("text-xs font-medium flex-1", config.text)}>
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-0.5 hover:bg-white/[0.08] rounded transition-colors flex-shrink-0"
              >
                <X size={12} className="text-gray-500" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
