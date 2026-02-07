import { NextRequest, NextResponse } from "next/server";
import { mockTranslate } from "@/lib/i18n";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, targetLang } = body;

  if (!text || !targetLang) {
    return NextResponse.json({ error: "Missing required fields: text, targetLang" }, { status: 400 });
  }

  // Try Lingo.dev if API key is available
  const lingoApiKey = process.env.LINGO_API_KEY;

  if (lingoApiKey) {
    try {
      // Attempt Lingo.dev translation
      const response = await fetch("https://api.lingo.dev/v1/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lingoApiKey}`,
        },
        body: JSON.stringify({
          text,
          source_language: targetLang === "ar" ? "en" : "ar",
          target_language: targetLang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          translated: data.translated_text || data.translation || data.text,
          source: "lingo.dev",
          original: text,
        });
      }
    } catch {
      // Fallback to mock translator
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
