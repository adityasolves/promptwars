import {
  MoodEntrySchema,
  ReflectInputSchema,
  TriggerEntrySchema,
} from "@/lib/schema";

describe("MoodEntrySchema", () => {
  it("accepts a valid entry", () => {
    const result = MoodEntrySchema.safeParse({
      date: new Date().toISOString(),
      score: 7,
      emoji: "😊",
      note: "Feeling good today",
      examType: "NEET",
    });
    expect(result.success).toBe(true);
  });

  it("rejects score greater than 10", () => {
    const result = MoodEntrySchema.safeParse({
      date: new Date().toISOString(),
      score: 11,
      emoji: "😊",
      examType: "NEET",
    });
    expect(result.success).toBe(false);
  });

  it("rejects score less than 1", () => {
    const result = MoodEntrySchema.safeParse({
      date: new Date().toISOString(),
      score: 0,
      emoji: "😔",
      examType: "JEE",
    });
    expect(result.success).toBe(false);
  });
});

describe("ReflectInputSchema", () => {
  it("rejects message longer than 500 characters", () => {
    const result = ReflectInputSchema.safeParse({
      message: "a".repeat(501),
      examType: "NEET",
      recentMood: 5,
      stressTags: [],
      conversationHistory: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects conversationHistory with more than 10 entries", () => {
    const result = ReflectInputSchema.safeParse({
      message: "Hello",
      examType: "JEE",
      recentMood: 6,
      stressTags: [],
      conversationHistory: Array.from({ length: 11 }, () => ({
        role: "user" as const,
        content: "test",
      })),
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid input", () => {
    const result = ReflectInputSchema.safeParse({
      message: "I feel stressed about my exam",
      examType: "GATE",
      recentMood: 4,
      stressTags: ["Studies", "Sleep"],
      conversationHistory: [],
    });
    expect(result.success).toBe(true);
  });
});

describe("TriggerEntrySchema", () => {
  it("accepts a valid tags array", () => {
    const result = TriggerEntrySchema.safeParse({
      date: new Date().toISOString(),
      tags: ["Studies", "Mock Test", "Sleep"],
      description: "Had a tough mock test today",
    });
    expect(result.success).toBe(true);
  });

  it("accepts entry with empty tags array", () => {
    const result = TriggerEntrySchema.safeParse({
      date: new Date().toISOString(),
      tags: [],
    });
    expect(result.success).toBe(true);
  });
});

describe("Additional MoodEntrySchema edge cases", () => {
  it("rejects score of 0", () => {
    const result = MoodEntrySchema.safeParse({
      date: new Date().toISOString(), score: 0, emoji: "😔", examType: "NEET",
    });
    expect(result.success).toBe(false);
  });

  it("rejects score of 11", () => {
    const result = MoodEntrySchema.safeParse({
      date: new Date().toISOString(), score: 11, emoji: "🤩", examType: "JEE",
    });
    expect(result.success).toBe(false);
  });

  it("rejects note with 301 characters", () => {
    const result = MoodEntrySchema.safeParse({
      date: new Date().toISOString(), score: 5, emoji: "😐", examType: "NEET",
      note: "a".repeat(301),
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid mood entry with all optional fields", () => {
    const result = MoodEntrySchema.safeParse({
      date: new Date().toISOString(), score: 8, emoji: "😄", examType: "CAT",
      note: "Great study session",
    });
    expect(result.success).toBe(true);
  });
});

describe("Additional ReflectInputSchema edge cases", () => {
  it("rejects empty string message", () => {
    const result = ReflectInputSchema.safeParse({
      message: "", examType: "NEET", recentMood: 5, stressTags: [],
      conversationHistory: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects conversationHistory with 11 entries", () => {
    const result = ReflectInputSchema.safeParse({
      message: "Hello", examType: "JEE", recentMood: 5, stressTags: [],
      conversationHistory: Array.from({ length: 11 }, () => ({
        role: "user" as const, content: "test",
      })),
    });
    expect(result.success).toBe(false);
  });
});
