import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Be concise and friendly.",
        },
        ...messages,
      ],
      model: "openai/gpt-oss-20b",
      max_tokens: 1024,
    });

    const reply =
      chatCompletion.choices[0]?.message?.content ?? "No response generated.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Groq error:", error?.message ?? error);
    return NextResponse.json(
      { reply: `Error: ${error?.message ?? "Something went wrong"}` },
      { status: 500 },
    );
  }
}
