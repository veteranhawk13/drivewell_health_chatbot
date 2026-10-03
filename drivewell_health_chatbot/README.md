# DriveWell AI — React + Node version

Two apps:

- `server/` — Express API that holds your Gemini key server-side, runs pre-shift risk scoring, stores driver check-ins in Postgres, and proxies chat requests
- `client/` — React (Vite) frontend: driver login, pre-shift check-in, risk-aware chat (with voice input/output), a private per-driver check-in history, and a manager dashboard

## ✨ Features

- **Driver accounts** — name + PIN login (PINs are hashed with scrypt, never stored in plain text)
- **Pre-shift risk check-in** — sleep hours, stress level, symptoms, and medication feed a rule-based risk score (Low / Moderate / High, with an urgent flag for symptoms like chest pain or dizziness)
- **Escalation banner** — a High or urgent result tells the driver not to start their shift before they can continue to chat
- **Fatigue keyword safety net** — chat messages are scanned for acute fatigue/distress language independently of the AI's own response, and logged for follow-up
- **Voice input & output** — a mic button transcribes speech into the chat box, and replies can be read aloud, using the browser's built-in Web Speech API (no extra service needed)
- **My History** — each driver can privately view their own past check-ins; no other driver can see it
- **Manager dashboard** — a shared passcode lets a fleet manager see every driver's latest risk level, recent flags, and check-in history, with a one-click "Clear all data" option
- **Multi-language support** — chat and voice work in 20 languages, selectable from the header

## 🧩 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (via the `pg` driver) — stores driver accounts and check-in history
- **AI:** Google Gemini API (gemini-2.5-flash)

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- A PostgreSQL database — local install, or a free hosted one (Neon, Supabase)
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Server

```bash
cd server
cp ../.env.example .env
# open .env and set:
#   GEMINI_API_KEY   - your key from Google AI Studio
#   DATABASE_URL     - your Postgres connection string
#   MANAGER_PASSCODE - any passcode you choose for the manager dashboard
npm install
npm run dev
```

Runs on **http://localhost:5000**. Tables are created automatically on first start.

### 2. Client

```bash
cd client
npm install
npm run dev
```

Runs on **http://localhost:5173** (Vite proxies `/api` requests to the local server automatically).

## 🚀 Deploying

This app is built as three separate pieces, each hosted wherever suits it best:

```
[Client: Vercel]  →  [Server: Render]  →  [Database: Neon or Supabase]
```

- **Client (Vercel):** set Root Directory to `client`, and add an environment variable `VITE_API_URL` pointing at your deployed server's URL (e.g. `https://your-server.onrender.com`, no trailing slash). Redeploy after adding it.
- **Server (Render):** set Root Directory to `server`, Build Command `npm install`, Start Command `node server.js`. Add `GEMINI_API_KEY`, `DATABASE_URL`, and `MANAGER_PASSCODE` as environment variables.
- **Database (Neon/Supabase):** either works — both have a genuinely free tier with no expiration. Copy their connection string into `DATABASE_URL` on Render.

Render's own free Postgres tier expires after a trial period — Neon or Supabase are the better long-term free options.

## 🔒 Security Notes

- Your Gemini API key never reaches the browser — it lives only in `server/.env` (or your host's environment variables) and is used inside `server/server.js`.
- Driver PINs are hashed with Node's built-in `scrypt` before storage. Each driver can only see their own check-in history — never another driver's.
- The manager dashboard uses a single shared passcode rather than per-manager accounts. Both this and the PIN auth are lightweight schemes (no sessions/JWT) — fine for a small pilot, but replace with real auth before a wider rollout.
- `client/api/` contains legacy serverless-function stubs mirroring only the basic chat endpoint, kept for reference if deploying the client via Vercel's own serverless functions instead of a separate server — they don't have the newer features (auth, risk scoring, manager dashboard).
- Rotate any API key that was ever pasted directly into client-side code.

## 🛠️ Environment Variables

Copy `.env.example` to `.env` inside `server/` and fill in:

```
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=postgres://user:password@host:port/database
MANAGER_PASSCODE=choose_a_strong_passcode
```
