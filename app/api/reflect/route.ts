import { NextRequest, NextResponse } from "next/server";
import { ReflectInputSchema } from "@/lib/schema";
import { getChatCompletion, getStructuredCompletion } from "@/lib/groq";
import { buildReflectSystemPrompt, buildCrisisDetectionPrompt } from "@/lib/prompts";
import { sanitizeInput } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ success: false, error: "Too many requests. Please wait." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ReflectInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation error" }, { status: 400 });
  }

  const { message, examType, recentMood, stressTags, conversationHistory } = parsed.data;
  const sanitized = sanitizeInput(message, 500);

  try {
    const systemPrompt = buildReflectSystemPrompt(examType, recentMood, stressTags);
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: sanitized },
    ];

    const crisisMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "user", content: buildCrisisDetectionPrompt(sanitized) },
    ];

    const [reply, crisisRaw] = await Promise.all([
      getChatCompletion(messages),
      getStructuredCompletion(crisisMessages),
    ]);

    let crisisDetected = false;
    try {
      const crisisData = JSON.parse(crisisRaw) as { crisisDetected?: boolean };
      crisisDetected = crisisData.crisisDetected === true;
    } catch {
      crisisDetected = false;
    }

    return NextResponse.json({ reply, crisisDetected });
  } catch (err) {
    console.error("Reflect API error:", err);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
