export function sanitizeInput(str: string, maxLen: number): string {
  return str
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLen);
}

export function getMoodColor(score: number): string {
  if (score <= 3) return "#EF4444";
  if (score <= 6) return "#F59E0B";
  return "#10B981";
}

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

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function getDaysUntilExam(examDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate);
  exam.setHours(0, 0, 0, 0);
  const diff = exam.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

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
