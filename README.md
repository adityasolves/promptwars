# MindEase — Student Wellness Companion

A full-stack mental wellness web app for Indian students preparing for NEET, JEE, CUET, CAT, GATE, UPSC, and board exams. Built with Next.js App Router, powered by Groq AI (LLaMA 3.3 70B).

---

## Features

- **Mood Tracker** — Log daily mood with emoji scale (1–10) and optional notes
- **Mood Chart** — 7-day mood trend visualization with Recharts
- **Stress Trigger Log** — Tag and describe stress sources
- **Reflection Chat** — Empathetic AI companion powered by Groq
- **Breathing Exercise** — Guided 4-7-8 technique with animated circle
- **Crisis Detection** — Auto-detects distress, shows Indian helplines (iCall, AASRA, Vandrevala)
- **Exam Countdown** — Days until your exam with motivational messages
- **Daily Wellness Tip** — 30 rotating tips for competitive exam students
- **Client-Side Storage** — All data stays in your browser

---

## Getting Started Locally

```bash
git clone <your-repo-url>
cd mindease
npm install
cp .env.example .env.local
# Edit .env.local — add your GROQ_API_KEY from https://console.groq.com
npm run dev
# Open http://localhost:3000
```

---

## Running Tests

```bash
npm test
```

---

## Deploy to Vercel

1. Push to GitHub
2. Connect repo to [vercel.com](https://vercel.com)
3. Add `GROQ_API_KEY` in **Settings → Environment Variables**
4. Deploy
