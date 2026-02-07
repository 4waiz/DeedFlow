import { create } from "zustand";
import { Deal, AuditEntry, CopilotInsight, SimulateEvent } from "./types";
import { createMockDeals } from "./mock-data";
import { Lang } from "./i18n";

interface AppState {
  deals: Deal[];
  selectedDealId: string | null;
  lang: Lang;
  toasts: { id: string; message: string; type: "success" | "warning" | "info" | "error"; ts: number }[];
  showConfetti: boolean;
  demoScriptOpen: boolean;

  // Actions
  setDeals: (deals: Deal[]) => void;
  selectDeal: (id: string) => void;
  setLang: (lang: Lang) => void;
  addToast: (message: string, type: "success" | "warning" | "info" | "error") => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  setDemoScriptOpen: (open: boolean) => void;
  updateDeal: (id: string, updater: (deal: Deal) => Deal) => void;
  addAuditEntry: (dealId: string, entry: AuditEntry) => void;
  getSelectedDeal: () => Deal | undefined;
  getCopilotInsight: (deal: Deal) => CopilotInsight;
  simulateEvent: (event: SimulateEvent) => void;
  initializeDeals: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  deals: [],
  selectedDealId: null,
  lang: "en",
  toasts: [],
  showConfetti: false,
  demoScriptOpen: false,

  initializeDeals: () => {
    const deals = createMockDeals();
    set({ deals, selectedDealId: deals[0]?.id || null });
  },

  setDeals: (deals) => set({ deals }),
  selectDeal: (id) => set({ selectedDealId: id }),
  setLang: (lang) => set({ lang }),

  addToast: (message, type) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type, ts: Date.now() }] }));
    setTimeout(() => get().removeToast(id), 5000);
  },

  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  triggerConfetti: () => {
    set({ showConfetti: true });
    setTimeout(() => set({ showConfetti: false }), 3000);
  },

  setDemoScriptOpen: (open) => set({ demoScriptOpen: open }),

  updateDeal: (id, updater) =>
    set((s) => ({
      deals: s.deals.map((d) => (d.id === id ? updater(d) : d)),
    })),

  addAuditEntry: (dealId, entry) =>
    set((s) => ({
      deals: s.deals.map((d) =>
        d.id === dealId ? { ...d, audit: [entry, ...d.audit] } : d
      ),
    })),

  getSelectedDeal: () => {
    const { deals, selectedDealId } = get();
    return deals.find((d) => d.id === selectedDealId);
  },

  getCopilotInsight: (deal) => {
    const blockedSteps = deal.steps.filter((s) => s.status === "blocked");
    const pendingDocs = deal.steps
      .filter((s) => s.status !== "done")
      .flatMap((s) => s.requiredDocs);
    const uploadedDocTypes = deal.docs
      .filter((d) => d.verificationStatus === "verified")
      .map((d) => d.type);
    const missingDocs = pendingDocs.filter((d) => !uploadedDocTypes.includes(d as typeof uploadedDocTypes[number]));

    if (blockedSteps.length > 0) {
      return {
        recommendation: "HOLD",
        rationale: [
          `${blockedSteps.length} step(s) are blocked and require attention`,
          blockedSteps[0].blockedReason || "External dependency pending",
          "Cannot proceed to settlement until blockers are resolved",
        ],
        rationaleAr: [
          `${blockedSteps.length} خطوة/خطوات محظورة وتحتاج اهتمام`,
          blockedSteps[0].blockedReason || "في انتظار جهة خارجية",
          "لا يمكن المتابعة حتى حل المشاكل",
        ],
        actions: [
          { label: "Request NOC", labelAr: "طلب شهادة عدم ممانعة", action: "request_noc" },
          { label: "Send Reminder", labelAr: "إرسال تذكير", action: "send_reminder" },
        ],
      };
    }

    if (missingDocs.length > 0) {
      return {
        recommendation: "HOLD",
        rationale: [
          `${missingDocs.length} required document(s) still missing`,
          `Missing: ${missingDocs.join(", ")}`,
          "Upload and verify all documents before proceeding",
        ],
        rationaleAr: [
          `${missingDocs.length} مستند/مستندات مطلوبة لا تزال مفقودة`,
          `مفقود: ${missingDocs.join("، ")}`,
          "قم بتحميل والتحقق من جميع المستندات قبل المتابعة",
        ],
        actions: [
          { label: "Send Doc Request", labelAr: "إرسال طلب مستند", action: "send_doc_request" },
          { label: "Upload Document", labelAr: "رفع مستند", action: "upload_doc" },
        ],
      };
    }

    if (deal.metrics.riskScore > 50) {
      return {
        recommendation: "ESCALATE",
        rationale: [
          `Risk score elevated at ${deal.metrics.riskScore}/100`,
          "Additional due diligence recommended",
          "Review all party compliance status",
        ],
        rationaleAr: [
          `مستوى المخاطر مرتفع عند ${deal.metrics.riskScore}/100`,
          "يُوصى بمزيد من العناية الواجبة",
          "مراجعة حالة الامتثال لجميع الأطراف",
        ],
        actions: [
          { label: "Request Review", labelAr: "طلب مراجعة", action: "request_review" },
          { label: "Generate Settlement Pack", labelAr: "إنشاء حزمة التسوية", action: "generate_pack" },
        ],
      };
    }

    return {
      recommendation: "PROCEED",
      rationale: [
        `Compliance score: ${deal.metrics.complianceScore}/100 — looking good!`,
        `Estimated ${deal.metrics.estTimeToCloseDays} days to close`,
        "All compliance rules satisfied",
      ],
      rationaleAr: [
        `نقاط الامتثال: ${deal.metrics.complianceScore}/100 — ممتاز!`,
        `${deal.metrics.estTimeToCloseDays} أيام متبقية حتى الإغلاق`,
        "جميع قواعد الامتثال مستوفاة",
      ],
      actions: [
        { label: "Generate Settlement Pack", labelAr: "إنشاء حزمة التسوية", action: "generate_pack" },
        { label: "Send Doc Request", labelAr: "إرسال طلب مستند", action: "send_doc_request" },
      ],
    };
  },

  simulateEvent: (event) => {
    const { updateDeal, addAuditEntry, addToast, triggerConfetti } = get();
    const now = new Date().toISOString();

    switch (event.type) {
      case "missing_doc": {
        updateDeal(event.dealId, (d) => {
          const step = d.steps.find((s) => s.status === "in_progress");
          if (step) {
            step.status = "blocked";
            step.blockedReason = "Required document missing — regulator flagged issue";
          }
          return { ...d, metrics: { ...d.metrics, complianceScore: Math.max(0, d.metrics.complianceScore - 15), riskScore: Math.min(100, d.metrics.riskScore + 20) } };
        });
        addAuditEntry(event.dealId, { ts: now, actor: "DeedFlow AI", action: "Doc Missing", detail: "Critical document flagged as missing — khalas, we need this!", emoji: "⚠️" });
        addToast("Missing document detected! Step blocked.", "warning");
        break;
      }
      case "noc_delay": {
        updateDeal(event.dealId, (d) => {
          const nocStep = d.steps.find((s) => s.title.includes("NOC"));
          if (nocStep && nocStep.status !== "done") {
            nocStep.status = "blocked";
            nocStep.blockedReason = "Developer NOC delayed — processing backlog";
          }
          return { ...d, metrics: { ...d.metrics, estTimeToCloseDays: d.metrics.estTimeToCloseDays + 7 } };
        });
        addAuditEntry(event.dealId, { ts: now, actor: "Developer", action: "NOC Delayed", detail: "NOC processing delayed — someone's stuck in traffic on SZR 🚗", emoji: "⏳" });
        addToast("NOC has been delayed by the developer.", "warning");
        break;
      }
      case "risk_surge": {
        updateDeal(event.dealId, (d) => ({
          ...d,
          metrics: { ...d.metrics, riskScore: Math.min(100, d.metrics.riskScore + 30) },
        }));
        addAuditEntry(event.dealId, { ts: now, actor: "DeedFlow AI", action: "Risk Alert", detail: "Market volatility detected — risk score surging 📈", emoji: "⚠️" });
        addToast("Risk score surged! Review recommended.", "error");
        break;
      }
      case "doc_verified": {
        updateDeal(event.dealId, (d) => {
          const pendingDoc = d.docs.find((doc) => doc.verificationStatus === "pending");
          if (pendingDoc) {
            pendingDoc.verificationStatus = "verified";
          }
          return { ...d, metrics: { ...d.metrics, complianceScore: Math.min(100, d.metrics.complianceScore + 10) } };
        });
        addAuditEntry(event.dealId, { ts: now, actor: "DeedFlow AI", action: "Doc Verified", detail: "Document verified successfully — one step closer, habibi!", emoji: "✅" });
        addToast("Document verified successfully!", "success");
        break;
      }
      case "step_completed": {
        updateDeal(event.dealId, (d) => {
          const currentStep = d.steps.find((s) => s.status === "in_progress");
          if (currentStep) {
            currentStep.status = "done";
            currentStep.completedAt = now;
            const nextStep = d.steps.find((s) => s.status === "todo");
            if (nextStep) {
              nextStep.status = "in_progress";
            }
          }
          const doneCount = d.steps.filter((s) => s.status === "done").length;
          const totalSteps = d.steps.length;
          const newCompliance = Math.round((doneCount / totalSteps) * 100);
          return { ...d, metrics: { ...d.metrics, complianceScore: newCompliance, estTimeToCloseDays: Math.max(0, d.metrics.estTimeToCloseDays - 2) } };
        });
        addAuditEntry(event.dealId, { ts: now, actor: "DeedFlow AI", action: "Step Completed", detail: "Workflow step completed — yalla, next! 🎯", emoji: "✅" });
        addToast("Step completed! Moving forward.", "success");
        triggerConfetti();
        break;
      }
      case "approval_delay": {
        updateDeal(event.dealId, (d) => ({
          ...d,
          metrics: { ...d.metrics, estTimeToCloseDays: d.metrics.estTimeToCloseDays + 3, riskScore: Math.min(100, d.metrics.riskScore + 5) },
        }));
        addAuditEntry(event.dealId, { ts: now, actor: "Regulator", action: "Approval Delayed", detail: "Regulatory approval taking longer than usual — patience is a virtue, habibi", emoji: "⏳" });
        addToast("Approval delay detected. Timeline extended.", "warning");
        break;
      }
    }
  },
}));
