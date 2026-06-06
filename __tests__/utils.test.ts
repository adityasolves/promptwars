import { sanitizeInput, getMoodColor, getDaysUntilExam, getMotivationalMessage } from "@/lib/utils";

describe("sanitizeInput", () => {
  it("strips <script> tags", () => {
    const result = sanitizeInput('<script>alert("xss")</script>Hello', 500);
    expect(result).not.toContain("<script>");
    expect(result).toContain("Hello");
  });

  it("strips all HTML tags", () => {
    const result = sanitizeInput("<b>bold</b> text", 500);
    expect(result).toBe("bold text");
  });

  it("truncates to maxLen", () => {
    const result = sanitizeInput("a".repeat(100), 10);
    expect(result.length).toBe(10);
  });

  it("trims whitespace", () => {
    const result = sanitizeInput("  hello  ", 500);
    expect(result).toBe("hello");
  });
});

describe("getMoodColor", () => {
  it("returns red for score 2", () => {
    expect(getMoodColor(2)).toBe("#EF4444");
  });

  it("returns red for score 1", () => {
    expect(getMoodColor(1)).toBe("#EF4444");
  });

  it("returns amber for score 5", () => {
    expect(getMoodColor(5)).toBe("#F59E0B");
  });

  it("returns amber for score 4", () => {
    expect(getMoodColor(4)).toBe("#F59E0B");
  });

  it("returns green for score 8", () => {
    expect(getMoodColor(8)).toBe("#10B981");
  });

  it("returns green for score 10", () => {
    expect(getMoodColor(10)).toBe("#10B981");
  });
});

describe("getDaysUntilExam", () => {
  it("returns correct number of days for a future date", () => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    const dateStr = future.toISOString().split("T")[0];
    const days = getDaysUntilExam(dateStr);
    expect(days).toBe(30);
  });

  it("returns 0 for today", () => {
    const today = new Date().toISOString().split("T")[0];
    const days = getDaysUntilExam(today);
    expect(days).toBe(0);
  });

  it("returns negative for past date", () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    const dateStr = past.toISOString().split("T")[0];
    const days = getDaysUntilExam(dateStr);
    expect(days).toBeLessThan(0);
  });
});

describe("Additional sanitizeInput edge cases", () => {
  it("returns empty string for empty input", () => {
    expect(sanitizeInput("", 100)).toBe("");
  });

  it("strips HTML tags leaving only inner text", () => {
    const result = sanitizeInput("<script>alert('xss')</script>", 100);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("</script>");
  });
});

describe("Additional getMoodColor boundary tests", () => {
  it("returns red for score exactly 3", () => {
    expect(getMoodColor(3)).toBe("#EF4444");
  });

  it("returns amber for score exactly 4", () => {
    expect(getMoodColor(4)).toBe("#F59E0B");
  });

  it("returns amber for score exactly 6", () => {
    expect(getMoodColor(6)).toBe("#F59E0B");
  });

  it("returns green for score exactly 7", () => {
    expect(getMoodColor(7)).toBe("#10B981");
  });
});

describe("Additional getDaysUntilExam edge cases", () => {
  it("returns a negative number for a past date", () => {
    const past = new Date();
    past.setDate(past.getDate() - 10);
    const dateStr = past.toISOString().split("T")[0];
    expect(getDaysUntilExam(dateStr)).toBeLessThan(0);
  });
});

describe("getMotivationalMessage", () => {
  it("returns long-term message for more than 180 days", () => {
    const msg = getMotivationalMessage(200);
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
  });
  it("returns message for 7-30 days range", () => {
    const msg = getMotivationalMessage(15);
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
  });
  it("returns message for 0 days", () => {
    const msg = getMotivationalMessage(0);
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
  });
});
