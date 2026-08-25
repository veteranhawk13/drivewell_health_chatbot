const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { history, lang } = req.body;

    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'history (array of {role, content}) is required' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY.' });
    }

    const langInstruction = LANG_INSTRUCTIONS[lang] || LANG_INSTRUCTIONS.en;
    const systemInstruction = `${BASE_SYSTEM}\n\nLanguage instruction: ${langInstruction}`;

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

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
}