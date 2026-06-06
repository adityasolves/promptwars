"use client";

import React, { useState, useEffect } from "react";
import { EXAM_TYPES } from "@/types/wellness";
import { saveExamConfig, getExamConfig } from "@/lib/storage";
import { getDaysUntilExam, getMotivationalMessage } from "@/lib/utils";

function ExamCountdown() {
  const [exam, setExam] = useState("NEET");
  const [date, setDate] = useState("");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const cfg = getExamConfig();
    if (cfg) {
      setExam(cfg.exam);
      setDate(cfg.date);
      setDaysLeft(getDaysUntilExam(cfg.date));
      setSaved(true);
    } else {
      setEditing(true);
    }
  }, []);

  function handleSave() {
    if (!date) return;
    saveExamConfig(exam, date);
    setDaysLeft(getDaysUntilExam(date));
    setSaved(true);
    setEditing(false);
  }

  function urgencyStyle() {
    if (daysLeft === null) return { color: "var(--primary)", bg: "var(--primary-light)" };
    if (daysLeft > 30) return { color: "var(--success)", bg: "var(--success-light)" };
    if (daysLeft > 7)  return { color: "var(--warning)", bg: "var(--warning-light)" };
    return { color: "var(--danger)", bg: "#FEF2F2" };
  }

  const style = urgencyStyle();

  if (editing) {
    return (
      <div className="card fade-in">
        <p className="section-label mb-1">Exam Countdown</p>
        <h2 className="font-heading mb-4 text-xl font-bold text-[var(--text)]">Set your exam date</h2>
        <div className="flex flex-wrap gap-3">
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            className="input w-auto"
          >
            {EXAM_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="input w-auto"
          />
          <button onClick={handleSave} disabled={!date} className="btn-primary">
            {saved ? "Update" : "Set Exam"}
          </button>
          {saved && (
            <button onClick={() => setEditing(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-500 transition hover:bg-gray-50">
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fade-in relative overflow-hidden rounded-2xl border px-6 py-5"
      style={{ background: style.bg, borderColor: `${style.color}25` }}
    >
      {/* Decorative large number watermark */}
      <div
        className="pointer-events-none absolute -right-4 -top-4 font-heading text-[10rem] font-black leading-none select-none opacity-[0.04]"
        style={{ color: style.color }}
      >
        {daysLeft !== null && daysLeft >= 0 ? daysLeft : "✓"}
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="section-label mb-1" style={{ color: style.color }}>
            {exam} Countdown
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-6xl font-black sm:text-7xl" style={{ color: style.color }}>
              {daysLeft === null ? "—" : daysLeft < 0 ? "Done!" : daysLeft}
            </span>
            {daysLeft !== null && daysLeft >= 0 && (
              <span className="text-xl font-bold" style={{ color: style.color + "88" }}>days to go</span>
            )}
          </div>
          <p className="mt-2 max-w-sm text-sm font-medium" style={{ color: style.color + "BB" }}>
            {daysLeft !== null ? getMotivationalMessage(daysLeft) : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {daysLeft !== null && daysLeft >= 0 && (
            <div className="flex flex-col items-center rounded-2xl bg-white/60 px-4 py-3 backdrop-blur-sm" style={{ border: `1px solid ${style.color}20` }}>
              <span className="font-heading text-2xl font-black" style={{ color: style.color }}>
                {Math.ceil((daysLeft ?? 0) / 7)}
              </span>
              <span className="text-[10px] font-semibold" style={{ color: style.color + "99" }}>weeks left</span>
            </div>
          )}
          <button
            onClick={() => setEditing(true)}
            className="rounded-full px-3 py-1.5 text-xs font-semibold transition"
            style={{ background: `${style.color}15`, color: style.color }}
          >
            ✏️ Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ExamCountdown);
