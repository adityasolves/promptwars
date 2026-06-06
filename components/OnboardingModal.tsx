"use client";

import { useState, useEffect, useCallback } from "react";

const STEPS = [
  {
    icon: "👋",
    title: "Welcome to MindEase",
    desc: "Your personal wellness companion built for Indian exam students. Track your mood, manage stress, and get AI support — all in one place.",
  },
  {
    icon: "📊",
    title: "Track Your Mood Daily",
    desc: "Log how you feel each day with a simple emoji scale. Over time, you'll spot patterns and understand your emotional rhythm during exam prep.",
  },
  {
    icon: "💬",
    title: "Chat When Stressed",
    desc: "Whenever exam pressure feels overwhelming, open the Reflection Chat. Your AI companion listens without judgment and offers practical support.",
  },
];

const ONBOARDING_KEY = "onboardingComplete";

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARDING_KEY)) setVisible(true);
    } catch {
      // ignore
    }
  }, []);

  const handleDone = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch {
      // ignore
    }
    setVisible(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") handleDone();
    },
    [handleDone]
  );

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
      >
        {/* Step indicators */}
        <div className="mb-6 flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? "2rem" : "0.5rem",
                background: i === step ? "var(--primary)" : "#E5E7EB",
              }}
            />
          ))}
        </div>

        <div className="mb-6 text-center">
          <div className="mb-4 text-6xl">{current.icon}</div>
          <h2 id="onboarding-title" className="font-heading mb-3 text-2xl font-bold text-[var(--text)]">
            {current.title}
          </h2>
          <p className="leading-relaxed text-[var(--text-muted)]">{current.desc}</p>
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Back
            </button>
          )}
          {!isLast ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="btn-primary flex-1"
              autoFocus
            >
              Next →
            </button>
          ) : (
            <button onClick={handleDone} className="btn-primary flex-1" autoFocus>
              Get Started 🚀
            </button>
          )}
        </div>

        <button
          onClick={handleDone}
          className="mt-4 w-full text-center text-xs text-[var(--text-soft)] hover:text-[var(--text-muted)] transition"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
}
