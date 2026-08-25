// Display-only strings per language. The actual "respond in X language" instruction
// lives server-side (server/server.js) so it can't be tampered with from the client.
export const LANG_CONFIG = {
  en: {
    welcomeTitle: 'Hello, Driver 👋',
    welcomeDesc:
      "I'm your personal health co-pilot. Ask me anything about fatigue, nutrition, posture, sleep, or staying safe on the road.",
    chips: [
      'Am I too tired to drive? What should I check?',
      'Give me a quick posture check routine',
      'What are healthy snacks for long drives?',
      'How do I know when I need to take a break?',
    ],
    chipLabels: ['Am I too tired to drive?', 'Posture check', 'Healthy snacks', 'When to take a break?'],
    placeholder: 'Ask about fatigue, health, nutrition, pain relief...',
  },
  hi: {
    welcomeTitle: 'नमस्ते, ड्राइवर 👋',
    welcomeDesc: 'मैं आपका स्वास्थ्य सह-पायलट हूँ। थकान, पोषण, आसन, नींद या सड़क सुरक्षा के बारे में कुछ भी पूछें।',
    chips: [
      'क्या मैं गाड़ी चलाने के लिए बहुत थका हुआ हूँ?',
      'मुझे एक त्वरित आसन जाँच दिनचर्या दें',
      'लंबी ड्राइव के लिए स्वस्थ स्नैक्स क्या हैं?',
      'मुझे ब्रेक कब लेना चाहिए?',
    ],
    chipLabels: ['क्या मैं बहुत थका हूँ?', 'आसन जाँच', 'स्वस्थ स्नैक्स', 'ब्रेक कब लें?'],
    placeholder: 'थकान, स्वास्थ्य, पोषण के बारे में पूछें...',
  },
  bn: {
    welcomeTitle: 'হ্যালো, ড্রাইভার 👋',
    welcomeDesc:
      'আমি আপনার ব্যক্তিগত স্বাস্থ্য সহ-পাইলট। ক্লান্তি, পুষ্টি, ভঙ্গি, ঘুম বা রাস্তায় নিরাপদ থাকার বিষয়ে যেকোনো প্রশ্ন করুন।',
    chips: [
      'আমি কি গাড়ি চালানোর জন্য অনেক ক্লান্ত?',
      'একটি দ্রুত ভঙ্গি পরীক্ষার রুটিন দিন',
      'দীর্ঘ ড্রাইভের জন্য স্বাস্থ্যকর স্ন্যাকস কী?',
      'কখন বিরতি নেওয়া উচিত?',
    ],
    chipLabels: ['আমি কি অনেক ক্লান্ত?', 'ভঙ্গি পরীক্ষা', 'স্বাস্থ্যকর স্ন্যাকস', 'বিরতি কখন নেব?'],
    placeholder: 'ক্লান্তি, স্বাস্থ্য, পুষ্টি সম্পর্কে জিজ্ঞেস করুন...',
  },
  ta: {
    welcomeTitle: 'வணக்கம், டிரைவர் 👋',
    welcomeDesc:
      'நான் உங்கள் தனிப்பட்ட உடல்நல உதவியாளர். சோர்வு, ஊட்டச்சத்து, தோரணை, தூக்கம் அல்லது சாலை பாதுகாப்பு பற்றி கேளுங்கள்.',
    chips: [
      'நான் வாகனம் ஓட்ட மிகவும் சோர்வாக இருக்கிறேனா?',
      'விரைவான தோரணை சோதனை வழக்கம் கொடுங்கள்',
      'நீண்ட பயணத்திற்கு ஆரோக்கியமான தின்பண்டங்கள் என்ன?',
      'எப்போது இடைவேளை எடுக்க வேண்டும்?',
    ],
    chipLabels: ['நான் சோர்வாக இருக்கிறேனா?', 'தோரணை சோதனை', 'ஆரோக்கியமான தின்பண்டங்கள்', 'இடைவேளை எப்போது?'],
    placeholder: 'சோர்வு, உடல்நலம், ஊட்டச்சத்து பற்றி கேளுங்கள்...',
  },
  te: {
    welcomeTitle: 'నమస్కారం, డ్రైవర్ 👋',
    welcomeDesc: 'నేను మీ వ్యక్తిగత ఆరోగ్య సహాయకుడిని. అలసట, పోషణ, భంగిమ, నిద్ర లేదా రహదారి భద్రత గురించి అడగండి.',
    chips: [
      'నేను డ్రైవ్ చేయడానికి చాలా అలసిపోయానా?',
      'త్వరిత భంగిమ తనిఖీ దినచర్య ఇవ్వండి',
      'సుదీర్ఘ డ్రైవ్‌లకు ఆరోగ్యకరమైన స్నాక్స్ ఏమిటి?',
      'నేను ఎప్పుడు విరామం తీసుకోవాలి?',
    ],
    chipLabels: ['నేను చాలా అలసిపోయానా?', 'భంగిమ తనిఖీ', 'ఆరోగ్యకరమైన స్నాక్స్', 'విరామం ఎప్పుడు?'],
    placeholder: 'అలసట, ఆరోగ్యం, పోషణ గురించి అడగండి...',
  },
  mr: {
    welcomeTitle: 'नमस्कार, ड्रायव्हर 👋',
    welcomeDesc: 'मी तुमचा वैयक्तिक आरोग्य सह-पायलट आहे. थकवा, पोषण, आसन, झोप किंवा रस्त्यावर सुरक्षिततेबद्दल काहीही विचारा.',
    chips: [
      'मी गाडी चालवण्यासाठी खूप थकलेलो आहे का?',
      'आसन तपासणी दिनचर्या द्या',
      'लांब प्रवासासाठी आरोग्यदायी स्नॅक्स काय आहेत?',
      'मला कधी विश्रांती घ्यायची?',
    ],
    chipLabels: ['मी खूप थकलेलो आहे का?', 'आसन तपासणी', 'आरोग्यदायी स्नॅक्स', 'विश्रांती कधी?'],
    placeholder: 'थकवा, आरोग्य, पोषणाबद्दल विचारा...',
  },
  gu: {
    welcomeTitle: 'નમસ્તે, ડ્રાઇવર 👋',
    welcomeDesc: 'હું તમારો વ્યક્તિગત સ્વાસ્થ્ય સહ-પાઇલટ છું. થાક, પોષણ, મુદ્રા, ઊંઘ અથવા રોડ સેફ્ટી વિશે કઈ પણ પૂછો.',
    chips: [
      'શું હું ડ્રાઇવ કરવા માટે ખૂબ થાકેલો છું?',
      'ઝડપી મુદ્રા તપાસ દિનચર્યા આપો',
      'લાંબી ડ્રાઇવ માટે સ્વસ્થ સ્નેક્સ શું છે?',
      'મારે ક્યારે વિરામ લેવો જોઈએ?',
    ],
    chipLabels: ['હું ખૂબ થાકેલો છું?', 'મુદ્રા તપાસ', 'સ્વસ્થ સ્નેક્સ', 'વિરામ ક્યારે?'],
    placeholder: 'થાક, સ્વાસ્થ્ય, પોષણ વિશે પૂછો...',
  },
  pa: {
    welcomeTitle: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਡਰਾਈਵਰ 👋',
    welcomeDesc: 'ਮੈਂ ਤੁਹਾਡਾ ਨਿੱਜੀ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਥਕਾਵਟ, ਪੋਸ਼ਣ, ਆਸਣ, ਨੀਂਦ ਜਾਂ ਸੜਕ ਸੁਰੱਖਿਆ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।',
    chips: [
      'ਕੀ ਮੈਂ ਗੱਡੀ ਚਲਾਉਣ ਲਈ ਬਹੁਤ ਥੱਕਿਆ ਹਾਂ?',
      'ਇੱਕ ਤੇਜ਼ ਆਸਣ ਜਾਂਚ ਰੁਟੀਨ ਦਿਓ',
      'ਲੰਬੀ ਡਰਾਈਵ ਲਈ ਸਿਹਤਮੰਦ ਸਨੈਕਸ ਕੀ ਹਨ?',
      'ਮੈਨੂੰ ਕਦੋਂ ਬ੍ਰੇਕ ਲੈਣੀ ਚਾਹੀਦੀ ਹੈ?',
    ],
    chipLabels: ['ਕੀ ਮੈਂ ਬਹੁਤ ਥੱਕਿਆ ਹਾਂ?', 'ਆਸਣ ਜਾਂਚ', 'ਸਿਹਤਮੰਦ ਸਨੈਕਸ', 'ਬ੍ਰੇਕ ਕਦੋਂ?'],
    placeholder: 'ਥਕਾਵਟ, ਸਿਹਤ, ਪੋਸ਼ਣ ਬਾਰੇ ਪੁੱਛੋ...',
  },
  ur: {
    welcomeTitle: 'السلام علیکم، ڈرائیور 👋',
    welcomeDesc: 'میں آپ کا ذاتی صحت معاون ہوں۔ تھکاوٹ، غذائیت، کرنسی، نیند یا سڑک کی حفاظت کے بارے میں کچھ بھی پوچھیں۔',
    chips: [
      'کیا میں گاڑی چلانے کے لیے بہت تھکا ہوا ہوں؟',
      'ایک فوری کرنسی چیک روٹین دیں',
      'لمبی ڈرائیو کے لیے صحت مند اسنیکس کیا ہیں؟',
      'مجھے وقفہ کب لینا چاہیے؟',
    ],
    chipLabels: ['کیا میں بہت تھکا ہوں؟', 'کرنسی چیک', 'صحت مند اسنیکس', 'وقفہ کب لیں؟'],
    placeholder: 'تھکاوٹ، صحت، غذائیت کے بارے میں پوچھیں...',
  },
  es: {
    welcomeTitle: 'Hola, Conductor 👋',
    welcomeDesc:
      'Soy tu copiloto de salud personal. Pregúntame sobre fatiga, nutrición, postura, sueño o cómo mantenerte seguro en la carretera.',
    chips: [
      '¿Estoy demasiado cansado para conducir?',
      'Dame una rutina rápida de verificación de postura',
      '¿Qué bocadillos saludables hay para viajes largos?',
      '¿Cómo sé cuándo debo tomar un descanso?',
    ],
    chipLabels: ['¿Estoy demasiado cansado?', 'Verificar postura', 'Bocadillos saludables', '¿Cuándo descansar?'],
    placeholder: 'Pregunta sobre fatiga, salud, nutrición...',
  },
  fr: {
    welcomeTitle: 'Bonjour, Conducteur 👋',
    welcomeDesc:
      'Je suis votre copilote santé personnel. Posez-moi des questions sur la fatigue, la nutrition, la posture, le sommeil ou la sécurité routière.',
    chips: [
      'Suis-je trop fatigué pour conduire ?',
      'Donnez-moi une routine de vérification de posture rapide',
      'Quels sont les snacks sains pour les longs trajets ?',
      'Comment savoir quand faire une pause ?',
    ],
    chipLabels: ['Suis-je trop fatigué ?', 'Vérifier posture', 'Snacks sains', 'Quand faire une pause ?'],
    placeholder: 'Posez des questions sur la fatigue, la santé, la nutrition...',
  },
  de: {
    welcomeTitle: 'Hallo, Fahrer 👋',
    welcomeDesc:
      'Ich bin Ihr persönlicher Gesundheits-Co-Pilot. Fragen Sie mich nach Müdigkeit, Ernährung, Haltung, Schlaf oder sicherem Fahren.',
    chips: [
      'Bin ich zu müde zum Fahren?',
      'Gib mir eine schnelle Haltungsprüfroutine',
      'Welche gesunden Snacks gibt es für lange Fahrten?',
      'Wann sollte ich eine Pause machen?',
    ],
    chipLabels: ['Bin ich zu müde?', 'Haltung prüfen', 'Gesunde Snacks', 'Wann Pause machen?'],
    placeholder: 'Fragen Sie nach Müdigkeit, Gesundheit, Ernährung...',
  },
  pt: {
    welcomeTitle: 'Olá, Motorista 👋',
    welcomeDesc:
      'Sou seu copiloto de saúde pessoal. Pergunte-me sobre fadiga, nutrição, postura, sono ou como se manter seguro na estrada.',
    chips: [
      'Estou cansado demais para dirigir?',
      'Me dê uma rotina rápida de verificação de postura',
      'Quais são os lanches saudáveis para viagens longas?',
      'Como saber quando preciso fazer uma pausa?',
    ],
    chipLabels: ['Estou cansado demais?', 'Verificar postura', 'Lanches saudáveis', 'Quando fazer pausa?'],
    placeholder: 'Pergunte sobre fadiga, saúde, nutrição...',
  },
  ar: {
    welcomeTitle: 'مرحبًا، سائق 👋',
    welcomeDesc: 'أنا مساعدك الصحي الشخصي. اسألني عن التعب والتغذية ووضعية الجسم والنوم أو السلامة على الطريق.',
    chips: [
      'هل أنا متعب جداً للقيادة؟',
      'أعطني روتيناً سريعاً لفحص الوضعية',
      'ما هي الوجبات الخفيفة الصحية للرحلات الطويلة؟',
      'كيف أعرف متى أحتاج لأخذ استراحة؟',
    ],
    chipLabels: ['هل أنا متعب جداً؟', 'فحص الوضعية', 'وجبات خفيفة صحية', 'متى أستريح؟'],
    placeholder: 'اسأل عن التعب والصحة والتغذية...',
  },
  zh: {
    welcomeTitle: '你好，司机 👋',
    welcomeDesc: '我是您的个人健康副驾驶。请问我关于疲劳、营养、姿势、睡眠或道路安全的任何问题。',
    chips: [
      '我太累了不能开车吗？',
      '给我一个快速的姿势检查方案',
      '长途驾驶有哪些健康零食？',
      '我怎么知道什么时候需要休息？',
    ],
    chipLabels: ['我太累了吗？', '检查姿势', '健康零食', '何时休息？'],
    placeholder: '询问疲劳、健康、营养...',
  },
  ja: {
    welcomeTitle: 'こんにちは、ドライバー 👋',
    welcomeDesc: '私はあなたの個人的な健康コパイロットです。疲労、栄養、姿勢、睡眠、または安全運転について何でも聞いてください。',
    chips: [
      '私は運転するには疲れすぎていますか？',
      '素早い姿勢チェックのルーティンを教えてください',
      '長距離ドライブに健康的なスナックは何ですか？',
      'いつ休憩を取ればいいですか？',
    ],
    chipLabels: ['疲れすぎ？', '姿勢チェック', '健康スナック', '休憩のタイミング？'],
    placeholder: '疲労、健康、栄養について聞いてください...',
  },
  ko: {
    welcomeTitle: '안녕하세요, 운전자 👋',
    welcomeDesc: '저는 당신의 개인 건강 부기장입니다. 피로, 영양, 자세, 수면 또는 도로 안전에 대해 무엇이든 물어보세요.',
    chips: [
      '운전하기에 너무 피곤한가요?',
      '빠른 자세 점검 루틴을 알려주세요',
      '장거리 운전에 건강한 간식은 무엇인가요?',
      '언제 휴식을 취해야 하나요?',
    ],
    chipLabels: ['너무 피곤한가요?', '자세 점검', '건강한 간식', '휴식 시간은?'],
    placeholder: '피로, 건강, 영양에 대해 물어보세요...',
  },
  ru: {
    welcomeTitle: 'Привет, водитель 👋',
    welcomeDesc: 'Я ваш личный помощник по здоровью. Спрашивайте меня о усталости, питании, осанке, сне или безопасности на дороге.',
    chips: [
      'Я слишком устал для вождения?',
      'Дайте мне быструю проверку осанки',
      'Какие здоровые перекусы для дальних поездок?',
      'Как понять, когда нужен перерыв?',
    ],
    chipLabels: ['Я слишком устал?', 'Проверка осанки', 'Здоровые перекусы', 'Когда делать перерыв?'],
    placeholder: 'Спрашивайте об усталости, здоровье, питании...',
  },
  id: {
    welcomeTitle: 'Halo, Pengemudi 👋',
    welcomeDesc:
      'Saya adalah co-pilot kesehatan pribadi Anda. Tanyakan apa saja tentang kelelahan, nutrisi, postur, tidur, atau keselamatan di jalan.',
    chips: [
      'Apakah saya terlalu lelah untuk mengemudi?',
      'Berikan rutinitas pemeriksaan postur cepat',
      'Camilan sehat apa untuk perjalanan jauh?',
      'Bagaimana saya tahu kapan harus beristirahat?',
    ],
    chipLabels: ['Apakah saya terlalu lelah?', 'Periksa postur', 'Camilan sehat', 'Kapan istirahat?'],
    placeholder: 'Tanyakan tentang kelelahan, kesehatan, nutrisi...',
  },
  sw: {
    welcomeTitle: 'Habari, Dereva 👋',
    welcomeDesc: 'Mimi ni msaidizi wako wa afya. Niulize chochote kuhusu uchovu, lishe, mkao, usingizi, au usalama barabarani.',
    chips: [
      'Je, nimechoka sana kuendesha?',
      'Nipe utaratibu wa haraka wa ukaguzi wa mkao',
      'Vitafunio vyenye afya kwa safari ndefu ni vipi?',
      'Ninajuaje ninahitaji kupumzika?',
    ],
    chipLabels: ['Nimechoka sana?', 'Ukaguzi wa mkao', 'Vitafunio vyenye afya', 'Lini kupumzika?'],
    placeholder: 'Uliza kuhusu uchovu, afya, lishe...',
  },
};

// [code, dropdown label] pairs, in display order
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
  ['pt', '🇧🇷 Portuguese'],
  ['ar', '🇸🇦 Arabic'],
  ['zh', '🇨🇳 Chinese'],
  ['ja', '🇯🇵 Japanese'],
  ['ko', '🇰🇷 Korean'],
  ['ru', '🇷🇺 Russian'],
  ['id', '🇮🇩 Indonesian'],
  ['sw', '🌍 Swahili'],
];
