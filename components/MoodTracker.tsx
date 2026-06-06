"use client";

import React, { useState } from "react";
import { MOOD_EMOJIS, EXAM_TYPES, MAX_MOOD_NOTE_LENGTH } from "@/types/wellness";
import { saveMoodEntry } from "@/lib/storage";
import { getMoodColor } from "@/lib/utils";

function MoodTracker({ onSaved }: { onSaved?: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [examType, setExamType] = useState("NEET");
  const [toast, setToast] = useState(false);

  const selectedEmoji = selected ? MOOD_EMOJIS.find((m) => m.score === selected) : null;
  const moodColor = selected ? getMoodColor(selected) : "var(--primary)";

  function handleSubmit() {
    if (!selected || !selectedEmoji) return;
    saveMoodEntry({
      date: new Date().toISOString(),
      score: selected,
      emoji: selectedEmoji.emoji,
      note: note.trim() || undefined,
      examType,
    });
    setSelected(null);
    setNote("");
    setToast(true);
    setTimeout(() => setToast(false), 3000);
    onSaved?.();
  }

  return (
    <div className="card fade-in relative">
      {/* Toast */}
      {toast && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-[var(--success)] px-4 py-2 text-sm font-semibold text-white shadow-lg animate-fade-in">
          <span>✓</span> Mood logged!
        </div>
      )}

      <p className="section-label mb-0.5">Mood Check-in</p>
      <h2 className="font-heading mb-1 text-xl font-bold text-[var(--text)]">How are you feeling?</h2>
      <p className="mb-4 text-sm text-[var(--text-muted)]">Tap an emoji to log your current mood</p>

      {/* Emoji grid */}
      <div className="mb-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
        {MOOD_EMOJIS.map(({ score, emoji, label }) => (
          <button
            key={score}
            onClick={() => setSelected(score)}
            aria-label={`Select mood: ${label}, score ${score} out of 10`}
            aria-pressed={selected === score}
            className="group flex flex-col items-center rounded-xl border-2 p-2 transition-all duration-200"
            style={
              selected === score
                ? {
                    borderColor: getMoodColor(score),
                    background: getMoodColor(score) + "18",
                    transform: "scale(1.08)",
                    boxShadow: `0 4px 12px -4px ${getMoodColor(score)}55`,
                  }
                : { borderColor: "transparent", background: "#F9FAFB" }
            }
          >
            <span className="text-2xl transition-transform group-hover:scale-110">{emoji}</span>
            <span className="mt-0.5 text-[9px] font-semibold text-[var(--text-muted)]">{score}</span>
          </button>
        ))}
      </div>

      {/* Selected mood label */}
      {selectedEmoji && (
        <div
          className="mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold fade-in"
          style={{ background: moodColor + "15", color: moodColor, border: `1px solid ${moodColor}30` }}
        >
          <span className="text-xl">{selectedEmoji.emoji}</span>
          {selectedEmoji.label} · {selectedEmoji.score}/10
        </div>
      )}

      {/* Exam selector */}
      <div className="mb-3">
        <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">Preparing for</label>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="input"
        >
          {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Note */}
      <div className="mb-4">
        <label className="mb-1 flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
          <span>Add a note <span className="font-normal text-[var(--text-soft)]">(optional)</span></span>
          <span className="font-normal text-[var(--text-soft)]">{note.length}/{MAX_MOOD_NOTE_LENGTH}</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, MAX_MOOD_NOTE_LENGTH))}
          placeholder="What's on your mind today?"
          rows={2}
          className="input resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selected}
        className="btn-primary w-full"
      >
        Log Mood
      </button>
    </div>
  );
}

export default React.memo(MoodTracker);
