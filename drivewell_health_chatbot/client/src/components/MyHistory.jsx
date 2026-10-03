import { useEffect, useState } from 'react';
import { getCheckinHistory } from '../api/backend.js';
import RiskBanner from './RiskBanner.jsx';

export default function MyHistory({ driver, onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCheckinHistory(driver.id, 30)
      .then((data) => {
        if (!cancelled) setHistory(data.history || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [driver.id]);

  return (
    <div className="myhistory-screen">
      <div className="myhistory-header">
        <button className="myhistory-back" onClick={onBack}>← Back to chat</button>
        <h1>My check-in history</h1>
        <p className="myhistory-sub">Only visible to you — no one else can see this.</p>
      </div>

      {loading && <p className="manager-loading">Loading…</p>}
      {error && <div className="auth-error" style={{ margin: '0 24px' }}>⚠️ {error}</div>}

      {!loading && history.length === 0 && (
        <p className="manager-loading">No check-ins yet — they'll show up here after you complete one.</p>
      )}

      <div className="myhistory-list">
        {history.map((c) => (
          <div key={c.id} className="myhistory-item">
            <RiskBanner risk={c} compact />
            <div className="myhistory-item-details">
              <span className="myhistory-date">{c.createdAt}</span>
              <span>{c.sleepHours}h sleep · stress {c.stressLevel}/5</span>
              {c.symptoms?.length > 0 && <span>{c.symptoms.join(', ')}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
