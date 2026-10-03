export const LANG_CONFIG = {
  en: {
    welcomeTitle: 'Hello, Driver 👋',
    welcomeDesc:
      "I'm here to help with fatigue, health, and wellness on the road. Ask me anything, or try one of these:",
    placeholder: 'Ask about fatigue, health, nutrition, pain relief…',
    quickPrompts: [
      'How can I stay alert on a long drive?',
      'Give me a quick posture check routine',
      'What should I eat before a night shift?',
      'I have back pain, what can I do?',
    ],
  },
  hi: {
    welcomeTitle: 'नमस्ते, ड्राइवर 👋',
    welcomeDesc: 'मैं सड़क पर थकान, स्वास्थ्य और तंदुरुस्ती में मदद के लिए यहाँ हूँ। कुछ भी पूछें:',
    placeholder: 'थकान, स्वास्थ्य, पोषण के बारे में पूछें…',
    quickPrompts: [
      'लंबी ड्राइव में सतर्क कैसे रहूं?',
      'जल्दी पॉस्चर चेक रूटीन बताएं',
      'नाइट शिफ्ट से पहले क्या खाऊं?',
      'मेरी पीठ में दर्द है, क्या करूं?',
    ],
  },
};

export const LANG_OPTIONS = [
  ['en', '🌐 English'],
  ['hi', '🇮🇳 Hindi'],
  ['bn', '🇮🇳 Bengali'],
  ['ta', '🇮🇳 Tamil'],
  ['te', '🇮🇳 Telugu'],
  ['mr', '🇮🇳 Marathi'],
  ['gu', '🇮🇳 Gujarati'],
  ['pa', '🇮🇳 Punjabi'],
  ['ur', '🇵🇰 Urdu'],
  ['es', '🇪🇸 Spanish'],
  ['fr', '🇫🇷 French'],
  ['de', '🇩🇪 German'],
  ['pt', '🇵🇹 Portuguese'],
  ['ar', '🇸🇦 Arabic'],
  ['zh', '🇨🇳 Chinese'],
  ['ja', '🇯🇵 Japanese'],
  ['ko', '🇰🇷 Korean'],
  ['ru', '🇷🇺 Russian'],
  ['id', '🇮🇩 Indonesian'],
  ['sw', '🇰🇪 Swahili'],
];

// Fill in a reasonable default for any language not explicitly defined above,
// so the app never crashes on a missing translation.
for (const [code] of LANG_OPTIONS) {
  if (!LANG_CONFIG[code]) {
    LANG_CONFIG[code] = LANG_CONFIG.en;
  }
}
