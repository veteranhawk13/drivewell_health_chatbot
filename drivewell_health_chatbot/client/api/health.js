// Legacy reference stub for deploying the client's basic chat feature as a
// Vercel serverless function, without the separate Express server. Does NOT
// include the newer features (driver auth, risk scoring, manager dashboard) —
// use server/ for the full app. Requires GEMINI_API_KEY set as a Vercel env var.
export default function handler(req, res) {
  res.status(200).json({ status: 'ok', geminiKeyLoaded: Boolean(process.env.GEMINI_API_KEY) });
}
