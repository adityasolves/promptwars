"use client";

import React from "react";

const TIPS = [
  "Take a 5-minute walk between study sessions to reset your focus.",
  "Write down 3 things you studied today that you understood well.",
  "Call a friend for 10 minutes — social connection reduces cortisol.",
  "Drink a glass of water right now — dehydration affects concentration.",
  "Set a timer for 25 minutes and work with zero distractions (Pomodoro).",
  "Stretch your neck and shoulders — tension builds up during long study sessions.",
  "Look out of a window for 2 minutes to rest your eyes and refresh your mind.",
  "Write your top 3 priorities for tomorrow before you sleep tonight.",
  "Practice the 5-4-3-2-1 grounding exercise if you feel anxious.",
  "Eat a fruit before studying — natural sugars fuel your brain without a crash.",
  "Review your notes from yesterday for 10 minutes before starting new material.",
  "Take 10 slow, deep breaths right now. Your mind will thank you.",
  "Sleep is your secret weapon — aim for 7-8 hours every night.",
  "Create a dedicated study space — your brain will associate it with focus.",
  "Turn your phone face-down during study sessions. Notifications kill deep work.",
  "Reward yourself after completing a difficult topic. Small wins matter.",
  "Don't compare your preparation with others — your journey is unique.",
  "Journal 3 sentences about how you feel before starting your day.",
  "If you feel overwhelmed, break the syllabus into tiny 15-minute chunks.",
  "Mock tests are your best teacher — review every wrong answer carefully.",
  "Sunlight in the morning sets your circadian rhythm for better sleep.",
  "Try explaining a concept you just learned aloud — it deepens understanding.",
  "Drink green tea instead of excessive coffee — L-theanine calms without crashing.",
  "A 20-minute power nap can restore your energy better than coffee.",
  "Celebrate small wins — finishing a chapter is worth a moment of pride.",
  "Talk to your parents about how you're feeling — they want to help.",
  "Revision is more important than new learning in the last 30 days.",
  "Write your exam day plan — what time to wake, eat, and reach the center.",
  "Forgive yourself for yesterday's mistakes — today is a fresh start.",
  "You are more than your rank. Your worth is not defined by one exam.",
];

const TIP_ICONS = ["💧","🚶","📝","🍎","⏱️","🧘","👁️","🌙","🫁","📖","💪","🛌","🏠","📵","🎯","🪞","📓","🔀","📋","☀️","🗣️","🍵","💤","🎉","💬","📅","✍️","🙏","⭐","❤️"];

function WellnessTip() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const tipIdx = dayOfYear % TIPS.length;
  const tip = TIPS[tipIdx];
  const icon = TIP_ICONS[tipIdx % TIP_ICONS.length];

  return (
    <div className="card-gradient fade-in flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="section-label mb-0.5">Daily Wellness</p>
          <h2 className="font-heading text-lg font-bold text-[var(--text)]">Today&apos;s Tip</h2>
        </div>
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ background: "var(--accent-light)", boxShadow: "0 2px 8px -2px var(--accent-glow)" }}
        >
          {icon}
        </div>
      </div>

      {/* Date chip */}
      <div className="mb-3">
        <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-[11px] font-semibold text-[var(--primary)]">
          {today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </span>
      </div>

      {/* Tip content */}
      <div className="flex-1 rounded-xl bg-[var(--accent-light)] px-4 py-3.5" style={{ border: "1px solid rgba(15,118,110,0.12)" }}>
        <p className="text-[15px] font-medium leading-relaxed text-[var(--text)]">{tip}</p>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
        <span className="text-base">🌱</span>
        <p className="text-[11px] font-medium text-[var(--text-muted)]">
          Small habits compound into massive results. Keep showing up.
        </p>
      </div>
    </div>
  );
}

export default React.memo(WellnessTip);
