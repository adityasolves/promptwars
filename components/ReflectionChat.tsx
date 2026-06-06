"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { EXAM_TYPES, STRESS_TAGS } from "@/types/wellness";
import { getMoodHistory, getRecentMoodHistory } from "@/lib/storage";
import CrisisAlert from "./CrisisAlert";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ReflectionChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [examType, setExamType] = useState("NEET");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [lastSent, setLastSent] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const recentMood = useRef(5);
  useEffect(() => {
    const history = getMoodHistory();
    if (history.length) recentMood.current = history[history.length - 1].score;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async () => {
    const now = Date.now();
    if (!input.trim() || loading || now - lastSent < 1000) return;
    setLastSent(now);

    const userMsg = input.trim().slice(0, 500);
    setInput("");
    setMessages((prev) => [...prev.slice(-9), { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          examType,
          recentMood: recentMood.current,
          stressTags: selectedTags,
          conversationHistory: messages.slice(-10),
        }),
      });

      const data = await res.json() as { reply?: string; crisisDetected?: boolean; error?: string };
      if (data.crisisDetected) setCrisisDetected(true);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "I'm here for you. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, lastSent, examType, selectedTags, messages]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  const [latestMood, setLatestMood] = useState(5);
  useEffect(() => {
    const h = getRecentMoodHistory(1);
    if (h.length) setLatestMood(h[h.length - 1].score);
  }, []);

  return (
    <div className="card fade-in flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-[var(--text)]">Reflection Chat</h2>
          <p className="text-sm text-[var(--text-muted)]">Talk to your MindEase companion</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
            Preparing for {examType}
          </span>
          <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
            Mood: {latestMood}/10
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-[var(--text-muted)] self-center">Exam:</span>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-[var(--text)] focus:outline-none"
        >
          {EXAM_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <span className="text-xs text-[var(--text-muted)] self-center ml-2">Tags:</span>
        {STRESS_TAGS.slice(0, 6).map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTags((p) => p.includes(tag) ? p.filter((x) => x !== tag) : [...p, tag])}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              selectedTags.includes(tag)
                ? "bg-[var(--primary)] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {crisisDetected && (
        <CrisisAlert onDismiss={() => setCrisisDetected(false)} />
      )}

      <div className="flex min-h-[280px] flex-col gap-3 overflow-y-auto rounded-xl bg-gray-50 p-4">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <span className="mb-2 text-4xl">💬</span>
            <p className="text-sm text-[var(--text-muted)]">
              Share what&apos;s on your mind — I&apos;m here to listen.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-[var(--primary)] text-white"
                  : "rounded-bl-md border-l-4 border-[var(--accent)] bg-white text-[var(--text)] shadow-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border-l-4 border-[var(--accent)] bg-white px-4 py-3 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your message... (Enter to send)"
          rows={2}
          className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-gray-400 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]"
        />
        <div className="flex flex-col gap-2">
          <button
            onClick={() => void sendMessage()}
            disabled={!input.trim() || loading}
            className="flex-1 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
          <button
            onClick={() => { setMessages([]); setCrisisDetected(false); }}
            className="flex-1 rounded-xl border border-gray-200 px-3 text-xs text-gray-500 transition hover:bg-gray-100"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
