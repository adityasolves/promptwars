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
  "I am building the life I deserve, one session at a time.",
  "I believe in my ability to succeed.",
  "Rest is part of my strategy, not weakness.",
];

const TIME_GREETINGS = [
  { label: "Good morning", message: "Start fresh — today is full of possibility." },
  { label: "Good afternoon", message: "Halfway through — you're doing great." },
  { label: "Good evening", message: "Wind down well. Rest fuels tomorrow's focus." },
];

export default function DailyAffirmation() {
  const [affirmation, setAffirmation] = useState("");
  const [greeting, setGreeting] = useState(TIME_GREETINGS[0]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const now = new Date();
    const seed = now.getFullYear() * 1000 + now.getMonth() * 31 + now.getDate();
    setAffirmation(AFFIRMATIONS[seed % AFFIRMATIONS.length]);
    const h = now.getHours();
    if (h >= 5 && h < 12) setGreeting(TIME_GREETINGS[0]);
    else if (h >= 12 && h < 18) setGreeting(TIME_GREETINGS[1]);
    else setGreeting(TIME_GREETINGS[2]);
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
        background: "linear-gradient(135deg, #FFFBEB 0%, #FEF9C3 100%)",
        borderColor: "rgba(217,119,6,0.12)",
      }}
    >
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">{greeting.label}</p>
        <p className="text-xs text-amber-600">{greeting.message}</p>
      </div>

      <div className="mb-4 rounded-xl bg-white/70 px-4 py-3.5 backdrop-blur-sm" style={{ border: "1px solid rgba(217,119,6,0.10)" }}>
        <p className="section-label mb-1.5 text-amber-500">Affirmation</p>
        <p className="text-sm font-semibold leading-relaxed text-amber-900">
          {affirmation || "Loading…"}
        </p>
      </div>

      <button
        onClick={handleCopy}
        className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
      >
        {copied ? "Copied!" : "Copy affirmation"}
      </button>
    </div>
  );
}
