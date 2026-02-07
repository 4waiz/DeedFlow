"use client";

import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Clock, CheckCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const demoSteps = [
  {
    time: "0:00",
    title: "Welcome to DeedFlow",
    titleAr: "مرحباً في ديدفلو",
    description: "Show the dashboard — explain this is an AI agent that turns fractional property deals into a guided, compliant workflow for the UAE.",
    descriptionAr: "عرض لوحة التحكم — اشرح أن هذا وكيل ذكاء اصطناعي يحول صفقات العقارات المجزأة إلى سير عمل موجه ومتوافق للإمارات.",
    action: null,
  },
  {
    time: "0:15",
    title: "Deal Overview",
    titleAr: "نظرة عامة على الصفقة",
    description: "Click on 'Marina Heights Tower' deal. Show the 8-step workflow timeline, compliance score, and risk meter.",
    descriptionAr: "انقر على صفقة 'برج مارينا هايتس'. أظهر الجدول الزمني من 8 خطوات ونقاط الامتثال وعداد المخاطر.",
    action: null,
  },
  {
    time: "0:25",
    title: "Document Upload & Extraction",
    titleAr: "رفع واستخراج المستندات",
    description: "Upload a mock NOC document. Watch AI extract fields automatically. Show the extracted data in the document panel.",
    descriptionAr: "ارفع مستند شهادة عدم ممانعة. شاهد استخراج البيانات تلقائياً.",
    action: "upload_noc",
  },
  {
    time: "0:35",
    title: "Compliance Copilot",
    titleAr: "مساعد الامتثال",
    description: "Show the Agent Panel — it recommends HOLD because NOC is pending. Click 'Request NOC' to trigger an action.",
    descriptionAr: "أظهر لوحة المساعد — يوصي بالانتظار لأن شهادة عدم الممانعة معلقة.",
    action: null,
  },
  {
    time: "0:45",
    title: "Simulate Events",
    titleAr: "محاكاة الأحداث",
    description: "Use 'Simulate Event' → 'Complete Step'. Watch the timeline update, compliance score jump, and confetti! 🎉",
    descriptionAr: "استخدم 'محاكاة حدث' → 'إكمال خطوة'. شاهد تحديث الجدول الزمني وارتفاع نقاط الامتثال!",
    action: "step_completed",
  },
  {
    time: "0:55",
    title: "Language Switch",
    titleAr: "تبديل اللغة",
    description: "Toggle to Arabic — entire UI switches to RTL Arabic. Show the Compliance Copilot in Arabic too.",
    descriptionAr: "بدّل إلى العربية — الواجهة بالكامل تتحول إلى العربية.",
    action: "toggle_lang",
  },
  {
    time: "1:20",
    title: "Wrap Up",
    titleAr: "الختام",
    description: "Switch to Judge View to show metrics and value proposition. DeedFlow: making UAE property deals trustworthy, transparent, and fast.",
    descriptionAr: "انتقل إلى عرض الحكام لإظهار المقاييس. ديدفلو: صفقات عقارية موثوقة وشفافة وسريعة.",
    action: null,
  },
];

export default function DemoScriptModal() {
  const { demoScriptOpen, setDemoScriptOpen, lang, selectedDealId, simulateEvent, setLang } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const executeAction = useCallback((action: string | null) => {
    if (!action || !selectedDealId) return;
    if (action === "toggle_lang") {
      setLang(lang === "en" ? "ar" : "en");
    } else if (action === "step_completed") {
      simulateEvent({ type: "step_completed", dealId: selectedDealId });
    }
  }, [selectedDealId, simulateEvent, setLang, lang]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        const nextStep = prev + 1;
        executeAction(demoSteps[nextStep].action);
        return nextStep;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [isPlaying, executeAction]);

  return (
    <AnimatePresence>
      {demoScriptOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setDemoScriptOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-gold-50">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {t("demo.script", lang)}
                </h2>
                <p className="text-xs text-gray-500">90-second guided walkthrough</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    if (!isPlaying) setCurrentStep(0);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Play size={12} />
                  {isPlaying ? "Playing..." : "Auto-Play"}
                </motion.button>
                <button
                  onClick={() => setDemoScriptOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
              {demoSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    i === currentStep
                      ? "bg-emerald-50 border-emerald-300 shadow-sm"
                      : i < currentStep
                      ? "bg-gray-50 border-gray-200 opacity-60"
                      : "bg-white border-gray-100 hover:border-gray-200"
                  }`}
                  onClick={() => {
                    setCurrentStep(i);
                    executeAction(step.action);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock size={10} />
                      {step.time}
                    </span>
                    {i < currentStep && <CheckCircle size={12} className="text-emerald-500" />}
                    <span className="text-xs font-bold text-gray-900">
                      {lang === "ar" ? step.titleAr : step.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {lang === "ar" ? step.descriptionAr : step.description}
                  </p>
                  {step.action && (
                    <span className="inline-block mt-1.5 text-[9px] font-medium px-1.5 py-0.5 bg-gold-100 text-gold-700 rounded-full">
                      ⚡ Triggers action
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
