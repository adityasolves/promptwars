import { z } from "zod";

export const MoodEntrySchema = z.object({
  date: z.string(),
  score: z.number().min(1).max(10),
  emoji: z.string(),
  note: z.string().max(300).optional(),
  examType: z.string(),
});

export const TriggerEntrySchema = z.object({
  date: z.string(),
  tags: z.array(z.string()),
  description: z.string().max(200).optional(),
});

export const ReflectInputSchema = z.object({
  message: z.string().min(1).max(500),
  examType: z.string(),
  recentMood: z.number().min(1).max(10),
  stressTags: z.array(z.string()),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(500),
      })
    )
    .max(10),
});

export const InsightsInputSchema = z.object({
  moodHistory: z.array(MoodEntrySchema).max(30),
  triggerHistory: z.array(TriggerEntrySchema).max(30),
  examType: z.string(),
});

export const CrisisInputSchema = z.object({
  message: z.string().max(500),
});

export const InsightsResponseSchema = z.object({
  trend: z.string(),
  topTriggers: z.array(z.string()),
  tip: z.string(),
  encouragement: z.string(),
});

export type MoodEntry = z.infer<typeof MoodEntrySchema>;
export type TriggerEntry = z.infer<typeof TriggerEntrySchema>;
export type ReflectInput = z.infer<typeof ReflectInputSchema>;
export type InsightsInput = z.infer<typeof InsightsInputSchema>;
export type InsightsResponse = z.infer<typeof InsightsResponseSchema>;
