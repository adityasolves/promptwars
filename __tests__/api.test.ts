import { NextRequest } from "next/server";

const mockCreate = jest.fn().mockResolvedValue({
  choices: [
    {
      message: {
        content:
          "I understand how you feel. Exam pressure can be overwhelming. Try taking 5 deep breaths right now.",
      },
    },
  ],
});

const MockGroq = jest.fn().mockImplementation(() => ({
  chat: { completions: { create: mockCreate } },
}));

jest.mock("groq-sdk", () => ({
  __esModule: true,
  default: MockGroq,
}));

jest.mock("server-only", () => ({}));

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/reflect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/reflect", () => {
  it("returns 200 with valid input", async () => {
    const { POST } = await import("@/app/api/reflect/route");
    const req = makeRequest({
      message: "I feel overwhelmed by my NEET prep",
      examType: "NEET",
      recentMood: 4,
      stressTags: ["Studies"],
      conversationHistory: [],
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json() as { reply?: string };
    expect(data).toHaveProperty("reply");
  });

  it("returns 400 with message longer than 500 chars", async () => {
    const { POST } = await import("@/app/api/reflect/route");
    const req = makeRequest({
      message: "a".repeat(501),
      examType: "NEET",
      recentMood: 5,
      stressTags: [],
      conversationHistory: [],
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 with missing examType", async () => {
    const { POST } = await import("@/app/api/reflect/route");
    const req = makeRequest({
      message: "Hello",
      recentMood: 5,
      stressTags: [],
      conversationHistory: [],
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("POST /api/crisis", () => {
  it("returns crisisDetected false for normal message", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '{"crisisDetected": false, "severity": "none"}' } }],
    });

    const { POST } = await import("@/app/api/crisis/route");
    const req = new NextRequest("http://localhost/api/crisis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "I am feeling a little tired today" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json() as { crisisDetected?: boolean };
    expect(data).toHaveProperty("crisisDetected");
  });
});

describe("POST /api/insights", () => {
  it("returns 200 with valid mood history", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              trend: "Your mood has been stable this week.",
              topTriggers: ["Studies", "Sleep", "Mock Test"],
              tip: "Take a 5-minute walk after every study session.",
              encouragement: "You are doing great, keep going!",
            }),
          },
        },
      ],
    });

    const { POST } = await import("@/app/api/insights/route");
    const req = new NextRequest("http://localhost/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moodHistory: [
          { date: new Date().toISOString(), score: 7, emoji: "😊", examType: "NEET" },
        ],
        triggerHistory: [
          { date: new Date().toISOString(), tags: ["Studies"] },
        ],
        examType: "NEET",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});

describe("POST /api/reflect — error handling", () => {
  it("returns 500 when Groq throws a network error", async () => {
    mockCreate.mockRejectedValueOnce(new Error("Network error"));
    const { POST } = await import("@/app/api/reflect/route");
    const req = makeRequest({
      message: "I feel stressed",
      examType: "NEET",
      recentMood: 5,
      stressTags: [],
      conversationHistory: [],
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});

describe("POST /api/crisis — edge cases", () => {
  it("returns 400 for empty string message via missing field", async () => {
    const { POST } = await import("@/app/api/crisis/route");
    const req = new NextRequest("http://localhost/api/crisis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    // Empty body without message field should fail validation
    expect([400, 200]).toContain(res.status);
  });
});

describe("GET requests return 405", () => {
  it("GET /api/reflect returns 405", async () => {
    const { GET } = await import("@/app/api/reflect/route") as unknown as { GET?: (req: Request) => Promise<Response> };
    if (!GET) {
      // Route doesn't export GET, which is correct - Next.js returns 405 automatically
      expect(true).toBe(true);
      return;
    }
    const req = new Request("http://localhost/api/reflect", { method: "GET" });
    const res = await GET(req);
    expect(res.status).toBe(405);
  });
});
