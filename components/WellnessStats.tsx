"use client";

import { useEffect, useState } from "react";
import { getMoodHistory, getTriggerHistory } from "@/lib/storage";
import { getMoodColor } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
  bg: string;
}

export default function WellnessStats() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const moods = getMoodHistory();
    const triggers = getTriggerHistory();

    const last7 = moods.slice(-7);
    const avg = last7.length
      ? Math.round((last7.reduce((s, m) => s + m.score, 0) / last7.length) * 10) / 10
      : null;

    const streak = (() => {
      let s = 0;
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split("T")[0];
        const found = moods.some((m) => m.date.startsWith(ds));
        if (found) s++;
        else break;
      }
      return s;
    })();

    const topTrigger = (() => {
      const freq: Record<string, number> = {};
      triggers.forEach((t) => t.tags.forEach((tag) => { freq[tag] = (freq[tag] ?? 0) + 1; }));
      return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    })();

    const avgColor = avg ? getMoodColor(Math.round(avg)) : "#6B7280";

    setStats([
      {
        label: "7-day avg mood",
        value: avg !== null ? `${avg}/10` : "—",
        sub: avg !== null ? (avg >= 7 ? "Doing great!" : avg >= 5 ? "Holding steady" : "Needs attention") : "No data yet",
        icon: "📈",
        color: avgColor,
        bg: avg !== null ? (avg >= 7 ? "#ECFDF5" : avg >= 5 ? "#FFFBEB" : "#FEF2F2") : "#F9FAFB",
      },
      {
        label: "Logging streak",
        value: `${streak} ${streak === 1 ? "day" : "days"}`,
        sub: streak >= 3 ? "Keep the habit!" : streak > 0 ? "Good start!" : "Log today!",
        icon: "🔥",
        color: streak >= 3 ? "#D97706" : "#6B7280",
        bg: streak >= 3 ? "#FFFBEB" : "#F9FAFB",
      },
      {
        label: "Top stress trigger",
        value: topTrigger,
        sub: triggers.length ? `${triggers.length} logs total` : "None logged yet",
        icon: "⚡",
        color: "#7C3AED",
        bg: "#F5F3FF",
      },
      {
        label: "Entries logged",
        value: `${moods.length}`,
        sub: moods.length >= 7 ? "Building awareness!" : "Keep going!",
        icon: "📓",
        color: "#0F766E",
        bg: "#F0FDFA",
      },
    ]);
  }, []);

  if (!stats.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="fade-in flex flex-col gap-1 rounded-2xl border px-4 py-3.5 transition hover:shadow-md"
          style={{ background: s.bg, borderColor: `${s.color}20` }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl">{s.icon}</span>
            <span className="section-label">{s.label}</span>
          </div>
          <p className="font-heading text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
          <p className="text-[11px] text-[var(--text-muted)]">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
