"use client";

import { useState, useEffect } from "react";

const QUOTES = [
  { text: "Success is not final, failure is not fatal — it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Every champion was once a contender who refused to give up.", author: "Rocky Balboa" },
  { text: "Dream it. Believe it. Build it.", author: "Unknown" },
];

const STATS = [
  { icon: "🎯", label: "Students supported", value: "50,000+" },
  { icon: "📚", label: "Study sessions logged", value: "2M+" },
  { icon: "😌", label: "Stress moments eased", value: "500K+" },
  { icon: "🏆", label: "Exams conquered", value: "10,000+" },
];

export default function MotivationBanner() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    setQuoteIdx(seed % QUOTES.length);
  }, []);

  function nextQuote() {
    setVisible(false);
    setTimeout(() => {
      setQuoteIdx((i) => (i + 1) % QUOTES.length);
      setVisible(true);
    }, 200);
  }

  const q = QUOTES[quoteIdx];

  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ background: "var(--gradient-hero)" }}>
      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Decorative circles */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5" />
      <div className="absolute right-32 bottom-0 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
        {/* Header row */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl backdrop-blur-sm">
              🧠
            </div>
            <div>
              <p className="font-heading text-lg font-bold text-white sm:text-xl">MindEase</p>
              <p className="text-xs text-white/60">Your Wellness Companion</p>
            </div>
          </div>
          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            ✨ Daily Inspiration
          </div>
        </div>

        {/* Quote */}
        <div
          className="mb-6 transition-opacity duration-200"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <p className="font-display mb-2 text-xl font-semibold italic leading-snug text-white sm:text-2xl">
            &ldquo;{q.text}&rdquo;
          </p>
          <p className="text-sm text-white/60">— {q.author}</p>
        </div>

        {/* Stats row */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm"
            >
              <p className="text-lg">{s.icon}</p>
              <p className="font-heading text-base font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-white/55">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/50">
            You are capable of more than you know.
          </p>
          <button
            onClick={nextQuote}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Next quote →
          </button>
        </div>
      </div>
    </div>
  );
}
