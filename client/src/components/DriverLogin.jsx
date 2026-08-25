import { useState } from 'react';
import { registerDriver, loginDriver } from '../api/backend.js';

export default function DriverLogin({ onLogin, onManagerLink }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || pin.length < 4) {
      setError('Enter your name and a PIN of at least 4 digits.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { driver } = mode === 'login' ? await loginDriver(name, pin) : await registerDriver(name, pin);
      onLogin(driver);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
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
        <h1>DriveWell AI</h1>
        <p className="auth-sub">{mode === 'login' ? 'Log in to check in and chat' : 'Create your driver account'}</p>

        <form onSubmit={submit} className="auth-form">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoFocus />
          </label>
          <label>
            PIN
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="4+ digit PIN"
            />
          </label>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <button className="auth-toggle" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}>
          {mode === 'login' ? "New driver? Create an account" : 'Already have an account? Log in'}
        </button>

        <button className="auth-manager-link" onClick={onManagerLink}>
          Fleet manager? Open dashboard →
        </button>
      </div>
    </div>
  );
}
