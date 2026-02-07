"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/cn";

// Web Speech API type declarations
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onstart: ((ev: Event) => void) | null;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

// Navigation command map — maps AI tags to scroll targets or router actions
const NAV_ACTIONS: Record<string, { type: "scroll" | "route" | "action"; target: string; docType?: string }> = {
  upload_doc: { type: "action", target: "docs-panel", docType: undefined },
  upload_title_deed: { type: "action", target: "docs-panel", docType: "title_deed" },
  upload_noc: { type: "action", target: "docs-panel", docType: "noc" },
  upload_kyc: { type: "action", target: "docs-panel", docType: "kyc_doc" },
  upload_valuation: { type: "action", target: "docs-panel", docType: "valuation_report" },
  upload_passport: { type: "action", target: "docs-panel", docType: "passport" },
  upload_emirates_id: { type: "action", target: "docs-panel", docType: "emirates_id" },
  upload_escrow: { type: "action", target: "docs-panel", docType: "escrow_agreement" },
  upload_spa: { type: "action", target: "docs-panel", docType: "spa" },
  timeline: { type: "scroll", target: "deal-timeline" },
  compliance: { type: "scroll", target: "compliance-panel" },
  governance: { type: "scroll", target: "governance-panel" },
  documents: { type: "scroll", target: "docs-panel" },
  activity: { type: "scroll", target: "activity-feed" },
  property: { type: "route", target: "/app/property" },
  settings: { type: "route", target: "/app/settings" },
};

export default function ChatBot() {
  const { lang, getSelectedDeal, openDocsPanel, addToast } = useStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech APIs
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Stop speech when chat closes
  useEffect(() => {
    if (!isOpen && synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speakText = useCallback((text: string) => {
    if (!synthRef.current || !voiceEnabled) return;

    // Cancel any current speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "ar" ? "ar-AE" : "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, [lang, voiceEnabled]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Parse navigation tags from AI response
  const parseNavigation = useCallback((text: string): { cleanText: string; navAction: string | null } => {
    const navMatch = text.match(/\[NAV:(\w+)\]/);
    if (navMatch) {
      const cleanText = text.replace(/\[NAV:\w+\]/, "").trim();
      return { cleanText, navAction: navMatch[1] };
    }
    return { cleanText: text, navAction: null };
  }, []);

  // Execute navigation
  const executeNavigation = useCallback((navAction: string) => {
    const action = NAV_ACTIONS[navAction];
    if (!action) return;

    // Small delay so user sees the message first
    setTimeout(() => {
      if (action.type === "route") {
        router.push(action.target);
        setIsOpen(false);
      } else if (action.type === "scroll") {
        const el = document.getElementById(action.target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          // Flash highlight effect
          el.classList.add("ring-2", "ring-violet-500/50", "transition-all");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-violet-500/50", "transition-all");
          }, 2000);
        }
      } else if (action.type === "action") {
        // Open docs panel with optional doc type preselection
        if (action.docType) {
          openDocsPanel(action.docType);
        }
        const el = document.getElementById(action.target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-violet-500/50", "transition-all");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-violet-500/50", "transition-all");
          }, 2000);
        }
      }

      addToast(t("voice.navigating", lang), "info");
    }, 600);
  }, [router, openDocsPanel, addToast, lang]);

  const getDealContext = () => {
    const deal = getSelectedDeal();
    if (!deal) return undefined;
    return `Deal: ${deal.name}
City: ${deal.city}
Type: ${deal.tokenizationMode} ${deal.propertyType}
Value: AED ${deal.totalValue.toLocaleString()}
Status: ${deal.status}
Compliance Score: ${deal.metrics.complianceScore}/100
Risk Score: ${deal.metrics.riskScore}/100
Steps completed: ${deal.steps.filter((s) => s.status === "done").length}/${deal.steps.length}
Documents uploaded: ${deal.docs.length}
Missing docs: ${deal.steps.filter((s) => s.status !== "done").flatMap((s) => s.requiredDocs).filter((d) => !deal.docs.some((doc) => doc.type === d && doc.verificationStatus === "verified")).join(", ") || "None"}`;
  };

  const handleSendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: trimmed,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          dealContext: getDealContext(),
        }),
      });

      const data = await response.json();

      if (data.reply) {
        const { cleanText, navAction } = parseNavigation(data.reply);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: cleanText, ts: Date.now() },
        ]);

        // Speak the response
        if (voiceEnabled) {
          speakText(cleanText);
        }

        // Execute navigation if present
        if (navAction) {
          executeNavigation(navAction);
        }
      } else {
        const errMsg = "Sorry, something went wrong. Please try again.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errMsg, ts: Date.now() },
        ]);
      }
    } catch {
      const errMsg = "Connection error. Please check your internet and try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errMsg, ts: Date.now() },
      ]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading, voiceEnabled, speakText, parseNavigation, executeNavigation]);

  const handleSend = () => {
    handleSendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice input — start listening
  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      addToast(t("voice.unsupported", lang), "warning");
      return;
    }

    // Stop any current speech so it doesn't interfere
    stopSpeaking();

    const recognition = new (SpeechRecognitionAPI as new () => SpeechRecognitionInstance)();
    recognition.lang = lang === "ar" ? "ar-AE" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        handleSendMessage(transcript.trim());
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang, addToast, stopSpeaking, handleSendMessage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)",
            }}
          >
            <MessageCircle size={24} className="text-white" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-violet-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "rgba(20, 24, 37, 0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.1)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(109, 40, 217, 0.1))",
                borderBottom: "1px solid rgba(139, 92, 246, 0.15)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                  <Bot size={16} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {t("chat.title", lang)}
                  </p>
                  <p className="text-[10px] text-violet-400/70">
                    {t("chat.subtitle", lang)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Voice toggle */}
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    setVoiceEnabled((v) => !v);
                  }}
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                    voiceEnabled
                      ? "bg-violet-500/20 text-violet-300 hover:bg-violet-500/30"
                      : "bg-white/[0.06] text-gray-500 hover:bg-white/[0.12]"
                  )}
                  title={voiceEnabled ? t("voice.stop", lang) : t("voice.speak", lang)}
                >
                  {voiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                </button>
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-3">
                    <Sparkles size={20} className="text-violet-400" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">
                    {t("chat.welcome", lang)}
                  </p>
                  <p className="text-[11px] text-gray-500 max-w-[240px]">
                    {t("chat.welcome_sub", lang)}
                  </p>
                  {/* Quick actions */}
                  <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                    {[
                      { en: "What docs do I need?", ar: "ما المستندات المطلوبة؟" },
                      { en: "Check compliance status", ar: "حالة الامتثال" },
                      { en: "Next steps?", ar: "الخطوات التالية؟" },
                      { en: "Upload a document", ar: "رفع مستند" },
                    ].map((q) => (
                      <button
                        key={q.en}
                        onClick={() => {
                          const text = lang === "ar" ? q.ar : q.en;
                          handleSendMessage(text);
                        }}
                        className="px-2.5 py-1.5 text-[10px] rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
                      >
                        {lang === "ar" ? q.ar : q.en}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      msg.role === "user"
                        ? "bg-emerald-500/20 border border-emerald-500/30"
                        : "bg-violet-500/20 border border-violet-500/30"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User size={11} className="text-emerald-400" />
                    ) : (
                      <Bot size={11} className="text-violet-400" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[75%] px-3 py-2 rounded-xl text-[12px] leading-relaxed",
                      msg.role === "user"
                        ? "bg-emerald-500/15 text-emerald-100 border border-emerald-500/20"
                        : "bg-white/[0.04] text-gray-200 border border-white/[0.06]"
                    )}
                  >
                    {msg.content}
                    {/* Speak button for assistant messages */}
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => {
                          if (isSpeaking) {
                            stopSpeaking();
                          } else {
                            speakText(msg.content);
                          }
                        }}
                        className="inline-flex items-center gap-1 ml-2 text-[10px] text-violet-400/60 hover:text-violet-400 transition-colors"
                        title={t("voice.speak", lang)}
                      >
                        {isSpeaking ? <VolumeX size={10} /> : <Volume2 size={10} />}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot size={11} className="text-violet-400" />
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400/40 animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400/20 animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Listening indicator */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 py-2"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[11px] text-red-400 font-medium">
                      {t("voice.listening", lang)}
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="px-3 py-3 flex-shrink-0"
              style={{
                borderTop: "1px solid rgba(139, 92, 246, 0.1)",
                background: "rgba(20, 24, 37, 0.6)",
              }}
            >
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(139, 92, 246, 0.15)",
                }}
              >
                {/* Mic button */}
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0",
                    isListening
                      ? "bg-red-500/30 text-red-300 animate-pulse"
                      : "bg-white/[0.04] text-gray-400 hover:bg-violet-500/20 hover:text-violet-300"
                  )}
                  title={t("voice.mic", lang)}
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? t("voice.listening", lang) : t("chat.placeholder", lang)}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                  disabled={isLoading || isListening}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    input.trim() && !isLoading
                      ? "bg-violet-500/30 text-violet-300 hover:bg-violet-500/40"
                      : "bg-white/[0.04] text-gray-600 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </div>
              <p className="text-[9px] text-gray-600 text-center mt-1.5">
                {t("chat.powered_by", lang)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
