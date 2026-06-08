"use client";

import React from "react";

const TIPS = [
  "Take a 5-minute walk between study sessions to reset your focus.",
  "Write down 3 things you studied today that you understood well.",
  "Call a friend for 10 minutes — social connection reduces cortisol.",
  "Drink a glass of water right now — dehydration affects concentration.",
  "Set a timer for 25 minutes and work with zero distractions.",
  "Stretch your neck and shoulders — tension builds up during long sessions.",
  "Look out of a window for 2 minutes to rest your eyes.",
  "Write your top 3 priorities for tomorrow before you sleep tonight.",
  "Practice the 5-4-3-2-1 grounding exercise when feeling anxious.",
  "Eat a fruit before studying — natural sugars fuel your brain.",
  "Review yesterday's notes for 10 minutes before starting new material.",
  "Take 10 slow, deep breaths right now. Your mind will thank you.",
  "Sleep is your secret weapon — aim for 7–8 hours every night.",
  "Create a dedicated study space your brain associates with focus.",
  "Turn your phone face-down during study sessions.",
  "Reward yourself after completing a difficult topic. Small wins matter.",
  "Don't compare your preparation with others — your journey is unique.",
  "Journal 3 sentences about how you feel before starting your day.",
  "If overwhelmed, break the syllabus into tiny 15-minute chunks.",
  "Mock tests are your best teacher — review every wrong answer.",
  "Sunlight in the morning sets your circadian rhythm for better sleep.",
  "Explain a concept aloud — it deepens understanding significantly.",
  "Green tea over excessive coffee — L-theanine calms without crashing.",
  "A 20-minute power nap can restore energy better than coffee.",
  "Celebrate small wins — finishing a chapter deserves a moment of pride.",
  "Talk to your parents about how you feel — they want to help.",
  "Revision matters more than new learning in the final 30 days.",
  "Plan your exam day — wake time, meals, travel. Remove surprises.",
  "Forgive yourself for yesterday's mistakes — today is a fresh start.",
  "You are more than your rank. Your worth is not defined by one exam.",
];

function WellnessTip() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const tip = TIPS[dayOfYear % TIPS.length];

  return (
    <div className="card fade-in flex h-full flex-col">
      <div className="mb-3">
        <p className="section-label mb-0.5">Wellness</p>
        <h2 className="text-lg font-semibold text-[var(--text)]">Today&apos;s Tip</h2>
        <p className="text-xs text-[var(--text-muted)]">
          {today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      <div className="flex-1 rounded-xl bg-[var(--primary-light)] px-4 py-4" style={{ border: "1px solid rgba(79,70,229,0.10)" }}>
        <p className="text-sm font-medium leading-relaxed text-[var(--text)]">{tip}</p>
      </div>

      <div className="mt-3 rounded-xl bg-gray-50 px-4 py-3" style={{ border: "1px solid #F4F4F5" }}>
        <p className="text-xs text-[var(--text-muted)]">
          Small habits compound into massive results. Keep showing up.
        </p>
      </div>
    </div>
  );
}

export default React.memo(WellnessTip);
