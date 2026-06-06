"use client";

import { useState, useEffect } from "react";

const AFFIRMATIONS = [
  "I am capable and prepared for the challenges ahead.",
  "Every hour of study brings me closer to my dream.",
  "I handle pressure with grace and focus.",
  "I am making progress, even on hard days.",
  "My efforts today will pay off tomorrow.",
  "I am resilient, resourceful, and unstoppable.",
  "I choose to learn from every mistake I make.",
  "I am exactly where I need to be right now.",
  "I trust the process and stay consistent.",
  "I am stronger than my doubts.",
  "My dedication sets me apart.",
  "I welcome challenges as opportunities to grow.",
  "I am building the life I deserve, one study session at a time.",
  "I believe in my ability to succeed.",
  "Rest is part of my strategy, not weakness.",
];

const MOODS_OF_DAY = [
  { time: "Morning", icon: "🌅", message: "Start fresh. Today is full of possibility." },
  { time: "Afternoon", icon: "☀️", message: "Halfway through — you're doing great." },
  { time: "Evening", icon: "🌙", message: "Wind down well. Rest fuels tomorrow's focus." },
];

export default function DailyAffirmation() {
  const [affirmation, setAffirmation] = useState("");
  const [timeGreeting, setTimeGreeting] = useState(MOODS_OF_DAY[0]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const now = new Date();
    const seed = now.getFullYear() * 1000 + now.getMonth() * 31 + now.getDate();
    setAffirmation(AFFIRMATIONS[seed % AFFIRMATIONS.length]);
    const h = now.getHours();
    if (h >= 5 && h < 12) setTimeGreeting(MOODS_OF_DAY[0]);
    else if (h >= 12 && h < 18) setTimeGreeting(MOODS_OF_DAY[1]);
    else setTimeGreeting(MOODS_OF_DAY[2]);
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(affirmation).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border px-5 py-5"
      style={{
        background: "linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 50%, #ECFDF5 100%)",
        borderColor: "rgba(245,158,11,0.15)",
        boxShadow: "0 2px 16px -4px rgba(245,158,11,0.12)",
      }}
    >
      {/* Decorative */}
      <div className="absolute right-0 top-0 text-6xl opacity-10 select-none">✨</div>

      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">{timeGreeting.icon}</span>
        <div>
          <p className="text-xs font-semibold text-amber-700">{timeGreeting.time} check-in</p>
          <p className="text-[11px] text-amber-600">{timeGreeting.message}</p>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-white/60 px-4 py-3 backdrop-blur-sm">
        <p className="section-label mb-1.5 text-amber-600">Today&apos;s Affirmation</p>
        <p className="font-display text-[15px] font-semibold leading-relaxed text-amber-900">
          {affirmation || "Loading…"}
        </p>
      </div>

      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
      >
        {copied ? "✓ Copied!" : "📋 Copy affirmation"}
      </button>
    </div>
  );
}
