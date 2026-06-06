/**
 * Removes HTML tags, trims whitespace, and truncates to maxLen
 * @param str - The raw input string
 * @param maxLen - Maximum allowed character length
 * @returns Sanitized string safe for display
 */
export function sanitizeInput(str: string, maxLen: number): string {
  return str
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLen);
}

/**
 * Returns a hex color string based on a mood score
 * @param score - Mood score between 1 and 10
 * @returns Red for low scores, amber for mid, green for high
 */
export function getMoodColor(score: number): string {
  if (score <= 3) return "#EF4444";
  if (score <= 6) return "#F59E0B";
  return "#10B981";
}

/**
 * Returns a human-readable label for a mood score
 * @param score - Mood score between 1 and 10
 * @returns Label string such as "Good" or "Struggling"
 */
export function getMoodLabel(score: number): string {
  const labels: Record<number, string> = {
    1: "Very Low",
    2: "Low",
    3: "Struggling",
    4: "Not Great",
    5: "Okay",
    6: "Decent",
    7: "Good",
    8: "Great",
    9: "Excellent",
    10: "Amazing",
  };
  return labels[score] ?? "Unknown";
}

/**
 * Formats an ISO date string into a short locale string for Indian users
 * @param date - ISO date string
 * @returns Formatted string like "Mon, 3 Jun"
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

/**
 * Calculates the number of days remaining until an exam date
 * @param examDate - Exam date as a YYYY-MM-DD string
 * @returns Positive integer for future dates, 0 for today, negative for past dates
 */
export function getDaysUntilExam(examDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate);
  exam.setHours(0, 0, 0, 0);
  const diff = exam.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Returns a motivational message appropriate for the number of days left until the exam
 * @param daysLeft - Number of days remaining
 * @returns A motivational string tailored to the exam proximity
 */
export function getMotivationalMessage(daysLeft: number): string {
  if (daysLeft > 180)
    return "You have plenty of time — build strong foundations daily. Consistency beats intensity.";
  if (daysLeft > 90)
    return "Great momentum! Focus on understanding concepts deeply. You're building something incredible.";
  if (daysLeft > 30)
    return "The final stretch is here — trust your preparation and stay consistent. You've got this!";
  if (daysLeft > 7)
    return "Almost there! Revise smartly, sleep well, and believe in yourself. Your hard work will pay off.";
  if (daysLeft > 0)
    return "Last few days — stay calm, eat well, sleep enough. You are more prepared than you think!";
  return "Today is the day! Take a deep breath, trust yourself, and give it your best. Proud of you!";
}
