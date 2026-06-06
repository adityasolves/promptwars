"use client";

import { useState } from "react";

const TECHNIQUES = [
  {
    name: "Pomodoro",
    icon: "🍅",
    duration: "25 min work · 5 min break",
    desc: "Work in focused 25-minute sprints followed by a short break. After 4 cycles, take a 20-minute rest.",
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FCA5A5",
    steps: ["Set a 25-min timer", "Work with zero distractions", "Take a 5-min break", "Repeat 4×, then rest"],
  },
  {
    name: "Feynman",
    icon: "🧪",
    duration: "Teach to learn",
    desc: "Explain a concept in simple words as if teaching a 12-year-old. Gaps in your explanation reveal gaps in understanding.",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#C4B5FD",
    steps: ["Choose a concept", "Explain it simply", "Spot the gaps", "Revisit & simplify"],
  },
  {
    name: "Spaced Repetition",
    icon: "🔁",
    duration: "Review at intervals",
    desc: "Review material at increasing intervals: 1 day, 3 days, 7 days, 21 days. This locks concepts into long-term memory.",
    color: "#0F766E",
    bg: "#F0FDFA",
    border: "#5EEAD4",
    steps: ["Study new material", "Review after 1 day", "Review after 3 days", "Review after 1 week"],
  },
  {
    name: "Active Recall",
    icon: "🧠",
    duration: "Test yourself",
    desc: "Close the book and try to recall everything you just studied. Harder than re-reading, but 3× more effective.",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FCD34D",
    steps: ["Study a section", "Close notes", "Write all you recall", "Check & fill gaps"],
  },
];

export default function StudyTechniqueCard() {
  const [active, setActive] = useState(0);
  const t = TECHNIQUES[active];

  return (
    <div className="card-gradient fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="section-label mb-0.5">Study Techniques</p>
          <h2 className="font-heading text-lg font-bold text-[var(--text)]">Proven Methods That Work</h2>
        </div>
        <span className="text-2xl">{t.icon}</span>
      </div>

      {/* Tab pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TECHNIQUES.map((tech, i) => (
          <button
            key={tech.name}
            onClick={() => setActive(i)}
            className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
            style={
              active === i
                ? { background: tech.color, color: "white", boxShadow: `0 2px 8px -2px ${tech.color}66` }
                : { background: "#F3F4F6", color: "var(--text-muted)" }
            }
          >
            {tech.icon} {tech.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="slide-in rounded-xl border p-4"
        style={{ background: t.bg, borderColor: t.border + "66" }}
        key={active}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl">{t.icon}</span>
          <div>
            <p className="font-heading font-bold" style={{ color: t.color }}>{t.name} Technique</p>
            <p className="text-[11px] font-semibold" style={{ color: t.color + "99" }}>{t.duration}</p>
          </div>
        </div>
        <p className="mb-3 text-sm leading-relaxed text-[var(--text-muted)]">{t.desc}</p>
        <div className="flex flex-wrap gap-2">
          {t.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded-lg bg-white/70 px-2.5 py-1.5 text-xs font-medium text-[var(--text)]">
              <span
                className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: t.color }}
              >
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
