// Legacy reference stub for deploying the client's basic chat feature as a
// Vercel serverless function, without the separate Express server. Does NOT
// include the newer features (driver auth, risk scoring, fatigue keyword
// scanning, manager dashboard) — use server/ for the full app.
// Requires GEMINI_API_KEY set as a Vercel environment variable.

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const BASE_SYSTEM = `You are DriveWell AI, a compassionate health assistant for professional drivers. Help with fatigue, sleep, nutrition, posture, eye strain, stress, and recognizing when to pull over. Be warm, direct, and practical. Never diagnose — suggest seeing a doctor for serious symptoms.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { history } = req.body || {};
    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'history (array of {role, content}) is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY.' });
    }

    const contents = history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: BASE_SYSTEM }] },
        contents,
        generationConfig: { maxOutputTokens: 1000 },
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody?.error?.message || `Gemini API error: HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't respond. Please try again.";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
}
