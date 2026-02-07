"use client";

import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

const toastConfig = {
  success: { icon: CheckCircle, bg: "bg-emerald-50 border-emerald-300", text: "text-emerald-800", iconColor: "text-emerald-600" },
  warning: { icon: AlertTriangle, bg: "bg-gold-50 border-gold-300", text: "text-gold-800", iconColor: "text-gold-600" },
  info: { icon: Info, bg: "bg-blue-50 border-blue-300", text: "text-blue-800", iconColor: "text-blue-600" },
  error: { icon: AlertCircle, bg: "bg-red-50 border-red-300", text: "text-red-800", iconColor: "text-red-600" },
};

export default function ToastStack() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-4 right-4 z-[200] space-y-2 max-w-sm">
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
            >
              <Icon size={16} className={cn("flex-shrink-0 mt-0.5", config.iconColor)} />
              <p className={cn("text-xs font-medium flex-1", config.text)}>
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-0.5 hover:bg-black/5 rounded transition-colors flex-shrink-0"
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
