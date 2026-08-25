export default function Header({ lang, onLangChange, langOptions, driver, risk, onLogout, voice }) {
  return (
    <div className="header">
      <div className="logo-ring">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
            stroke="#00e5a0"
            strokeWidth="1.5"
          />
          <path
            d="M8 12h1.5l1.5-4 2 8 1.5-4H17"
            stroke="#00e5a0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="header-info">
        <h1>DriveWell AI</h1>
        <p>{driver ? `Hi, ${driver.name.split(' ')[0]}` : 'Driver Health & Wellness Assistant'}</p>
      </div>
      <div className="header-right">
        {voice?.speechSupported && (
          <button
            className={`voice-toggle-btn ${voice.voiceReplyEnabled ? 'active' : ''}`}
            onClick={() => {
              if (voice.voiceReplyEnabled) voice.stopSpeaking();
              voice.setVoiceReplyEnabled(!voice.voiceReplyEnabled);
            }}
            title={voice.voiceReplyEnabled ? 'Voice replies on — click to mute' : 'Voice replies off — click to enable'}
          >
            {voice.voiceReplyEnabled ? '🔊' : '🔇'}
          </button>
        )}
        <div className="lang-wrap">
          <select
            id="lang-select"
            value={lang}
            onChange={(e) => onLangChange(e.target.value)}
            title="Select language"
          >
            {langOptions.map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
          <span className="lang-arrow">▼</span>
        </div>
        <div className="status-dot">
          <div className="dot"></div> Online
        </div>
        {onLogout && (
          <button className="logout-btn" onClick={onLogout} title="Log out">
            Log out
          </button>
        )}
      </div>
    </div>
  );
}
