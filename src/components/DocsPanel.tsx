"use client";

import { DealDoc, DealStep, DocVerificationStatus } from "@/lib/types";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, Check, Clock, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { useState } from "react";

const verifyColors: Record<DocVerificationStatus, { color: string; icon: typeof Check }> = {
  verified: { color: "text-emerald-400 bg-emerald-500/10", icon: Check },
  pending: { color: "text-amber-400 bg-amber-500/10", icon: Clock },
  rejected: { color: "text-red-400 bg-red-500/10", icon: X },
  expired: { color: "text-gray-500 bg-white/[0.06]", icon: Clock },
};

interface Props {
  docs: DealDoc[];
  steps: DealStep[];
  dealId: string;
}

export default function DocsPanel({ docs, steps, dealId }: Props) {
  const { lang, updateDeal, addAuditEntry, addToast } = useStore();
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const requiredDocTypes = Array.from(new Set(steps.flatMap((s) => s.requiredDocs)));
  const uploadedDocTypes = docs.map((d) => d.type);
  const missingDocTypes = requiredDocTypes.filter((dt) => !uploadedDocTypes.includes(dt as typeof uploadedDocTypes[number]));

  const handleMockUpload = (docType: string) => {
    const newDoc: DealDoc = {
      id: `doc-${Date.now()}`,
      type: docType as DealDoc["type"],
      filename: `${docType}_${Date.now()}.pdf`,
      uploadedAt: new Date().toISOString(),
      extractedFields: {
        status: "Extracted",
        note: "Mock extraction complete",
      },
      verificationStatus: "pending",
      uploadedBy: "Demo User",
    };

    updateDeal(dealId, (d) => ({
      ...d,
      docs: [...d.docs, newDoc],
    }));

    addAuditEntry(dealId, {
      ts: new Date().toISOString(),
      actor: "Demo User",
      action: "Doc Uploaded",
      detail: `${docType} uploaded — AI extraction in progress...`,
      emoji: "📜",
    });

    addToast(`Document "${docType}" uploaded successfully!`, "success");
    setShowUpload(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">
          {t("deal.docs", lang)}
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/30 border border-emerald-500/20 transition-colors"
        >
          <Upload size={10} />
          {t("upload.doc", lang)}
        </motion.button>
      </div>

      {/* Upload Panel */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="p-2 bg-emerald-500/[0.08] rounded-lg border border-emerald-500/20">
              <p className="text-[10px] text-emerald-400 font-medium mb-2">Select document type to upload (mock):</p>
              <div className="flex flex-wrap gap-1">
                {missingDocTypes.length > 0 ? (
                  missingDocTypes.map((dt) => (
                    <button
                      key={dt}
                      onClick={() => handleMockUpload(dt)}
                      className="px-2 py-1 text-[10px] bg-white/[0.06] border border-white/[0.1] rounded-md hover:bg-white/[0.1] text-gray-300 transition-colors"
                    >
                      📄 {t(`doc.${dt}`, lang)}
                    </button>
                  ))
                ) : (
                  <span className="text-[10px] text-emerald-400">All required documents uploaded! ✅</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Missing docs indicator */}
      {missingDocTypes.length > 0 && (
        <div className="mb-2 p-2 bg-amber-500/[0.08] rounded-lg border border-amber-500/20">
          <p className="text-[10px] font-medium text-amber-400">
            ⚠️ {missingDocTypes.length} missing: {missingDocTypes.map((dt) => t(`doc.${dt}`, lang)).join(", ")}
          </p>
        </div>
      )}

      {/* Document list */}
      <div className="space-y-1.5">
        {docs.map((doc, i) => {
          const verifyConf = verifyColors[doc.verificationStatus];
          const VerifyIcon = verifyConf.icon;
          const isExpanded = expandedDoc === doc.id;

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/[0.03] rounded-lg border border-white/[0.06] overflow-hidden"
            >
              <button
                onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                className="w-full flex items-center gap-2 p-2 text-left hover:bg-white/[0.04] transition-colors"
              >
                <FileText size={14} className="text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-200 truncate">{doc.filename}</p>
                  <p className="text-[10px] text-gray-500">{t(`doc.${doc.type}`, lang)}</p>
                </div>
                <span className={cn("flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full", verifyConf.color)}>
                  <VerifyIcon size={10} />
                  {doc.verificationStatus}
                </span>
                <ChevronDown size={12} className={cn("text-gray-500 transition-transform", isExpanded && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-2 pb-2 pt-0">
                      <div className="p-2 bg-white/[0.03] rounded-md border border-white/[0.06]">
                        <p className="text-[10px] font-semibold text-gray-500 mb-1">Extracted Fields:</p>
                        {Object.entries(doc.extractedFields).map(([key, val]) => (
                          <div key={key} className="flex justify-between text-[10px] py-0.5">
                            <span className="text-gray-500">{key.replace(/_/g, " ")}:</span>
                            <span className="text-gray-200 font-medium">{val}</span>
                          </div>
                        ))}
                        <p className="text-[10px] text-gray-600 mt-1">
                          Uploaded by {doc.uploadedBy} • {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
