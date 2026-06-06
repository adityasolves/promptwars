"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { getRecentMoodHistory } from "@/lib/storage";
import { getMoodColor, formatDate } from "@/lib/utils";
import { MOOD_EMOJIS } from "@/types/wellness";

interface ChartPoint {
  date: string;
  score: number;
  emoji: string;
  label: string;
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: ChartPoint;
}

function CustomDot({ cx, cy, payload }: CustomDotProps) {
  if (!cx || !cy || !payload) return null;
  return (
    <text x={cx} y={cy - 8} textAnchor="middle" fontSize={16}>
      {payload.emoji}
    </text>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
      <p className="text-xs text-gray-500">{d.date}</p>
      <p className="mt-1 font-semibold text-[var(--text)]">
        {d.emoji} {d.score}/10 — {d.label}
      </p>
    </div>
  );
}

export default function MoodChart({ refreshKey }: { refreshKey?: number }) {
  const data = useMemo(() => {
    const history = getRecentMoodHistory(7);
    return history.map((e) => {
      const emojiEntry = MOOD_EMOJIS.find((m) => m.score === e.score);
      return {
        date: formatDate(e.date),
        score: e.score,
        emoji: e.emoji ?? emojiEntry?.emoji ?? "😐",
        label: emojiEntry?.label ?? "",
      } as ChartPoint;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const avgScore = data.length ? data.reduce((s, d) => s + d.score, 0) / data.length : 5;
  const strokeColor = getMoodColor(Math.round(avgScore));

  if (!data.length) {
    return (
      <div className="card fade-in flex flex-col items-center justify-center py-12 text-center">
        <span className="mb-3 text-5xl">📊</span>
        <p className="font-heading text-lg font-semibold text-[var(--text)]">No mood data yet</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Log your first mood above to see your chart here</p>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <h2 className="mb-1 font-heading text-xl font-bold text-[var(--text)]">Mood Trend</h2>
      <p className="mb-4 text-sm text-[var(--text-muted)]">Last 7 days</p>
      <div role="img" aria-label="Line chart showing mood scores for the last 7 days">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 24, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} />
          <YAxis domain={[1, 10]} ticks={[1, 3, 5, 7, 10]} tick={{ fontSize: 11, fill: "#6B7280" }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke={strokeColor}
            strokeWidth={2.5}
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: strokeColor }}
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
