"use client";

import { useState, useEffect, useRef } from "react";

type Phase = "idle" | "inhale" | "hold" | "exhale";

const PHASES: { phase: Phase; duration: number; label: string; color: string; hint: string }[] = [
  { phase: "inhale", duration: 4, label: "Inhale",  color: "#4F46E5", hint: "Breathe in slowly through your nose…" },
  { phase: "hold",   duration: 7, label: "Hold",    color: "#7C3AED", hint: "Hold your breath gently…" },
  { phase: "exhale", duration: 8, label: "Exhale",  color: "#0F766E", hint: "Breathe out slowly through your mouth…" },
];

export default function BreathingExercise() {
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef(0);
  const countRef = useRef(PHASES[0].duration);

  function clearTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  useEffect(() => {
    if (!active) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      countRef.current -= 1;
      setCountdown(countRef.current);
      if (countRef.current <= 0) {
        const next = (phaseRef.current + 1) % PHASES.length;
        if (next === 0) setCycles((c) => c + 1);
        phaseRef.current = next;
        countRef.current = PHASES[next].duration;
        setPhaseIdx(next);
        setCountdown(countRef.current);
      }
    }, 1000);
    return clearTimer;
  }, [active]);

  function toggle() {
    if (active) {
      setActive(false);
      clearTimer();
      setPhaseIdx(0);
      setCountdown(PHASES[0].duration);
      phaseRef.current = 0;
      countRef.current = PHASES[0].duration;
    } else {
      setPhaseIdx(0);
      setCountdown(PHASES[0].duration);
      phaseRef.current = 0;
      countRef.current = PHASES[0].duration;
      setActive(true);
    }
  }

  const current = PHASES[phaseIdx];
  const totalDuration = PHASES[phaseIdx].duration;
  const progress = ((totalDuration - countdown) / totalDuration) * 100;
  const isExpanding = active && current.phase === "inhale";

  return (
    <div className="card fade-in flex flex-col items-center">
      <div className="mb-1 w-full">
        <p className="section-label mb-0.5">Breathe</p>
        <h2 className="font-heading text-xl font-bold text-[var(--text)]">4-7-8 Technique</h2>
        <p className="text-sm text-[var(--text-muted)]">Calm your mind in 2 minutes</p>
      </div>

      {/* Animated circle */}
      <div className="relative my-8 flex h-44 w-44 items-center justify-center">
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-1000 ease-in-out"
          style={{
            background: active ? `radial-gradient(circle, ${current.color}22 0%, transparent 70%)` : "transparent",
            transform: isExpanding ? "scale(1.35)" : "scale(1)",
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-4 rounded-full opacity-30 transition-all duration-1000 ease-in-out"
          style={{
            background: active ? current.color : "#E5E7EB",
            transform: isExpanding ? "scale(1.2)" : "scale(1)",
          }}
        />
        {/* SVG progress ring */}
        {active && (
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 176 176">
            <circle cx="88" cy="88" r="80" fill="none" stroke="#E5E7EB" strokeWidth="4" />
            <circle
              cx="88" cy="88" r="80" fill="none"
              stroke={current.color} strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 80}`}
              strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
        )}
        {/* Inner circle */}
        <div
          className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full shadow-lg transition-all duration-1000"
          style={{
            background: active
              ? `linear-gradient(135deg, ${current.color} 0%, ${current.color}CC 100%)`
              : "linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)",
            transform: isExpanding ? "scale(1.1)" : "scale(1)",
            boxShadow: active ? `0 8px 32px -8px ${current.color}88` : "none",
          }}
        >
          {active ? (
            <>
              <span className="text-xs font-bold text-white/70">{current.label}</span>
              <span className="font-display text-4xl font-black text-white">{countdown}</span>
            </>
          ) : (
            <span className="text-4xl">🧘</span>
          )}
        </div>
      </div>

      {/* Phase hint */}
      {active && (
        <p className="mb-4 text-center text-sm font-medium text-[var(--text-muted)]">
          {current.hint}
        </p>
      )}

      {/* Phase indicators */}
      <div className="mb-5 flex gap-3">
        {PHASES.map((p, i) => (
          <div key={p.phase} className="flex flex-col items-center gap-1">
            <div
              className="h-1.5 w-10 rounded-full transition-all duration-300"
              style={{ background: active && i === phaseIdx ? current.color : "#E5E7EB" }}
            />
            <span className="text-[10px] text-[var(--text-muted)]">{p.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={toggle}
        className="mb-4 rounded-xl px-10 py-2.5 text-sm font-bold text-white shadow-sm transition-all"
        style={
          active
            ? { background: "#6B7280" }
            : { background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)", boxShadow: "0 4px 16px -4px rgba(79,70,229,0.4)" }
        }
      >
        {active ? "Stop" : "Start Breathing"}
      </button>

      {cycles > 0 && (
        <div className="mb-3 rounded-xl bg-[var(--success-light)] px-4 py-2 text-sm font-semibold text-[var(--success)]">
          🌟 {cycles} {cycles === 1 ? "cycle" : "cycles"} completed — well done!
        </div>
      )}

      {!active && (
        <div className="mt-1 rounded-xl bg-gray-50 p-4 text-xs text-[var(--text-muted)]">
          <p className="mb-1 font-semibold text-[var(--text)]">How the 4-7-8 technique works</p>
          <div className="flex gap-4">
            {PHASES.map((p) => (
              <div key={p.phase} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                <span><b>{p.label}</b> {p.duration}s</span>
              </div>
            ))}
          </div>
          <p className="mt-1.5">Activates your parasympathetic nervous system to reduce anxiety.</p>
        </div>
      )}
    </div>
  );
}
