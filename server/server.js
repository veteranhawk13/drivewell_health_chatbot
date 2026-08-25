import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  initDb,
  registerDriver,
  loginDriver,
  insertCheckin,
  getRecentCheckins,
  insertChatFlag,
  getAllDriversOverview,
  getDriverDetail,
  clearAllData,
} from './db.js';
import { scoreCheckin, scanMessageForFatigueSignals } from './riskEngine.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';
const MANAGER_PASSCODE = process.env.MANAGER_PASSCODE || '';

const BASE_SYSTEM = `You are DriveWell AI, a compassionate health assistant for professional drivers (truck, cab, bus, delivery). Help with:
- Fatigue detection and rest strategies
- Sleep hygiene and HOS compliance
- Road nutrition and hydration
- Back/neck pain and posture
- Eye strain and vision
- Mental health and stress
- In-cab stretches and exercise
- Recognizing when to pull over

Rules:
- Be warm, direct, and practical
- Use bullet points for multi-tip answers
- Bold key points with **text**
- For fatigue/drowsiness always say to pull over safely
- Never diagnose — suggest seeing a doctor for serious symptoms
- Keep replies focused and not too long`;

// Language instructions live server-side; the client only ever sends a language code.
const LANG_INSTRUCTIONS = {
  en: 'Always respond in English.',
  hi: 'Always respond in Hindi (हिंदी में जवाब दें).',
  bn: 'Always respond in Bengali (বাংলায় উত্তর দিন).',
  ta: 'Always respond in Tamil (தமிழில் பதில் கொடுங்கள்).',
  te: 'Always respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి).',
  mr: 'Always respond in Marathi (मराठीत उत्तर द्या).',
  gu: 'Always respond in Gujarati (ગુજરાતીમાં જવાબ આપો).',
  pa: 'Always respond in Punjabi (ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ).',
  ur: 'Always respond in Urdu (اردو میں جواب دیں).',
  es: 'Always respond in Spanish (Responde siempre en español).',
  fr: 'Always respond in French (Réponds toujours en français).',
  de: 'Always respond in German (Antworte immer auf Deutsch).',
  pt: 'Always respond in Portuguese (Responda sempre em português).',
  ar: 'Always respond in Arabic (أجب دائماً بالعربية).',
  zh: 'Always respond in Simplified Chinese (请始终用简体中文回复).',
  ja: 'Always respond in Japanese (常に日本語で回答してください).',
  ko: 'Always respond in Korean (항상 한국어로 답변해 주세요).',
  ru: 'Always respond in Russian (Всегда отвечай на русском языке).',
  id: 'Always respond in Indonesian (Selalu jawab dalam Bahasa Indonesia).',
  sw: 'Always respond in Swahili (Jibu daima kwa Kiswahili).',
};

// ---------- Driver auth ----------

app.post('/api/auth/driver/register', async (req, res) => {
  try {
    const { name, pin } = req.body || {};
    if (!name || !pin || String(pin).length < 4) {
      return res.status(400).json({ error: 'Name and a PIN (min 4 digits) are required.' });
    }
    const driver = await registerDriver(name.trim(), String(pin));
    res.json({ driver });
  } catch (err) {
    res.status(err.code === 'DRIVER_EXISTS' ? 409 : 500).json({ error: err.message });
  }
});

app.post('/api/auth/driver/login', async (req, res) => {
  try {
    const { name, pin } = req.body || {};
    if (!name || !pin) return res.status(400).json({ error: 'Name and PIN are required.' });
    const driver = await loginDriver(name.trim(), String(pin));
    res.json({ driver });
  } catch (err) {
    res.status(err.code === 'INVALID_CREDENTIALS' ? 401 : 500).json({ error: err.message });
  }
});

// ---------- Pre-shift check-in / risk scoring ----------

app.post('/api/checkin', async (req, res) => {
  try {
    const { driverId, sleepHours, stressLevel, symptoms, medication } = req.body || {};

    if (!driverId || sleepHours === undefined || stressLevel === undefined) {
      return res.status(400).json({ error: 'driverId, sleepHours, and stressLevel are required.' });
    }
    const sh = Number(sleepHours);
    const sl = Number(stressLevel);
    if (Number.isNaN(sh) || sh < 0 || sh > 16 || Number.isNaN(sl) || sl < 1 || sl > 5) {
      return res.status(400).json({ error: 'sleepHours (0-16) and stressLevel (1-5) must be valid numbers.' });
    }

    const recentCheckins = await getRecentCheckins(driverId, 5);
    const result = scoreCheckin({
      sleepHours: sh,
      stressLevel: sl,
      symptoms: Array.isArray(symptoms) ? symptoms : [],
      medication: Boolean(medication),
      recentCheckins,
    });

    const saved = await insertCheckin({
      driverId,
      sleepHours: sh,
      stressLevel: sl,
      symptoms: symptoms || [],
      medication: Boolean(medication),
      score: result.score,
      level: result.level,
      urgent: result.urgent,
      factors: result.factors,
    });

    res.json({ checkin: saved, risk: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
});

app.get('/api/checkin/history/:driverId', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 14, 60);
    const history = await getRecentCheckins(req.params.driverId, limit);
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
});

// ---------- Chat (LLM-backed, with a deterministic fatigue keyword safety net) ----------

app.post('/api/chat', async (req, res) => {
  try {
    const { history, lang, driverId, currentRiskLevel } = req.body;

    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'history (array of {role, content}) is required' });
    }
    if (!GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ error: 'Server is missing GEMINI_API_KEY. Add it to server/.env and restart.' });
    }

    // Deterministic safety net: scan the latest user message for fatigue/distress
    // language regardless of what the LLM ends up saying.
    const lastUserMsg = [...history].reverse().find((m) => m.role === 'user');
    let fatigueFlag = null;
    if (lastUserMsg && driverId) {
      const matched = scanMessageForFatigueSignals(lastUserMsg.content);
      if (matched) {
        fatigueFlag = matched;
        try {
          await insertChatFlag({ driverId, message: lastUserMsg.content, matchedKeyword: matched });
        } catch (e) {
          console.error('Failed to log chat flag:', e.message);
        }
      }
    }

    const langInstruction = LANG_INSTRUCTIONS[lang] || LANG_INSTRUCTIONS.en;
    let systemInstruction = `${BASE_SYSTEM}\n\nLanguage instruction: ${langInstruction}`;
    if (currentRiskLevel) {
      systemInstruction += `\n\nContext: this driver's most recent pre-shift risk check-in came back "${currentRiskLevel}". Factor this in gently if relevant, without being repetitive about it.`;
    }
    if (fatigueFlag) {
      systemInstruction += `\n\nImportant: the driver's latest message contains language suggesting acute fatigue or a medical symptom. Prioritize telling them to pull over safely now if they are driving, before anything else.`;
    }

    const contents = history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
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
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't respond. Please try again.";

    res.json({ reply, fatigueFlag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
});

// ---------- Manager views ----------
// NOTE: this is a shared-passcode gate, not per-manager accounts. Fine for a small
// pilot; swap for real auth (sessions/JWT + manager table) before wider rollout.

function requireManagerPasscode(req, res, next) {
  if (!MANAGER_PASSCODE) {
    return res.status(500).json({ error: 'Server is missing MANAGER_PASSCODE. Add it to server/.env and restart.' });
  }
  const provided = req.header('X-Manager-Passcode');
  if (provided !== MANAGER_PASSCODE) {
    return res.status(401).json({ error: 'Invalid manager passcode.' });
  }
  next();
}

app.post('/api/auth/manager/login', (req, res) => {
  const { passcode } = req.body || {};
  if (!MANAGER_PASSCODE) {
    return res.status(500).json({ error: 'Server is missing MANAGER_PASSCODE.' });
  }
  if (passcode !== MANAGER_PASSCODE) {
    return res.status(401).json({ error: 'Incorrect passcode.' });
  }
  res.json({ ok: true });
});

app.get('/api/manager/drivers', requireManagerPasscode, async (req, res) => {
  try {
    res.json({ drivers: await getAllDriversOverview() });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
});

app.get('/api/manager/driver/:id', requireManagerPasscode, async (req, res) => {
  try {
    const detail = await getDriverDetail(req.params.id);
    if (!detail) return res.status(404).json({ error: 'Driver not found.' });
    res.json({ driver: detail });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
});

app.post('/api/manager/clear-all', requireManagerPasscode, async (req, res) => {
  try {
    await clearAllData();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', geminiKeyLoaded: Boolean(GEMINI_API_KEY), managerPasscodeSet: Boolean(MANAGER_PASSCODE) });
});

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`DriveWell server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to Postgres. Check DATABASE_URL in server/.env and that Postgres is running.');
    console.error(err.message);
    process.exit(1);
  });
