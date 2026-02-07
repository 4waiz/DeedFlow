"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/cn";

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

export default function ChatBot() {
  const { lang, getSelectedDeal } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSend = async () => {
    const trimmed = input.trim();
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
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply, ts: Date.now() },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
            ts: Date.now(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Please check your internet and try again.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
              >
                <X size={14} className="text-gray-400" />
              </button>
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
                    ].map((q) => (
                      <button
                        key={q.en}
                        onClick={() => {
                          setInput(lang === "ar" ? q.ar : q.en);
                          setTimeout(() => {
                            setInput(lang === "ar" ? q.ar : q.en);
                            handleSend();
                          }, 50);
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
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("chat.placeholder", lang)}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                  disabled={isLoading}
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
