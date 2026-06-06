import { NextRequest, NextResponse } from "next/server";
import { InsightsInputSchema, InsightsResponseSchema } from "@/lib/schema";
import { getStructuredCompletion } from "@/lib/groq";
import { buildInsightsPrompt } from "@/lib/prompts";
import { rateLimit } from "@/lib/rate-limit";

const insightsCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

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

  const parsed = InsightsInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation error" }, { status: 400 });
  }

  const { moodHistory, triggerHistory, examType } = parsed.data;

  const cacheKey = `${parsed.data.examType}-${parsed.data.moodHistory.slice(-7).map((e) => e.score).join("-")}`;
  const cached = insightsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const prompt = buildInsightsPrompt(moodHistory, triggerHistory, examType);
    const raw = await getStructuredCompletion([{ role: "user", content: prompt }]);
    const json = JSON.parse(raw) as unknown;
    const validated = InsightsResponseSchema.safeParse(json);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid insights response format" }, { status: 500 });
    }
    insightsCache.set(cacheKey, { data: validated.data, timestamp: Date.now() });
    return NextResponse.json(validated.data);
  } catch (err) {
    console.error("Insights API error:", err);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
