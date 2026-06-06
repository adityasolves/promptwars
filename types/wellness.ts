export interface CrisisResource {
  name: string;
  number: string;
  description: string;
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: "iCall",
    number: "9152987821",
    description: "Psychosocial helpline by TISS",
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    description: "24/7 mental health helpline",
  },
  {
    name: "AASRA",
    number: "9820466627",
    description: "Crisis intervention helpline",
  },
  {
    name: "iMind",
    number: "040-44710100",
    description: "NIMHANS mental health helpline",
  },
];

export const EXAM_TYPES = [
  "NEET",
  "JEE",
  "CUET",
  "CAT",
  "GATE",
  "UPSC",
  "Board Exams",
  "Other",
];

export const STRESS_TAGS = [
  "Studies",
  "Mock Test",
  "Parents",
  "Peers",
  "Sleep",
  "Health",
  "Time Pressure",
  "Comparison",
  "Self-Doubt",
  "Syllabus",
  "Results",
  "Other",
];

export const MOOD_EMOJIS = [
  { score: 1, emoji: "😔", label: "Very Low" },
  { score: 2, emoji: "😞", label: "Low" },
  { score: 3, emoji: "😟", label: "Struggling" },
  { score: 4, emoji: "😕", label: "Not Great" },
  { score: 5, emoji: "😐", label: "Okay" },
  { score: 6, emoji: "🙂", label: "Decent" },
  { score: 7, emoji: "😊", label: "Good" },
  { score: 8, emoji: "😄", label: "Great" },
  { score: 9, emoji: "😁", label: "Excellent" },
  { score: 10, emoji: "🤩", label: "Amazing" },
];

export const MAX_MOOD_NOTE_LENGTH = 300
export const MAX_MESSAGE_LENGTH = 500
export const MAX_CONVERSATION_HISTORY = 10
export const MAX_STORAGE_ENTRIES = 30
export const INSIGHTS_CACHE_TTL_MS = 5 * 60 * 1000
export const CHAT_DEBOUNCE_MS = 1500
