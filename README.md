# Teach Me This

An AI personal explainer. Enter a topic, upload your notes — get a structured explanation, real-life examples, key points, and practice questions with reveal-on-click answers.

## Features

- **Input:** Topic/question, optional PDF/DOCX upload, optional paste notes
- **Level:** Explain Like I'm 10 | Beginner | Intermediate | Advanced | Exam Revision Mode
- **Style:** Simple Explanation | Step-by-step | Real-life Analogies | Exam-oriented | Bullet Summary
- **Output:** 5 collapsible sections — simple explanation, detailed explanation, real-life example, key points, 5 practice questions (answers reveal on click)
- **YouTube:** Field present, coming soon

## Stack

- **Backend:** Python, FastAPI, Groq (Llama 3.3 70B), pypdf, python-docx
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Lucide icons
- **Deploy:** Railway (single service — FastAPI serves the pre-built Next.js static export)

## Local development

### Terminal 1 — FastAPI backend

```bash
python -m venv .venv
.venv\Scripts\Activate.ps1        # Windows
# source .venv/bin/activate       # Mac/Linux
pip install -r requirements.txt
copy .env.example .env            # then set PLATFORM_GROQ_API_KEY
uvicorn main:app --reload --port 8000
```

### Terminal 2 — Next.js frontend

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (frontend) — API calls proxy to port 8000.

## Deploy on Railway

1. Push this repo to GitHub (includes `frontend/out/` — pre-built static files).
2. New Railway project → Deploy from GitHub → select this repo → branch `main`.
3. Railway uses `railway.json` → runs `pip install -r requirements.txt` then `uvicorn main:app`.
4. Add env variable: `PLATFORM_GROQ_API_KEY` = your Groq key.
5. Generate a public domain under Settings → Networking.

## After frontend changes

```bash
cd frontend
npm run build          # regenerates frontend/out/
cd ..
git add -A
git commit -m "update frontend"
git push
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PLATFORM_GROQ_API_KEY` | Yes | Groq API key (primary LLM) |
| `PLATFORM_GROQ_API_KEY_2` | No | Second key for rotation |
| `PLATFORM_GROQ_API_KEY_3` | No | Third key for rotation |
| `PLATFORM_OPENAI_API_KEY` | No | OpenAI fallback |

> **Note:** This is an MVP. A full tech stack upgrade, auth, payments, and backend improvements are planned.
