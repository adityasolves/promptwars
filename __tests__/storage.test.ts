import { saveMoodEntry, getMoodHistory, saveTriggerEntry, getTriggerHistory, clearAllData, saveExamConfig, getExamConfig, getMoodStreak } from "@/lib/storage";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    length: 0,
    key: () => null,
  };
})();
Object.defineProperty(global, "localStorage", { value: localStorageMock, writable: true });

// Reset cache between tests by clearing localStorage
beforeEach(() => {
  localStorageMock.clear();
  clearAllData();
});

describe("saveMoodEntry and getMoodHistory", () => {
  it("saves entry and retrieves it", () => {
    const entry = { date: new Date().toISOString(), score: 7, emoji: "😊", examType: "NEET" };
    saveMoodEntry(entry);
    const history = getMoodHistory();
    expect(history.length).toBe(1);
    expect(history[0].score).toBe(7);
  });

  it("returns empty array when no data exists", () => {
    const history = getMoodHistory();
    expect(history).toEqual([]);
  });

  it("keeps only max 30 entries, removing oldest", () => {
    for (let i = 0; i < 31; i++) {
      saveMoodEntry({ date: new Date(Date.now() + i * 1000).toISOString(), score: (i % 9) + 1, emoji: "😊", examType: "NEET" });
    }
    const history = getMoodHistory();
    expect(history.length).toBe(30);
  });
});

describe("clearAllData", () => {
  it("removes all stored data", () => {
    saveMoodEntry({ date: new Date().toISOString(), score: 5, emoji: "😐", examType: "JEE" });
    saveExamConfig("NEET", "2025-05-04");
    clearAllData();
    expect(getMoodHistory()).toEqual([]);
    expect(getExamConfig()).toBeNull();
  });
});

describe("saveExamConfig and getExamConfig", () => {
  it("returns null when nothing is stored", () => {
    expect(getExamConfig()).toBeNull();
  });

  it("saves and retrieves exam config", () => {
    saveExamConfig("NEET", "2025-05-04");
    const cfg = getExamConfig();
    expect(cfg?.exam).toBe("NEET");
    expect(cfg?.date).toBe("2025-05-04");
  });
});

describe("getMoodStreak", () => {
  it("returns 0 when no entries exist", () => {
    expect(getMoodStreak()).toBe(0);
  });

  it("returns 1 when only today has an entry", () => {
    saveMoodEntry({ date: new Date().toISOString(), score: 6, emoji: "🙂", examType: "JEE" });
    expect(getMoodStreak()).toBe(1);
  });
});

describe("saveTriggerEntry and getTriggerHistory", () => {
  it("saves and retrieves trigger entries", () => {
    const entry = { date: new Date().toISOString(), tags: ["Studies", "Sleep"] };
    saveTriggerEntry(entry);
    const history = getTriggerHistory();
    expect(history.length).toBe(1);
    expect(history[0].tags).toEqual(["Studies", "Sleep"]);
  });
});
