import { NextRequest, NextResponse } from "next/server";
import { InsightsInputSchema, InsightsResponseSchema } from "@/lib/schema";
import { getStructuredCompletion } from "@/lib/groq";
import { buildInsightsPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = InsightsInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Validation error" }, { status: 400 });
  }

  const { moodHistory, triggerHistory, examType } = parsed.data;

  try {
    const prompt = buildInsightsPrompt(moodHistory, triggerHistory, examType);
    const raw = await getStructuredCompletion([{ role: "user", content: prompt }]);
    const json = JSON.parse(raw) as unknown;
    const validated = InsightsResponseSchema.safeParse(json);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid insights response format" }, { status: 500 });
    }
    return NextResponse.json(validated.data);
  } catch (err) {
    console.error("Insights API error:", err);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
