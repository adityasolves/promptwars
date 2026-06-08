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
  { label: "Students supported", value: "50,000+" },
  { label: "Study sessions logged", value: "2M+" },
  { label: "Stress moments eased", value: "500K+" },
  { label: "Exams conquered", value: "10,000+" },
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
      <div className="absolute inset-0 dot-grid" />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" />

      <div className="relative z-10 px-7 py-8 sm:px-10 sm:py-10">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Daily Inspiration</p>
            <p className="text-lg font-bold text-white">MindEase</p>
          </div>
          <button
            onClick={nextQuote}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm transition hover:bg-white/20"
          >
            Next quote
          </button>
        </div>

        {/* Quote */}
        <div className="mb-7 transition-opacity duration-200" style={{ opacity: visible ? 1 : 0 }}>
          <p className="mb-2 text-xl font-semibold italic leading-snug text-white sm:text-2xl">
            &ldquo;{q.text}&rdquo;
          </p>
          <p className="text-sm text-white/55">— {q.author}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-base font-bold text-white">{s.value}</p>
              <p className="text-[11px] text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
