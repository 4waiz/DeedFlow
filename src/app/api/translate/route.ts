import { NextRequest, NextResponse } from "next/server";
import { mockTranslate } from "@/lib/i18n";
import { requireApiSession } from "@/lib/auth/require-session";

export async function POST(req: NextRequest) {
  const auth = await requireApiSession("deals:read");
  if (!auth.ok) {
    return auth.response;
  }

  const body = await req.json();
  const { text, targetLang } = body;

  if (!text || !targetLang) {
    return NextResponse.json({ error: "Missing required fields: text, targetLang" }, { status: 400 });
  }

  // Try Lingo.dev SDK if API key is available
  const lingoApiKey = process.env.LINGODOTDEV_API_KEY;

  if (lingoApiKey) {
    try {
      const { LingoDotDevEngine } = await import("lingo.dev/sdk");
      const lingoDotDev = new LingoDotDevEngine({ apiKey: lingoApiKey });

      const result = await lingoDotDev.localizeText(text, {
        sourceLocale: targetLang === "ar" ? "en" : "ar",
        targetLocale: targetLang,
      });

      return NextResponse.json({
        translated: result,
        source: "lingo.dev",
        original: text,
      });
    } catch (err) {
      console.error("Lingo.dev translation failed, falling back to mock:", err);
    }
  }

  // Mock translation fallback
  const translated = mockTranslate(text, targetLang);
  return NextResponse.json({
    translated,
    source: "mock",
    original: text,
  });
}
