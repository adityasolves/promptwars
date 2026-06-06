"use client";

import React, { useState } from "react";
import { CRISIS_RESOURCES } from "@/types/wellness";

interface CrisisAlertProps {
  onDismiss?: () => void;
}

function CrisisAlert({ onDismiss }: CrisisAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="mb-1 text-lg font-bold text-amber-800">
            🧡 You are not alone. Please reach out.
          </p>
          <p className="mb-3 text-sm text-amber-700">
            Talking to someone can help. These helplines are free and confidential.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {CRISIS_RESOURCES.map((r) => (
              <a
                key={r.name}
                href={`tel:${r.number.replace(/-/g, "")}`}
                className="flex flex-col rounded-xl border border-amber-200 bg-white px-4 py-3 shadow-sm transition hover:bg-amber-50"
              >
                <span className="font-semibold text-amber-900">{r.name}</span>
                <span className="text-sm font-bold text-amber-700">{r.number}</span>
                <span className="text-xs text-amber-600">{r.description}</span>
              </a>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
          aria-label="Dismiss crisis alert"
          className="flex-shrink-0 rounded-full p-1 text-amber-600 transition hover:bg-amber-100"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default React.memo(CrisisAlert);
