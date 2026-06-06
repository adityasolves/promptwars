import type { MoodEntry, TriggerEntry } from "./schema";

const MAX_ENTRIES = 30;

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export function saveMoodEntry(entry: MoodEntry): void {
  const history = getMoodHistory();
  history.push(entry);
  if (history.length > MAX_ENTRIES) history.splice(0, history.length - MAX_ENTRIES);
  setItem("mindease_mood", history);
}

export function getMoodHistory(): MoodEntry[] {
  return getItem<MoodEntry[]>("mindease_mood", []);
}

export function getRecentMoodHistory(days: number): MoodEntry[] {
  const history = getMoodHistory();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return history.filter((e) => new Date(e.date) >= cutoff);
}

export function saveTriggerEntry(entry: TriggerEntry): void {
  const history = getTriggerHistory();
  history.push(entry);
  if (history.length > MAX_ENTRIES) history.splice(0, history.length - MAX_ENTRIES);
  setItem("mindease_triggers", history);
}

export function getTriggerHistory(): TriggerEntry[] {
  return getItem<TriggerEntry[]>("mindease_triggers", []);
}

export function saveExamConfig(exam: string, date: string): void {
  setItem("mindease_exam", { exam, date });
}

export function getExamConfig(): { exam: string; date: string } | null {
  return getItem<{ exam: string; date: string } | null>("mindease_exam", null);
}

export function clearAllData(): void {
  try {
    localStorage.removeItem("mindease_mood");
    localStorage.removeItem("mindease_triggers");
    localStorage.removeItem("mindease_exam");
  } catch {
    // ignore
  }
}
