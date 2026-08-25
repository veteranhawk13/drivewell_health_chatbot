import { useState } from 'react';
import { managerLogin } from '../api/backend.js';

export default function ManagerLogin({ onLogin, onBack }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!passcode) return;
    setLoading(true);
    setError(null);
    try {
      await managerLogin(passcode);
      onLogin(passcode);
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
            <path d="M4 21V9l8-6 8 6v12" stroke="#00e5a0" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 21v-6h6v6" stroke="#00e5a0" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
        <h1>Manager Dashboard</h1>
        <p className="auth-sub">Enter the fleet passcode to view driver risk flags</p>

        <form onSubmit={submit} className="auth-form">
          <label>
            Passcode
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Manager passcode"
              autoFocus
            />
          </label>
          {error && <div className="auth-error">⚠️ {error}</div>}
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Checking…' : 'View dashboard'}
          </button>
        </form>

        <button className="auth-manager-link" onClick={onBack}>
          ← Back to driver login
        </button>
      </div>
    </div>
  );
}
