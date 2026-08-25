import { useCallback, useEffect, useRef, useState } from 'react';

// Maps our 2-letter language codes to full BCP-47 tags the Web Speech API expects.
const SPEECH_LANG_MAP = {
  en: 'en-US',
  hi: 'hi-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  ur: 'ur-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  pt: 'pt-PT',
  ar: 'ar-SA',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
  ru: 'ru-RU',
  id: 'id-ID',
  sw: 'sw-KE',
};

export function useVoice(langCode) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(false);
  const [supportError, setSupportError] = useState(null);

  const recognitionRef = useRef(null);
  const onResultRef = useRef(null);

  const SpeechRecognition =
    typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const speechSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speechLang = SPEECH_LANG_MAP[langCode] || 'en-US';

  // --- Mic input (speech-to-text) ---
  const startListening = useCallback(
    (onResult) => {
      if (!SpeechRecognition) {
        setSupportError("Your browser doesn't support voice input. Try Chrome or Edge.");
        return;
      }
      setSupportError(null);
      onResultRef.current = onResult;

      const recognition = new SpeechRecognition();
      recognition.lang = speechLang;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        setIsListening(false);
        if (e.error !== 'aborted' && e.error !== 'no-speech') {
          setSupportError(`Voice input error: ${e.error}`);
        }
      };
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        onResultRef.current?.(transcript);
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [SpeechRecognition, speechLang]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  // --- Reply playback (text-to-speech) ---
  const speak = useCallback(
    (text) => {
      if (!speechSynthesisSupported || !voiceReplyEnabled || !text) return;
      window.speechSynthesis.cancel(); // stop anything already playing

      // Strip basic markdown so it doesn't read out asterisks/hashes etc.
      const clean = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/[*_#`]/g, '')
        .replace(/^- /gm, '');

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = speechLang;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [speechSynthesisSupported, voiceReplyEnabled, speechLang]
  );

  const stopSpeaking = useCallback(() => {
    if (speechSynthesisSupported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [speechSynthesisSupported]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (speechSynthesisSupported) window.speechSynthesis.cancel();
    };
  }, [speechSynthesisSupported]);

  return {
    isListening,
    isSpeaking,
    voiceReplyEnabled,
    setVoiceReplyEnabled,
    supportError,
    micSupported: Boolean(SpeechRecognition),
    speechSupported: speechSynthesisSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
