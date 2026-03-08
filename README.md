# Teach Me This

An AI personal explainer for students. Enter a topic or upload your notes — get a structured explanation, real-life examples, key points, and practice questions with reveal-on-click answers.

## Features

- **Input:** Type any topic or question; optionally upload PDF/DOCX or paste notes
- **Level:** Explain Like I'm 10 | Beginner | Intermediate | Advanced | Exam Revision Mode
- **Style:** Simple Explanation | Step-by-step | Real-life Analogies | Exam-oriented | Bullet Summary
- **Output (always 5 sections):**
  1. Simple explanation (plain-language overview)
  2. Detailed explanation (shaped by your chosen style)
  3. Real-life example or analogy
  4. Key points summary (bullets)
  5. Five practice questions with answers (click to reveal)
- **YouTube:** Field in UI marked "Coming soon" — architecture ready to plug in later

No accounts, no storage. Runs locally or on your own deployment.

## Local setup

### Prerequisites

- Python 3.10+
- A [Groq API key](https://console.groq.com/) (free tier is enough)

### Steps

```bash
git clone https://github.com/Penguinkillz/teach-me-this.git
cd teach-me-this

python -m venv .venv

# Windows
.\.venv\Scripts\Activate.ps1

# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file (copy from `.env.example`):

```
PLATFORM_GROQ_API_KEY=your_groq_key_here
```

Run the server:

```bash
uvicorn main:app --reload --port 8000
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Deploy on Railway

1. **Push this repo to GitHub** (if you haven’t already):
   - Create a new repo on GitHub (e.g. `teach-me-this`).
   - From the project folder:
     ```bash
     git init
     git add .
     git commit -m "Teach Me This standalone"
     git remote add origin https://github.com/YOUR_USERNAME/teach-me-this.git
     git branch -M main
     git push -u origin main
     ```

2. **Create a new project on Railway**
   - Go to [railway.app](https://railway.app) and sign in.
   - Click **New Project** → **Deploy from GitHub repo**.
   - Select your **teach-me-this** repo (not the quiz one).
   - Choose the **main** branch.

3. **Configure the service**
   - Railway will detect the **Procfile** and use:  
     `web: python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
   - No build command needed; Railway runs `pip install -r requirements.txt` by default for Python.

4. **Set environment variables**
   - In the Railway project, open your service → **Variables**.
   - Add:
     - `PLATFORM_GROQ_API_KEY` = your Groq API key  
   - Optional: `PLATFORM_GROQ_API_KEY_2`, `PLATFORM_GROQ_API_KEY_3`, `PLATFORM_OPENAI_API_KEY` (fallback).

5. **Get your URL**
   - Open **Settings** → **Networking** → **Generate domain** (or use the one Railway created).
   - Your app will be live at `https://your-app-name.up.railway.app`.

6. **Redeploys**
   - Every push to `main` triggers a new deploy. No extra step.

## Project structure

```
├── main.py                     # FastAPI app, teach router + frontend at /
├── core/
│   ├── config.py               # PLATFORM_* env vars
│   ├── llm.py                  # Groq/OpenAI client, key rotation
│   └── file_extract.py         # PDF/DOCX text extraction
├── tools/
│   └── teach_me_this/
│       ├── models.py           # ExplainRequest, ExplainSection, etc.
│       ├── service.py          # Prompt build, LLM call, JSON parse
│       ├── router.py           # /api/teach/explain, /api/teach/explain-from-files
│       └── frontend/
│           ├── index.html
│           └── main.js
├── requirements.txt
├── Procfile                    # Railway: web = uvicorn main:app ...
└── .env.example
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PLATFORM_GROQ_API_KEY` | Yes | Groq API key (primary LLM) |
| `PLATFORM_GROQ_API_KEY_2` | No | Second key for rotation |
| `PLATFORM_GROQ_API_KEY_3` | No | Third key for rotation |
| `PLATFORM_OPENAI_API_KEY` | No | OpenAI fallback if no Groq keys |

## Tech stack

- **Backend:** Python, FastAPI
- **LLM:** Groq (Llama 3.3 70B) with optional OpenAI fallback
- **File parsing:** pypdf, python-docx
- **Frontend:** HTML, CSS, JS (no build step)
- **Deploy:** Railway (Procfile included)
