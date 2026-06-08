"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ExamCountdown from "@/components/ExamCountdown";
import MoodTracker from "@/components/MoodTracker";
import WellnessTip from "@/components/WellnessTip";
import StressTriggerLog from "@/components/StressTriggerLog";
import MotivationBanner from "@/components/MotivationBanner";
import DailyAffirmation from "@/components/DailyAffirmation";
import StudyTechniqueCard from "@/components/StudyTechniqueCard";
import OnboardingModal from "@/components/OnboardingModal";
import ErrorBoundary from "@/components/ErrorBoundary";
import { clearAllData, getMoodStreak } from "@/lib/storage";

const MoodChartDynamic = dynamic(
  () => import("@/components/MoodChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 animate-pulse rounded-2xl bg-indigo-50 flex items-center justify-center text-sm text-indigo-300">
        Loading chart…
      </div>
    ),
  }
);
const WellnessStats = dynamic(() => import("@/components/WellnessStats"), { ssr: false });
const ReflectionChatDynamic = dynamic(() => import("@/components/ReflectionChat"), { ssr: false });
const BreathingExerciseDynamic = dynamic(() => import("@/components/BreathingExercise"), { ssr: false });
const WeeklyReport = dynamic(() => import("@/components/WeeklyReport"), { ssr: false });

const NAV_TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "mood",      label: "Mood" },
  { id: "breathe",   label: "Breathe" },
];

export default function Home() {
  const [moodKey, setMoodKey] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showClear, setShowClear] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getMoodStreak());
  }, [moodKey]);

  function handleClearData() {
    clearAllData();
    setMoodKey((k) => k + 1);
    setShowClear(false);
  }

  return (
    <div
      className="min-h-screen pb-24 md:pb-10"
      style={{ background: "linear-gradient(160deg, #F7F7FB 0%, #EEF2FF 60%, #F0FDFA 100%)" }}
    >
      <OnboardingModal />

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "var(--gradient-hero)" }}
            >
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[var(--text)]">MindEase</span>
              <span className="ml-2 hidden text-xs text-[var(--text-soft)] sm:inline">Student Wellness</span>
            </div>
          </div>

          {/* Center: streak + nav (desktop) */}
          <div className="hidden items-center gap-4 md:flex">
            {streak > 0 && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 border border-amber-100">
                {streak} day streak
              </span>
            )}
            <nav className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
              {NAV_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all"
                  style={
                    activeTab === tab.id
                      ? { background: "white", color: "var(--primary)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }
                      : { color: "var(--text-muted)" }
                  }
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right */}
          <button
            onClick={() => setShowClear(true)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-500 transition hover:border-red-200 hover:text-red-500"
          >
            Clear Data
          </button>
        </div>
      </header>

      {/* ── Confirm clear modal ── */}
      {showClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-base font-semibold text-[var(--text)]">Clear all data?</h3>
            <p className="mb-5 text-sm text-[var(--text-muted)]">
              This permanently deletes your mood history, trigger logs, and exam config.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearData}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Yes, clear
              </button>
              <button
                onClick={() => setShowClear(false)}
                className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Chat modal (floating) ── */}
      {showChat && (
        <div className="fixed inset-0 z-40 flex items-end justify-end p-4 sm:items-center sm:justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowChat(false)}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div>
                <p className="font-semibold text-[var(--text)]">Reflection Chat</p>
                <p className="text-xs text-[var(--text-muted)]">Talk to your AI wellness companion</p>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100"
                aria-label="Close chat"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <ErrorBoundary>
                <ReflectionChatDynamic />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      )}

      <main id="main-content" className="mx-auto max-w-5xl px-4 py-6">

        {/* ── Dashboard ── */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-5">
            <ErrorBoundary><MotivationBanner /></ErrorBoundary>
            <ErrorBoundary><WellnessStats /></ErrorBoundary>

            <div className="grid gap-5 md:grid-cols-2">
              <ErrorBoundary><ExamCountdown /></ErrorBoundary>
              <ErrorBoundary><DailyAffirmation /></ErrorBoundary>
            </div>

            <ErrorBoundary><MoodChartDynamic refreshKey={moodKey} /></ErrorBoundary>

            <div className="flex justify-end">
              <ErrorBoundary><WeeklyReport /></ErrorBoundary>
            </div>

            <ErrorBoundary><StudyTechniqueCard /></ErrorBoundary>
            <ErrorBoundary><WellnessTip /></ErrorBoundary>
          </div>
        )}

        {/* ── Mood ── */}
        {activeTab === "mood" && (
          <div className="flex flex-col gap-5">
            <ErrorBoundary><MoodTracker onSaved={() => setMoodKey((k) => k + 1)} /></ErrorBoundary>
            <ErrorBoundary><StressTriggerLog /></ErrorBoundary>
            <ErrorBoundary><MoodChartDynamic refreshKey={moodKey} /></ErrorBoundary>
          </div>
        )}

        {/* ── Breathe ── */}
        {activeTab === "breathe" && (
          <div className="flex flex-col gap-5">
            <ErrorBoundary><BreathingExerciseDynamic /></ErrorBoundary>
            <ErrorBoundary><StudyTechniqueCard /></ErrorBoundary>
          </div>
        )}
      </main>

      {/* ── Floating chat button ── */}
      <button
        onClick={() => setShowChat(true)}
        aria-label="Open reflection chat"
        className="fixed bottom-24 left-4 z-30 flex h-13 w-13 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 md:bottom-8 md:left-6"
        style={{
          background: "var(--gradient-hero)",
          width: "52px",
          height: "52px",
          boxShadow: "0 4px 20px -4px rgba(79,70,229,0.5)",
        }}
      >
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-zinc-100 bg-white/90 backdrop-blur-xl md:hidden">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-all"
            style={{ color: activeTab === tab.id ? "var(--primary)" : "var(--text-muted)" }}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="mt-0.5 h-0.5 w-5 rounded-full" style={{ background: "var(--primary)" }} />
            )}
          </button>
        ))}
        {/* Chat tab in mobile nav */}
        <button
          onClick={() => setShowChat(true)}
          className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-all"
          style={{ color: "var(--text-muted)" }}
        >
          <span>Chat</span>
        </button>
      </nav>
    </div>
  );
}
