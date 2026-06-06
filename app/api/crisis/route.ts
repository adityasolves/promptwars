import { NextRequest, NextResponse } from "next/server";
import { CrisisInputSchema } from "@/lib/schema";
import { getStructuredCompletion } from "@/lib/groq";
import { buildCrisisDetectionPrompt } from "@/lib/prompts";
import { CRISIS_RESOURCES } from "@/types/wellness";
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

  const parsed = CrisisInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation error" }, { status: 400 });
  }

  const { message } = parsed.data;

  try {
    const prompt = buildCrisisDetectionPrompt(message);
    const raw = await getStructuredCompletion([{ role: "user", content: prompt }]);
    const data = JSON.parse(raw) as { crisisDetected?: boolean; severity?: string };
    const crisisDetected = data.crisisDetected === true;

    return NextResponse.json({
      crisisDetected,
      ...(crisisDetected ? { resources: CRISIS_RESOURCES } : {}),
    });
  } catch (err) {
    console.error("Crisis API error:", err);
    return NextResponse.json({ error: "Failed to analyze message" }, { status: 500 });
  }
}
