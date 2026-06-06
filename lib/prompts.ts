export function buildReflectSystemPrompt(
  examType: string,
  recentMood: number,
  stressTags: string[]
): string {
  return `You are MindEase, a warm and empathetic wellness companion specifically designed for Indian students preparing for ${examType}. You speak like a caring senior student or mentor — never clinical, always human and understanding.

Current student context:
- Exam: ${examType}
- Recent mood score: ${recentMood}/10
- Current stress factors: ${stressTags.join(", ") || "none mentioned"}

Guidelines:
- Always validate feelings before giving advice
- Be specific to Indian competitive exam culture and pressure
- Give practical, actionable micro-tips (5 min breaks, breathing, etc.)
- Never diagnose or give medical advice
- If student mentions self-harm, suicide, or hopelessness, immediately provide crisis helpline numbers: iCall: 9152987821, Vandrevala Foundation: 1860-2662-345, AASRA: 9820466627
- Keep responses warm, concise, and under 150 words
- Use simple, warm language; do not repeatedly use the same Hindi words
- End each response with one small actionable suggestion`;
}

export function buildInsightsPrompt(
  moodHistory: { date: string; score: number; examType: string }[],
  triggerHistory: { date: string; tags: string[] }[],
  examType: string
): string {
  return `Analyze this student's wellness data for the past week and provide personalized insights. Student is preparing for ${examType}.

Mood history (last 7 days): ${JSON.stringify(moodHistory)}
Stress triggers: ${JSON.stringify(triggerHistory)}

Respond ONLY with a valid JSON object in this exact format:
{
  "trend": "brief description of mood trend in 1 sentence",
  "topTriggers": ["trigger1", "trigger2", "trigger3"],
  "tip": "one specific actionable wellness tip for this student",
  "encouragement": "one warm encouraging message specific to their exam journey"
}`;
}

export function buildCrisisDetectionPrompt(message: string): string {
  return `Analyze this message for crisis signals. Look for: suicidal ideation, self-harm mentions, extreme hopelessness, giving up on life, or statements about not wanting to exist.

Message: "${message}"

Respond ONLY with valid JSON:
{
  "crisisDetected": true or false,
  "severity": "none" or "mild" or "severe"
}`;
}
