"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { Deal, DealStep, StepStatus } from "@/lib/types";
import { AlertCircle, CheckCircle2, ChevronDown, Circle, Clock3, Upload } from "lucide-react";

interface Props {
  deal: Deal;
}

const statusUi: Record<StepStatus, { icon: typeof Circle; style: string }> = {
  done: {
    icon: CheckCircle2,
    style: "text-emerald-300",
  },
  in_progress: {
    icon: Clock3,
    style: "text-amber-300",
  },
  blocked: {
    icon: AlertCircle,
    style: "text-red-300",
  },
  todo: {
    icon: Circle,
    style: "text-slate-500",
  },
};

export default function DealFlowHeader({ deal }: Props) {
  const {
    lang,
    selectedStepId,
    setSelectedStepId,
    setDocsFilterRequired,
    openDocsPanel,
  } = useStore();

  const orderedSteps = useMemo(
    () => [...deal.steps].sort((a, b) => a.order - b.order),
    [deal.steps]
  );

  const verifiedDocTypes = useMemo(() => {
    return new Set(
      deal.docs
        .filter((doc) => doc.verificationStatus === "verified")
        .map((doc) => doc.type as string)
    );
  }, [deal.docs]);

  const missingByStep = useMemo(() => {
    return new Map(
      orderedSteps.map((step) => {
        const missingDocs = step.requiredDocs.filter((docType) => !verifiedDocTypes.has(docType));
        return [step.id, missingDocs];
      })
    );
  }, [orderedSteps, verifiedDocTypes]);

  const missingRequiredDocs = useMemo(() => {
    const seen = new Set<string>();
    const missing: string[] = [];

    for (const step of orderedSteps) {
      for (const docType of step.requiredDocs) {
        if (verifiedDocTypes.has(docType) || seen.has(docType)) {
          continue;
        }
        seen.add(docType);
        missing.push(docType);
      }
    }

    return missing;
  }, [orderedSteps, verifiedDocTypes]);

  const blockedSteps = orderedSteps.filter((step) => step.status === "blocked");
  const blockersCount = blockedSteps.length + missingRequiredDocs.length;
  const nextUploads = missingRequiredDocs.slice(0, 4);
  const firstMissingDocType = nextUploads[0] ?? null;

  const handleStepClick = (step: DealStep) => {
    setSelectedStepId(step.id);
    setDocsFilterRequired(step.requiredDocs.length > 0 ? [...step.requiredDocs] : []);

    const row = document.getElementById(`step-${step.id}`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleUploadNow = () => {
    if (!firstMissingDocType) {
      return;
    }

    setDocsFilterRequired([firstMissingDocType]);
    openDocsPanel(firstMissingDocType);

    const docsPanel = document.getElementById("docs-panel");
    if (docsPanel) {
      docsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sticky top-0 z-30">
      <div className="rounded-xl border border-white/[0.08] bg-[#121826]/95 backdrop-blur-md px-3 py-3 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 overflow-x-auto">
            <div className="flex gap-2 w-max pr-2">
              {orderedSteps.map((step) => {
                const ui = statusUi[step.status];
                const Icon = ui.icon;
                const missingCount = missingByStep.get(step.id)?.length ?? 0;
                const isSelected = selectedStepId === step.id;

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                      isSelected
                        ? "border-emerald-400/40 bg-emerald-500/12 text-white"
                        : "border-white/[0.12] bg-white/[0.03] text-gray-300 hover:border-white/[0.22]"
                    )}
                  >
                    <Icon size={13} className={ui.style} />
                    <span className="whitespace-nowrap">
                      {lang === "ar" ? step.titleAr : step.title}
                    </span>
                    {missingCount > 0 && (
                      <span className="rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 px-1.5 py-0.5 text-[10px] font-semibold">
                        {missingCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <details className="relative">
            <summary className="list-none cursor-pointer inline-flex items-center gap-1 rounded-lg border border-white/[0.12] bg-white/[0.03] px-2.5 py-1.5 text-xs text-gray-300 hover:border-white/[0.2]">
              <span>{blockersCount} blockers</span>
              <ChevronDown size={12} />
            </summary>
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-white/[0.12] bg-[#101726] p-3 shadow-xl z-40">
              <p className="text-[11px] font-semibold text-gray-100 mb-2">Blocked Steps</p>
              {blockedSteps.length > 0 ? (
                <ul className="space-y-1 mb-3 text-[11px] text-red-300">
                  {blockedSteps.map((step) => (
                    <li key={step.id}>
                      {lang === "ar" ? step.titleAr : step.title}
                      {step.blockedReason ? ` - ${step.blockedReason}` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-gray-500 mb-3">No blocked steps.</p>
              )}

              <p className="text-[11px] font-semibold text-gray-100 mb-2">Missing Required Docs</p>
              {missingRequiredDocs.length > 0 ? (
                <ul className="space-y-1 text-[11px] text-amber-300">
                  {missingRequiredDocs.map((docType) => (
                    <li key={docType}>{t(`doc.${docType}`, lang)}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-gray-500">All required docs verified.</p>
              )}
            </div>
          </details>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase tracking-wide text-gray-500">Next Uploads</span>
          {nextUploads.length > 0 ? (
            nextUploads.map((docType) => (
              <span
                key={docType}
                className="rounded-md border border-white/[0.12] bg-white/[0.04] px-2 py-1 text-[11px] text-gray-200"
              >
                {t(`doc.${docType}`, lang)}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-gray-500">No pending uploads.</span>
          )}

          <button
            onClick={handleUploadNow}
            disabled={!firstMissingDocType}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300 disabled:opacity-45 disabled:cursor-not-allowed"
          >
            <Upload size={12} />
            Upload Now
          </button>
        </div>
      </div>
    </div>
  );
}
