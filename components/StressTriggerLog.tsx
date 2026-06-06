"use client";

import { useState, useEffect } from "react";
import { STRESS_TAGS } from "@/types/wellness";
import { saveTriggerEntry, getTriggerHistory } from "@/lib/storage";
import type { TriggerEntry } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

export default function StressTriggerLog() {
  const [selected, setSelected] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [recent, setRecent] = useState<TriggerEntry[]>([]);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setRecent(getTriggerHistory().slice(-3).reverse());
  }, []);

  function toggleTag(tag: string) {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSubmit() {
    if (!selected.length) return;
    const entry: TriggerEntry = {
      date: new Date().toISOString(),
      tags: selected,
      description: description.trim() || undefined,
    };
    saveTriggerEntry(entry);
    setSelected([]);
    setDescription("");
    setRecent(getTriggerHistory().slice(-3).reverse());
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  return (
    <div className="card fade-in relative">
      {toast && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-[var(--success)] px-4 py-2 text-sm font-semibold text-white shadow-lg animate-fade-in">
          ✓ Triggers saved!
        </div>
      )}

      <p className="section-label mb-0.5">Stress Log</p>
      <h2 className="font-heading mb-1 text-xl font-bold text-[var(--text)]">What&apos;s causing stress?</h2>
      <p className="mb-4 text-sm text-[var(--text-muted)]">Tag what&apos;s weighing on you today</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {STRESS_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            aria-pressed={selected.includes(tag)}
            className="rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-150"
            style={
              selected.includes(tag)
                ? {
                    background: "var(--primary)",
                    color: "white",
                    boxShadow: "0 2px 8px -2px rgba(79,70,229,0.4)",
                    transform: "scale(1.04)",
                  }
                : { background: "#F3F4F6", color: "var(--text-muted)" }
            }
          >
            {tag}
          </button>
        ))}
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value.slice(0, 200))}
        placeholder="Describe what happened (optional)…"
        rows={2}
        className="input mb-3 resize-none"
      />

      <button
        onClick={handleSubmit}
        disabled={!selected.length}
        className="btn-primary mb-5 w-full"
      >
        Log Triggers
      </button>

      {recent.length > 0 && (
        <div>
          <p className="section-label mb-2">Recent Logs</p>
          <div className="space-y-2">
            {recent.map((entry, i) => (
              <div key={i} className="rounded-xl bg-gray-50 p-3" style={{ border: "1px solid #F3F4F6" }}>
                <p className="mb-1.5 text-xs text-[var(--text-soft)]">{formatDate(entry.date)}</p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((t) => (
                    <span key={t} className="tag-primary">
                      {t}
                    </span>
                  ))}
                </div>
                {entry.description && (
                  <p className="mt-1.5 text-xs text-[var(--text-muted)]">{entry.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
