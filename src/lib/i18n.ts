export type Lang = "en" | "ar";

const translations: Record<string, Record<Lang, string>> = {
  // TopBar
  "app.title": { en: "DeedFlow", ar: "ديدفلو" },
  "app.subtitle": { en: "AI-Powered Property Compliance", ar: "الامتثال العقاري بالذكاء الاصطناعي" },
  "demo.mode": { en: "Demo Mode", ar: "وضع العرض" },
  "lang.toggle": { en: "العربية", ar: "English" },
  "simulate.event": { en: "Simulate Event", ar: "محاكاة حدث" },
  "demo.script": { en: "Demo Script", ar: "سيناريو العرض" },

  // Deal Picker
  "deals.title": { en: "Deals", ar: "الصفقات" },
  "deals.create": { en: "Create Deal", ar: "إنشاء صفقة" },
  "deals.filter.all": { en: "All", ar: "الكل" },
  "deals.filter.fractional": { en: "Fractional", ar: "كسري" },
  "deals.filter.tokenized": { en: "Tokenized", ar: "مرمز" },

  // Deal Details
  "deal.status": { en: "Status", ar: "الحالة" },
  "deal.compliance": { en: "Compliance Score", ar: "نقاط الامتثال" },
  "deal.risk": { en: "Risk Score", ar: "نقاط المخاطر" },
  "deal.timeline": { en: "Workflow Timeline", ar: "الجدول الزمني" },
  "deal.docs": { en: "Required Documents", ar: "المستندات المطلوبة" },
  "deal.parties": { en: "Parties", ar: "الأطراف" },
  "deal.governance": { en: "Governance", ar: "الحوكمة" },
  "deal.rent": { en: "Rent Distribution", ar: "توزيع الإيجار" },
  "deal.forecast": { en: "Time-to-Close Forecast", ar: "توقع وقت الإغلاق" },

  // Steps
  "step.kyc_aml": { en: "KYC/AML Verification", ar: "التحقق من الهوية ومكافحة غسيل الأموال" },
  "step.title_deed": { en: "Title Deed Verification", ar: "التحقق من سند الملكية" },
  "step.noc": { en: "NOC Collection", ar: "جمع شهادات عدم الممانعة" },
  "step.valuation": { en: "Property Valuation", ar: "تقييم العقار" },
  "step.escrow": { en: "Escrow Setup", ar: "إعداد حساب الضمان" },
  "step.settlement": { en: "Settlement", ar: "التسوية" },
  "step.issuance": { en: "Token/Share Issuance", ar: "إصدار الحصص/الرموز" },
  "step.post_close": { en: "Post-Close Automation", ar: "أتمتة ما بعد الإغلاق" },

  // Status
  "status.todo": { en: "Pending", ar: "معلق" },
  "status.in_progress": { en: "In Progress", ar: "قيد التنفيذ" },
  "status.done": { en: "Completed", ar: "مكتمل" },
  "status.blocked": { en: "Blocked", ar: "محظور" },
  "status.draft": { en: "Draft", ar: "مسودة" },
  "status.active": { en: "Active", ar: "نشط" },
  "status.completed": { en: "Completed", ar: "مكتمل" },
  "status.on_hold": { en: "On Hold", ar: "معلق" },

  // Agent / Copilot
  "agent.title": { en: "Compliance Copilot", ar: "مساعد الامتثال" },
  "agent.proceed": { en: "PROCEED", ar: "المتابعة" },
  "agent.hold": { en: "HOLD", ar: "انتظار" },
  "agent.escalate": { en: "ESCALATE", ar: "تصعيد" },
  "agent.request_noc": { en: "Request NOC", ar: "طلب شهادة عدم ممانعة" },
  "agent.send_doc_request": { en: "Send Doc Request", ar: "إرسال طلب مستند" },
  "agent.generate_pack": { en: "Generate Settlement Pack", ar: "إنشاء حزمة التسوية" },

  // Audit
  "audit.title": { en: "Live Activity Feed", ar: "سجل النشاط المباشر" },
  "audit.leaderboard": { en: "Most Helpful Reviewers", ar: "أفضل المراجعين" },

  // Simulation buttons
  "sim.approval_delay": { en: "Simulate Approval Delay", ar: "محاكاة تأخير الموافقة" },
  "sim.missing_doc": { en: "Simulate Missing Doc", ar: "محاكاة مستند مفقود" },
  "sim.fast_forward": { en: "Fast-forward 30m", ar: "تقديم سريع 30 دقيقة" },
  "sim.risk_surge": { en: "Surge Risk Score", ar: "ارتفاع مفاجئ في المخاطر" },

  // Pages
  "nav.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "nav.about": { en: "About", ar: "حول" },
  "nav.judge": { en: "Judge View", ar: "عرض الحكام" },

  // Doc types
  "doc.title_deed": { en: "Title Deed", ar: "سند الملكية" },
  "doc.noc": { en: "NOC", ar: "شهادة عدم ممانعة" },
  "doc.valuation_report": { en: "Valuation Report", ar: "تقرير التقييم" },
  "doc.kyc_doc": { en: "KYC Document", ar: "مستند التحقق من الهوية" },
  "doc.escrow_agreement": { en: "Escrow Agreement", ar: "اتفاقية الضمان" },
  "doc.spa": { en: "SPA", ar: "اتفاقية البيع والشراء" },
  "doc.power_of_attorney": { en: "Power of Attorney", ar: "توكيل رسمي" },
  "doc.passport": { en: "Passport", ar: "جواز السفر" },
  "doc.emirates_id": { en: "Emirates ID", ar: "هوية إماراتية" },

  // Trace OCR
  "ocr.title": { en: "Document Scanner", ar: "ماسح المستندات" },
  "ocr.subtitle": { en: "Powered by Trace OCR", ar: "مدعوم بـ Trace OCR" },
  "ocr.step1": { en: "1. Select document type", ar: "1. اختر نوع المستند" },
  "ocr.step2": { en: "2. Upload file (optional for demo)", ar: "2. ارفع الملف (اختياري للعرض)" },
  "ocr.drop": { en: "Click to browse or drag & drop a file", ar: "انقر للتصفح أو اسحب وأفلت ملف" },
  "ocr.formats": { en: "Images (PNG, JPG) or PDF", ar: "صور (PNG, JPG) أو PDF" },
  "ocr.scan_btn": { en: "Scan with Trace OCR", ar: "مسح بـ Trace OCR" },
  "ocr.scanning": { en: "Scanning document...", ar: "جاري مسح المستند..." },
  "ocr.results": { en: "Extracted Fields", ar: "الحقول المستخرجة" },
  "ocr.confidence": { en: "confidence", ar: "ثقة" },
  "ocr.done": { en: "Done — Document Added", ar: "تم — أُضيف المستند" },
  "ocr.extracted_fields": { en: "Extracted Fields:", ar: "الحقول المستخرجة:" },
  "ocr.scan.success": { en: "Document scanned & fields extracted!", ar: "تم مسح المستند واستخراج البيانات!" },
  "ocr.scan.error": { en: "OCR scan failed. Please try again.", ar: "فشل المسح. يرجى المحاولة مرة أخرى." },
  "ocr.ai_extracted": { en: "AI Extracted", ar: "مستخرج بالذكاء الاصطناعي" },

  // Chatbot
  "chat.title": { en: "DeedFlow AI", ar: "مساعد ديدفلو" },
  "chat.subtitle": { en: "Compliance Assistant", ar: "مساعد الامتثال" },
  "chat.welcome": { en: "How can I help?", ar: "كيف يمكنني المساعدة؟" },
  "chat.welcome_sub": { en: "Ask me about compliance, documents, or your deal progress.", ar: "اسألني عن الامتثال أو المستندات أو تقدم صفقتك." },
  "chat.placeholder": { en: "Ask about compliance...", ar: "اسأل عن الامتثال..." },
  "chat.powered_by": { en: "Powered by Groq AI", ar: "مدعوم بـ Groq AI" },

  // Voice
  "voice.listening": { en: "Listening...", ar: "جاري الاستماع..." },
  "voice.speak": { en: "Read aloud", ar: "قراءة بصوت عالٍ" },
  "voice.stop": { en: "Stop", ar: "إيقاف" },
  "voice.mic": { en: "Voice input", ar: "إدخال صوتي" },
  "voice.unsupported": { en: "Voice not supported in this browser", ar: "الصوت غير مدعوم في هذا المتصفح" },
  "voice.navigating": { en: "Navigating...", ar: "جاري التنقل..." },

  // Misc
  "upload.doc": { en: "Upload Document", ar: "رفع مستند" },
  "field.reports": { en: "Field Reports", ar: "تقارير ميدانية" },
  "create.deal.title": { en: "Create New Deal", ar: "إنشاء صفقة جديدة" },
  "close": { en: "Close", ar: "إغلاق" },
};

export function t(key: string, lang: Lang): string {
  return translations[key]?.[lang] || key;
}

export function getAllTranslations() {
  return translations;
}

// Mock translator for AR when Lingo.dev is not available
const mockArTranslations: Record<string, string> = {
  "Document verified successfully": "تم التحقق من المستند بنجاح",
  "Waiting for NOC from developer": "في انتظار شهادة عدم الممانعة من المطور",
  "KYC verification completed": "اكتمل التحقق من الهوية",
  "Settlement funds secured in escrow": "تم تأمين أموال التسوية في حساب الضمان",
  "Property valuation received": "تم استلام تقييم العقار",
  "All clear for settlement": "الوضع جاهز للتسوية",
  "Missing documentation detected": "تم اكتشاف نقص في المستندات",
  "Risk assessment updated": "تم تحديث تقييم المخاطر",
};

export function mockTranslate(text: string, targetLang: Lang): string {
  if (targetLang === "en") return text;
  return mockArTranslations[text] || `${text} (AR)`;
}
