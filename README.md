# 🚗🩺 DriveWell AI — Health Chatbot for Drivers

An AI-powered health and wellness chatbot built for drivers — especially long-haul and professional drivers — to help them stay alert, healthy, and safe on the road. Built with a React (Vite) frontend and an Express backend, powered by Google's Gemini API. The backend keeps your API key secure server-side, so it's never exposed to the browser.

## ✨ Features

- **Driver accounts** — name + PIN login (PINs are hashed with scrypt, never stored in plain text)
- **Pre-shift risk check-in** — sleep hours, stress level, symptoms, and medication feed a rule-based risk score (Low / Moderate / High, with an urgent flag for symptoms like chest pain or dizziness)
- **Escalation banner** — a High or urgent result tells the driver not to start their shift before they can continue to chat
- **Fatigue keyword safety net** — chat messages are scanned for acute fatigue/distress language independently of the AI's own response, and logged for follow-up
- **History tracking** — check-ins persist per driver in Postgres, so trends (e.g. several consecutive nights of poor sleep) factor into future risk scores
- **Manager dashboard** — a shared passcode lets a fleet manager see every driver's latest risk level, recent flags, and check-in history
- **Fatigue & alertness chat guidance** — conversational support on breaks, hydration, posture, eye strain, stress, and when to pull over or seek medical attention

## 🧩 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (via the `pg` driver) — stores driver accounts and check-in history
- **AI:** Google Gemini API

## 📂 Project Structure

```
drivewell_health_chatbot/
├── client/          # React (Vite) frontend
├── server/          # Express API — proxies requests to Gemini
├── .env.example     # Sample environment variables
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [PostgreSQL](https://www.postgresql.org/download/) installed and running locally (Windows/macOS installers, or `postgresql` package on Linux)
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/veteranhawk13/drivewell_health_chatbot.git
cd drivewell_health_chatbot
```

### 2. Create the Postgres database

After installing Postgres, create an empty database for the app. Using `psql` (opens automatically after install, or run it from your Start Menu on Windows / terminal on macOS/Linux):

```sql
CREATE DATABASE drivewell;
```

Note the username/password you set during Postgres install (default user is usually `postgres`) — you'll need them in the next step. The app creates its own tables automatically on first run; you just need the empty database to exist.

### 3. Set up the server

```bash
cd server
cp .env.example .env
# open .env and set:
#   GEMINI_API_KEY   - your key from Google AI Studio
#   DATABASE_URL     - postgres://postgres:your_password@localhost:5432/drivewell
#   MANAGER_PASSCODE - any passcode you choose for the manager dashboard
npm install
npm run dev
```

The server runs on **http://localhost:5000** and creates its tables in Postgres automatically on first start. If it can't connect, double check Postgres is running and that `DATABASE_URL` matches your actual username/password/database name.

### 4. Set up the client

In a new terminal:

```bash
cd client
npm install
npm run dev
```

The client runs on **http://localhost:5173** and automatically proxies `/api` requests to the server.

## 🔒 Security Notes

- Your Gemini API key never reaches the browser — it lives only in `server/.env` and is used inside `server/server.js`.
- Driver PINs are hashed with Node's built-in `scrypt` before storage. The manager dashboard uses a single shared passcode rather than per-manager accounts. Both are lightweight auth schemes (no sessions/JWT) — fine for a small pilot, but replace with real auth before a wider rollout.
- Postgres connection details (including the password) live in `DATABASE_URL` in `server/.env` — never commit that file.
- The `client/api/` serverless functions only mirror the original chat endpoint (no risk-scoring/DB) — they're kept for reference if you deploy the client separately, but don't have the newer features.
- If you deploy this project, deploy the `server/` app somewhere with the environment variables set, and point the client's API calls at that server's URL (update `vite.config.js`'s proxy, or use an absolute URL with CORS enabled).
- If you ever had an API key pasted directly into client-side JS in an earlier version, rotate that key immediately.

## 🛠️ Environment Variables

Copy `.env.example` to `.env` inside `server/` and fill in:

```
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=postgres://postgres:your_password@localhost:5432/drivewell
MANAGER_PASSCODE=choose_a_strong_passcode
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or an issue.

## 📬 Contact

Maintained by [veteranhawk13](https://github.com/veteranhawk13).
