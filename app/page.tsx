"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ExamCountdown from "@/components/ExamCountdown";
import MoodTracker from "@/components/MoodTracker";
import WellnessTip from "@/components/WellnessTip";
import StressTriggerLog from "@/components/StressTriggerLog";
import BreathingExercise from "@/components/BreathingExercise";
import ReflectionChat from "@/components/ReflectionChat";
import MotivationBanner from "@/components/MotivationBanner";
import DailyAffirmation from "@/components/DailyAffirmation";
import StudyTechniqueCard from "@/components/StudyTechniqueCard";
import { clearAllData } from "@/lib/storage";

const MoodChart   = dynamic(() => import("@/components/MoodChart"),    { ssr: false });
const WellnessStats = dynamic(() => import("@/components/WellnessStats"), { ssr: false });

const NAV_TABS = [
  { id: "dashboard", label: "Home",    icon: "🏠" },
  { id: "mood",      label: "Mood",    icon: "😊" },
  { id: "chat",      label: "Chat",    icon: "💬" },
  { id: "breathe",   label: "Breathe", icon: "🧘" },
];

export default function Home() {
  const [moodKey, setMoodKey] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showClear, setShowClear] = useState(false);

  function handleClearData() {
    clearAllData();
    setMoodKey((k) => k + 1);
    setShowClear(false);
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12" style={{ background: "linear-gradient(160deg, #F0EEFF 0%, #E8F4F2 60%, #FFF7ED 100%)" }}>

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xl" style={{ background: "var(--gradient-hero)" }}>
              🧠
            </div>
            <div>
              <span className="font-heading text-lg font-extrabold text-[var(--text)]">MindEase</span>
              <span className="ml-2 hidden text-xs text-[var(--text-muted)] sm:inline">Student Wellness Companion</span>
            </div>
          </div>

          {/* Desktop nav pills */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="rounded-xl px-3 py-1.5 text-sm font-semibold transition-all"
                style={
                  activeTab === tab.id
                    ? { background: "var(--primary-light)", color: "var(--primary)" }
                    : { color: "var(--text-muted)" }
                }
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setShowClear(true)}
            className="rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-100"
          >
            Clear Data
          </button>
        </div>
      </header>

      {/* ── Confirm clear modal ── */}
      {showClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-heading mb-2 text-lg font-bold text-[var(--text)]">Clear all data?</h3>
            <p className="mb-5 text-sm text-[var(--text-muted)]">
              This deletes your mood history, trigger logs, and exam config permanently.
            </p>
            <div className="flex gap-3">
              <button onClick={handleClearData} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600">
                Yes, clear
              </button>
              <button onClick={() => setShowClear(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-6">

        {/* ── Dashboard tab ── */}
        {(activeTab === "dashboard") && (
          <div className="flex flex-col gap-5">
            <MotivationBanner />
            <WellnessStats />
            <div className="grid gap-5 md:grid-cols-2">
              <ExamCountdown />
              <DailyAffirmation />
            </div>
            <MoodChart refreshKey={moodKey} />
            <StudyTechniqueCard />
            <WellnessTip />
          </div>
        )}

        {/* ── Mood tab ── */}
        {activeTab === "mood" && (
          <div className="flex flex-col gap-5">
            <MoodTracker onSaved={() => setMoodKey((k) => k + 1)} />
            <StressTriggerLog />
            <MoodChart refreshKey={moodKey} />
          </div>
        )}

        {/* ── Chat tab ── */}
        {activeTab === "chat" && <ReflectionChat />}

        {/* ── Breathe tab ── */}
        {activeTab === "breathe" && (
          <div className="flex flex-col gap-5">
            <BreathingExercise />
            <StudyTechniqueCard />
          </div>
        )}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-white/60 bg-white/80 backdrop-blur-xl md:hidden">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-semibold transition-all"
            style={{ color: activeTab === tab.id ? "var(--primary)" : "var(--text-muted)" }}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="mt-0.5 h-0.5 w-5 rounded-full" style={{ background: "var(--primary)" }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
