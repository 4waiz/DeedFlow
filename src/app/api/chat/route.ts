import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, dealContext } = (await request.json()) as {
      messages: ChatMessage[];
      dealContext?: string;
    };

    const groqApiKey = process.env.GROQ_CHAT_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "Chat API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are DeedFlow AI — a UAE real estate compliance assistant. You help users with fractional and tokenized property transactions in the UAE.

Your expertise:
- UAE property compliance workflows (KYC/AML, title deed verification, NOC collection, property valuation, escrow setup, settlement)
- Dubai Land Department (DLD) regulations
- RERA rules and requirements
- Fractional ownership and tokenized real estate
- Document requirements (Emirates ID, passport, title deed, NOC, SPA, escrow agreement, power of attorney, valuation report)
- KYC/AML verification processes
- Escrow account regulations

Rules:
- Keep responses concise (2-4 sentences max unless asked for detail)
- Be helpful, professional, and friendly
- If asked about something outside UAE real estate compliance, politely redirect
- Use simple language, avoid jargon unless the user uses it first
- When relevant, mention which documents or steps are needed next

${dealContext ? `\nCurrent deal context:\n${dealContext}` : ""}`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.slice(-10),
          ],
          temperature: 0.7,
          max_tokens: 512,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq Chat API error:", response.status, errorText);
      return NextResponse.json(
        { error: "Chat service unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Chat processing failed" },
      { status: 500 }
    );
  }
}
