import { useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Welcome from './components/Welcome.jsx';
import Message from './components/Message.jsx';
import TypingIndicator from './components/TypingIndicator.jsx';
import InputArea from './components/InputArea.jsx';
import DriverLogin from './components/DriverLogin.jsx';
import CheckIn from './components/CheckIn.jsx';
import RiskBanner from './components/RiskBanner.jsx';
import ManagerLogin from './components/ManagerLogin.jsx';
import ManagerDashboard from './components/ManagerDashboard.jsx';
import { LANG_CONFIG, LANG_OPTIONS } from './langConfig.js';
import { sendChat } from './api/backend.js';
import { useVoice } from './hooks/useVoice.js';

const STORAGE_KEY = 'drivewell_driver';

export default function App() {
  // view: 'driver-login' | 'checkin' | 'risk-result' | 'chat' | 'manager-login' | 'manager-dashboard'
  const [view, setView] = useState('driver-login');
  const [driver, setDriver] = useState(null);
  const [risk, setRisk] = useState(null);
  const [managerPasscode, setManagerPasscode] = useState(null);

  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fatigueBanner, setFatigueBanner] = useState(false);
  const chatRef = useRef(null);

  const cfg = LANG_CONFIG[lang] || LANG_CONFIG.en;
  const voice = useVoice(lang);

  // Restore a logged-in driver across reloads (identity only — no health data cached client-side).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDriver(parsed);
        setView('checkin');
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isLoading, error]);

  const handleDriverLogin = (d) => {
    setDriver(d);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    setView('checkin');
  };

  const handleCheckinDone = ({ risk }) => {
    setRisk(risk);
    setView('risk-result');
  };

  const handleSkipCheckin = () => {
    setRisk(null);
    setView('chat');
  };

  const enterChat = () => setView('chat');

  const handleMicClick = () => {
    if (voice.isListening) {
      voice.stopListening();
      return;
    }
    voice.startListening((transcript) => {
      send(transcript);
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDriver(null);
    setRisk(null);
    setMessages([]);
    setView('driver-login');
  };

  const send = async (quickText) => {
    const trimmed = (quickText ?? input).trim();
    if (!trimmed || isLoading) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setFatigueBanner(false);
    setIsLoading(true);

    try {
      const data = await sendChat({
        history: nextMessages,
        lang,
        driverId: driver?.id,
        currentRiskLevel: risk?.level,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      voice.speak(data.reply);
      if (data.fatigueFlag) setFatigueBanner(true);
    } catch (err) {
      setError(err.message || 'Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Manager flow (separate from driver flow) ----
  if (view === 'manager-login') {
    return <ManagerLogin onLogin={(pc) => { setManagerPasscode(pc); setView('manager-dashboard'); }} onBack={() => setView('driver-login')} />;
  }
  if (view === 'manager-dashboard') {
    return <ManagerDashboard passcode={managerPasscode} onBack={() => { setManagerPasscode(null); setView('driver-login'); }} />;
  }

  // ---- Driver flow ----
  if (view === 'driver-login') {
    return <DriverLogin onLogin={handleDriverLogin} onManagerLink={() => setView('manager-login')} />;
  }
  if (view === 'checkin') {
    return <CheckIn driver={driver} onDone={handleCheckinDone} onSkip={handleSkipCheckin} />;
  }
  if (view === 'risk-result') {
    return (
      <div className="checkin-screen">
        <div className="checkin-card">
          <RiskBanner risk={risk} onContinue={enterChat} />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header lang={lang} onLangChange={setLang} langOptions={LANG_OPTIONS} driver={driver} risk={risk} onLogout={logout} voice={voice} />

      {risk && risk.level !== 'Low' && (
        <div className="chat-risk-strip">
          <RiskBanner risk={risk} compact />
          <span>from your check-in today</span>
        </div>
      )}

      {fatigueBanner && (
        <div className="fatigue-alert">
          ⚠️ If you're currently driving, pull over safely now before continuing this chat.
        </div>
      )}

      {voice.supportError && (
        <div className="voice-error-strip">🎙️ {voice.supportError}</div>
      )}

      <div className="chat-wrap" ref={chatRef}>
        {messages.length === 0 && <Welcome cfg={cfg} onQuick={send} />}

        {messages.map((m, i) => (
          <Message key={i} role={m.role === 'assistant' ? 'ai' : 'user'} text={m.content} />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="msg ai">
            <div className="avatar ai">!</div>
            <div className="bubble">
              ⚠️ <strong>Error:</strong> {error}
            </div>
          </div>
        )}
      </div>

      <InputArea
        value={input}
        onChange={setInput}
        onSend={() => send()}
        disabled={isLoading}
        placeholder={cfg.placeholder}
        onMicClick={handleMicClick}
        isListening={voice.isListening}
        micSupported={voice.micSupported}
      />
    </div>
  );
}
