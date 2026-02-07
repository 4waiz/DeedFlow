"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DealDoc, DealStep, DocVerificationStatus } from "@/lib/types";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Check,
  Clock,
  X,
  ChevronDown,
  FilterX,
  ScanLine,
  Loader2,
  Eye,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

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

interface OcrResult {
  success: boolean;
  mode: string;
  docType: string;
  extractedFields: Record<string, string>;
  confidence?: number;
  message?: string;
  aiExtracted?: boolean;
  error?: string;
}

export default function DocsPanel({ docs, steps, dealId }: Props) {
  const {
    lang,
    updateDeal,
    addAuditEntry,
    addToast,
    docsFilterRequired,
    docsPanelOpen,
    preselectDocType,
    setDocsFilterRequired,
  } = useStore();

  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const requiredDocTypes = useMemo(
    () => Array.from(new Set(steps.flatMap((step) => step.requiredDocs))),
    [steps]
  );

  const visibleRequiredDocTypes = useMemo(
    () => docsFilterRequired ?? requiredDocTypes,
    [docsFilterRequired, requiredDocTypes]
  );

  const verifiedDocTypes = useMemo(
    () =>
      new Set(
        docs
          .filter((doc) => doc.verificationStatus === "verified")
          .map((doc) => doc.type as string)
      ),
    [docs]
  );

  const missingDocTypes = useMemo(
    () => visibleRequiredDocTypes.filter((docType) => !verifiedDocTypes.has(docType)),
    [visibleRequiredDocTypes, verifiedDocTypes]
  );

  const docsToShow = useMemo(
    () =>
      docsFilterRequired === null
        ? docs
        : docs.filter((doc) => docsFilterRequired.includes(doc.type)),
    [docs, docsFilterRequired]
  );

  const uploadOptions = missingDocTypes.length > 0 ? missingDocTypes : visibleRequiredDocTypes;

  useEffect(() => {
    if (!docsPanelOpen && !preselectDocType) {
      return;
    }

    setShowUpload(true);
    if (preselectDocType) {
      setUploadDocType(preselectDocType);
    }
    useStore.setState({ docsPanelOpen: false, preselectDocType: null });
  }, [docsPanelOpen, preselectDocType]);

  useEffect(() => {
    if (!showUpload) {
      return;
    }

    if (uploadOptions.length === 0) {
      setUploadDocType(null);
      return;
    }

    if (!uploadDocType || !uploadOptions.includes(uploadDocType)) {
      setUploadDocType(uploadOptions[0]);
    }
  }, [showUpload, uploadOptions, uploadDocType]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOcrResult(null);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setOcrResult(null);
      } else {
        addToast("Please drop an image (PNG, JPG) or PDF file", "warning");
      }
    }
  };

  const handleOcrScan = async () => {
    if (!uploadDocType) return;

    setIsScanning(true);
    setOcrResult(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append("docType", uploadDocType);

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const result: OcrResult = await response.json();
      setOcrResult(result);

      if (!result.success && result.error === "invalid_document") {
        addToast(
          result.message || "Invalid document — please upload the correct file type.",
          "warning"
        );
        return;
      }

      if (result.success) {
        const newDoc: DealDoc = {
          id: `doc-${Date.now()}`,
          type: uploadDocType as DealDoc["type"],
          filename: selectedFile
            ? selectedFile.name
            : `${uploadDocType}_${Date.now()}.pdf`,
          uploadedAt: new Date().toISOString(),
          extractedFields: {
            ...result.extractedFields,
            ...(result.aiExtracted ? { _ai_extracted: "true" } : {}),
          },
          verificationStatus: "pending",
          uploadedBy: "Demo User",
        };

        updateDeal(dealId, (deal) => ({
          ...deal,
          docs: [...deal.docs, newDoc],
        }));

        const modeLabel = result.aiExtracted
          ? "Trace OCR + Groq AI"
          : result.mode === "live"
            ? "Trace OCR (Live)"
            : "Trace OCR (Demo)";

        addAuditEntry(dealId, {
          ts: new Date().toISOString(),
          actor: result.aiExtracted ? "Groq AI" : "Trace OCR",
          action: "Doc Scanned",
          detail: `${t(`doc.${uploadDocType}`, "en")} scanned via ${modeLabel} — ${Object.keys(result.extractedFields).length} fields extracted`,
          emoji: "SCAN",
        });

        addToast(
          t("ocr.scan.success", lang),
          "success"
        );
      }
    } catch {
      addToast(t("ocr.scan.error", lang), "error");
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setOcrResult(null);
    setSelectedFile(null);
    setShowUpload(false);
    setUploadDocType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white">{t("deal.docs", lang)}</h3>
          <span className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-semibold rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
            <ScanLine size={9} />
            Trace OCR
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowUpload((current) => !current);
            setOcrResult(null);
            setSelectedFile(null);
            if (!showUpload && uploadOptions.length > 0 && !uploadDocType) {
              setUploadDocType(uploadOptions[0]);
            }
          }}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/30 border border-emerald-500/20 transition-colors"
        >
          <Upload size={10} />
          {t("upload.doc", lang)}
        </motion.button>
      </div>

      {docsFilterRequired !== null && (
        <div className="mb-2 p-2 bg-sky-500/[0.08] rounded-lg border border-sky-500/20 flex items-center justify-between gap-2">
          <p className="text-[10px] text-sky-300">
            {docsFilterRequired.length > 0
              ? `Filtered to ${docsFilterRequired.length} required doc type(s) for selected step`
              : "Selected step has no required documents"}
          </p>
          <button
            onClick={() => setDocsFilterRequired(null)}
            className="inline-flex items-center gap-1 text-[10px] text-sky-200 hover:text-white"
          >
            <FilterX size={10} />
            Show all
          </button>
        </div>
      )}

      {/* Upload + OCR Scan Panel */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <div
              className="p-3 rounded-xl border"
              style={{
                background: "rgba(20, 24, 37, 0.95)",
                borderColor: "rgba(6, 182, 212, 0.2)",
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.05), inset 0 0 20px rgba(6, 182, 212, 0.02)",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                  <ScanLine size={12} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">{t("ocr.title", lang)}</p>
                  <p className="text-[9px] text-gray-500">{t("ocr.subtitle", lang)}</p>
                </div>
              </div>

              {uploadOptions.length > 0 ? (
                <>
                  {/* Step 1: Select Doc Type */}
                  <p className="text-[10px] text-cyan-400/70 font-medium mb-1.5">
                    {t("ocr.step1", lang)}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {uploadOptions.map((docType) => (
                      <button
                        key={docType}
                        onClick={() => setUploadDocType(docType)}
                        className={cn(
                          "px-2 py-1 text-[10px] border rounded-md transition-all",
                          uploadDocType === docType
                            ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                            : "bg-white/[0.04] border-white/[0.1] hover:bg-white/[0.08] text-gray-400"
                        )}
                      >
                        {t(`doc.${docType}`, lang)}
                      </button>
                    ))}
                  </div>

                  {/* Step 2: File Upload */}
                  <p className="text-[10px] text-cyan-400/70 font-medium mb-1.5">
                    {t("ocr.step2", lang)}
                  </p>
                  <div
                    className={cn(
                      "relative mb-3 p-3 rounded-lg border border-dashed text-center cursor-pointer transition-all",
                      isDragging
                        ? "border-cyan-400/60 bg-cyan-500/[0.08] scale-[1.02]"
                        : "hover:border-cyan-400/40 hover:bg-cyan-500/[0.04]"
                    )}
                    style={{ borderColor: isDragging ? undefined : "rgba(6, 182, 212, 0.2)" }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText size={14} className="text-cyan-400" />
                        <span className="text-[11px] text-cyan-300 font-medium">
                          {selectedFile.name}
                        </span>
                        <span className="text-[9px] text-gray-500">
                          ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ) : isDragging ? (
                      <div>
                        <Upload size={22} className="mx-auto text-cyan-400 mb-1 animate-bounce" />
                        <p className="text-[11px] text-cyan-300 font-semibold">
                          Drop file here
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={18} className="mx-auto text-gray-600 mb-1" />
                        <p className="text-[10px] text-gray-500">
                          {t("ocr.drop", lang)}
                        </p>
                        <p className="text-[9px] text-gray-600 mt-0.5">
                          {t("ocr.formats", lang)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Scan Button */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleOcrScan}
                      disabled={!uploadDocType || isScanning}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-bold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: isScanning
                          ? "rgba(6, 182, 212, 0.15)"
                          : "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(16, 185, 129, 0.2))",
                        color: "#67e8f9",
                        border: "1px solid rgba(6, 182, 212, 0.3)",
                        boxShadow: isScanning
                          ? "0 0 20px rgba(6, 182, 212, 0.15)"
                          : "0 0 12px rgba(6, 182, 212, 0.1)",
                      }}
                    >
                      {isScanning ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          {t("ocr.scanning", lang)}
                        </>
                      ) : (
                        <>
                          <ScanLine size={14} />
                          {t("ocr.scan_btn", lang)}
                        </>
                      )}
                    </motion.button>

                    {!isScanning && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReset}
                        className="px-3 py-2 text-[11px] rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:bg-white/[0.08]"
                      >
                        {t("close", lang)}
                      </motion.button>
                    )}
                  </div>

                  {/* Invalid Document Error */}
                  <AnimatePresence>
                    {ocrResult && !ocrResult.success && ocrResult.error === "invalid_document" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 p-2.5 rounded-lg border border-red-500/20 bg-red-500/[0.05]">
                          <div className="flex items-center gap-2 mb-1.5">
                            <X size={12} className="text-red-400" />
                            <p className="text-[10px] font-bold text-red-400">
                              Invalid Document
                            </p>
                          </div>
                          <p className="text-[10px] text-red-300/80 mb-2">
                            {ocrResult.message}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setOcrResult(null);
                              setSelectedFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="w-full px-3 py-1.5 text-[10px] font-semibold rounded-md bg-red-500/15 border border-red-500/25 text-red-300 hover:bg-red-500/25 transition-all"
                          >
                            Try another file
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* OCR Results */}
                  <AnimatePresence>
                    {ocrResult && ocrResult.success && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05]">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={12} className="text-emerald-400" />
                            <p className="text-[10px] font-bold text-emerald-400">
                              {t("ocr.results", lang)}
                            </p>
                            {ocrResult.aiExtracted && (
                              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
                                AI
                              </span>
                            )}
                            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                              {ocrResult.mode === "live" ? "LIVE" : "DEMO"}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {Object.entries(ocrResult.extractedFields)
                              .filter(([key]) => !key.startsWith("_"))
                              .map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center gap-2 text-[10px] py-1 px-1.5 rounded bg-white/[0.02]"
                                >
                                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                    <Check size={8} className="text-emerald-400" />
                                  </div>
                                  <span className="text-gray-400 capitalize">
                                    {key.replace(/_/g, " ")}
                                  </span>
                                  <span className="text-gray-100 font-medium text-right ml-auto max-w-[50%] truncate">
                                    {value}
                                  </span>
                                </div>
                              ))}
                          </div>
                          {ocrResult.confidence && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${ocrResult.confidence * 100}%`,
                                  }}
                                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                                />
                              </div>
                              <span className="text-[9px] text-emerald-400 font-medium">
                                {(ocrResult.confidence * 100).toFixed(1)}%{" "}
                                {t("ocr.confidence", lang)}
                              </span>
                            </div>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleReset}
                            className="mt-2 w-full px-3 py-1.5 text-[10px] font-semibold rounded-md bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/25 transition-all"
                          >
                            {t("ocr.done", lang)}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <span className="text-[10px] text-gray-500">
                  No available document types for upload.
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {missingDocTypes.length > 0 && (
        <div className="mb-2 p-2 bg-amber-500/[0.08] rounded-lg border border-amber-500/20">
          <p className="text-[10px] font-medium text-amber-400">
            {missingDocTypes.length} missing:{" "}
            {missingDocTypes
              .map((docType) => t(`doc.${docType}`, lang))
              .join(", ")}
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        {docsToShow.map((doc, i) => {
          const verifyConf = verifyColors[doc.verificationStatus];
          const VerifyIcon = verifyConf.icon;
          const isExpanded = expandedDoc === doc.id;
          const isAiExtracted = doc.extractedFields._ai_extracted === "true";
          const hasOcrFields =
            isAiExtracted ||
            doc.extractedFields.ocr_engine ||
            doc.extractedFields.scan_confidence;

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
                <FileText
                  size={14}
                  className="text-gray-500 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-200 truncate">
                    {doc.filename}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[10px] text-gray-500">
                      {t(`doc.${doc.type}`, lang)}
                    </p>
                    {hasOcrFields && (
                      <span className={cn(
                        "flex items-center gap-0.5 text-[8px]",
                        isAiExtracted ? "text-violet-400/70" : "text-cyan-400/70"
                      )}>
                        {isAiExtracted ? <Sparkles size={8} /> : <Eye size={8} />}
                        {isAiExtracted ? "AI" : "OCR"}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                    verifyConf.color
                  )}
                >
                  <VerifyIcon size={10} />
                  {doc.verificationStatus}
                </span>
                <ChevronDown
                  size={12}
                  className={cn(
                    "text-gray-500 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
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
                        <div className="flex items-center gap-1.5 mb-1">
                          <p className="text-[10px] font-semibold text-gray-500">
                            {t("ocr.extracted_fields", lang)}
                          </p>
                          {hasOcrFields && (
                            <span className={cn(
                              "text-[8px] px-1 py-0.5 rounded border",
                              isAiExtracted
                                ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                            )}>
                              {isAiExtracted ? "AI Extracted" : "Trace OCR"}
                            </span>
                          )}
                        </div>
                        {Object.entries(doc.extractedFields)
                          .filter(([key]) => !key.startsWith("_"))
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center gap-1.5 text-[10px] py-0.5"
                            >
                              {isAiExtracted && (
                                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                  <Check size={7} className="text-emerald-400" />
                                </div>
                              )}
                              <span className="text-gray-500 capitalize">
                                {key.replace(/_/g, " ")}:
                              </span>
                              <span className="text-gray-200 font-medium text-right ml-auto max-w-[55%] truncate">
                                {value}
                              </span>
                            </div>
                          ))}
                        <p className="text-[10px] text-gray-600 mt-1">
                          Uploaded by {doc.uploadedBy} -{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {docsToShow.length === 0 && (
          <div className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.03]">
            <p className="text-[10px] text-gray-500">
              No documents match the current filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
