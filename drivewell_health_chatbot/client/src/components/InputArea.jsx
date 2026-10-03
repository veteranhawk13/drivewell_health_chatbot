import { useRef } from 'react';

export default function InputArea({
  value,
  onChange,
  onSend,
  disabled,
  placeholder,
  onMicClick,
  isListening,
  micSupported,
}) {
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    onChange(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 100) + 'px';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="input-area">
      <div className="input-row">
        {micSupported && (
          <button
            type="button"
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={onMicClick}
            title={isListening ? 'Stop listening' : 'Speak your message'}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M19 11a7 7 0 01-14 0M12 18v3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        <textarea
          ref={textareaRef}
          id="user-input"
          rows={1}
          placeholder={isListening ? 'Listening…' : placeholder}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        <button className="send-btn" onClick={onSend} disabled={disabled}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="#0d1117" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M22 2L15 22l-4-9-9-4 20-7z"
              stroke="#0d1117"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="input-hint">
        Not medical advice &middot; Consult a doctor for serious symptoms &middot; Call emergency services if needed
      </div>
    </div>
  );
}
