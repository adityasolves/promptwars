import type { MoodEntry, TriggerEntry } from "./schema";
import { MAX_STORAGE_ENTRIES } from "@/types/wellness";

const MAX_ENTRIES = MAX_STORAGE_ENTRIES;

// Module-level in-memory cache to avoid repeated localStorage reads
const cache: Record<string, unknown> = {};

function getItem<T>(key: string, fallback: T): T {
  if (key in cache) return cache[key] as T;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    cache[key] = parsed;
    return parsed;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  cache[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

/**
 * Saves a mood entry to localStorage, keeping only the most recent MAX_ENTRIES
 * @param entry - The mood entry to save
 */
export function saveMoodEntry(entry: MoodEntry): void {
  const history = getMoodHistory();
  history.push(entry);
  if (history.length > MAX_ENTRIES) history.splice(0, history.length - MAX_ENTRIES);
  setItem("mindease_mood", history);
}

/**
 * Retrieves all stored mood entries
 * @returns Array of MoodEntry objects, oldest first
 */
export function getMoodHistory(): MoodEntry[] {
  return getItem<MoodEntry[]>("mindease_mood", []);
}

/**
 * Retrieves mood entries from the last N days
 * @param days - Number of days to look back
 * @returns Filtered array of MoodEntry objects within the time window
 */
export function getRecentMoodHistory(days: number): MoodEntry[] {
  const history = getMoodHistory();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return history.filter((e) => new Date(e.date) >= cutoff);
}

/**
 * Saves a stress trigger entry to localStorage
 * @param entry - The trigger entry to save
 */
export function saveTriggerEntry(entry: TriggerEntry): void {
  const history = getTriggerHistory();
  history.push(entry);
  if (history.length > MAX_ENTRIES) history.splice(0, history.length - MAX_ENTRIES);
  setItem("mindease_triggers", history);
}

/**
 * Retrieves all stored trigger entries
 * @returns Array of TriggerEntry objects
 */
export function getTriggerHistory(): TriggerEntry[] {
  return getItem<TriggerEntry[]>("mindease_triggers", []);
}

/**
 * Saves exam configuration to localStorage
 * @param exam - The exam type string (e.g. "NEET")
 * @param date - The exam date as a YYYY-MM-DD string
 */
export function saveExamConfig(exam: string, date: string): void {
  setItem("mindease_exam", { exam, date });
}

/**
 * Retrieves the stored exam configuration
 * @returns Exam config object or null if not set
 */
export function getExamConfig(): { exam: string; date: string } | null {
  return getItem<{ exam: string; date: string } | null>("mindease_exam", null);
}

/**
 * Clears all MindEase data from localStorage and the in-memory cache
 */
export function clearAllData(): void {
  delete cache["mindease_mood"];
  delete cache["mindease_triggers"];
  delete cache["mindease_exam"];
  try {
    localStorage.removeItem("mindease_mood");
    localStorage.removeItem("mindease_triggers");
    localStorage.removeItem("mindease_exam");
  } catch {
    // ignore
  }
}

/**
 * Calculates the current consecutive day streak of mood entries
 * @returns number of consecutive days with at least one mood entry
 */
export function getMoodStreak(): number {
  const history = getMoodHistory();
  if (history.length === 0) return 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const dates = [...new Set(history.map((e) => new Date(e.date).toDateString()))].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  if (dates[0] !== today && dates[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime();
    if (diff <= 86400000 + 1000) streak++;
    else break;
  }
  return streak;
}
