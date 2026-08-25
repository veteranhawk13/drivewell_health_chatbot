import { useEffect, useState } from 'react';
import { getManagerOverview, getManagerDriverDetail, clearAllData } from '../api/backend.js';
import RiskBanner from './RiskBanner.jsx';

export default function ManagerDashboard({ passcode, onBack }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { drivers } = await getManagerOverview(passcode);
      setDrivers(drivers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDriver = async (id) => {
    setSelected(id);
    setDetail(null);
    try {
      const { driver } = await getManagerDriverDetail(passcode, id);
      setDetail(driver);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('This permanently deletes ALL drivers, check-ins, and chat flags. Continue?')) return;
    try {
      await clearAllData(passcode);
      setSelected(null);
      setDetail(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const sorted = [...drivers].sort((a, b) => {
    const rank = { High: 0, Moderate: 1, Low: 2 };
    const ra = a.latestCheckin ? rank[a.latestCheckin.level] : 3;
    const rb = b.latestCheckin ? rank[b.latestCheckin.level] : 3;
    return ra - rb;
  });

  return (
    <div className="manager-screen">
      <div className="manager-header">
        <h1>Fleet risk overview</h1>
        <div className="manager-header-actions">
          <button className="manager-refresh" onClick={load}>Refresh</button>
          <button className="manager-clear-all" onClick={handleClearAll}>Clear all data</button>
          <button className="manager-back" onClick={onBack}>← Log out</button>
        </div>
      </div>

      {error && <div className="auth-error" style={{ margin: '0 24px' }}>⚠️ {error}</div>}
      {loading && <p className="manager-loading">Loading drivers…</p>}

      {!loading && sorted.length === 0 && (
        <p className="manager-loading">No drivers have registered yet.</p>
      )}

      <div className="manager-grid">
        <div className="manager-list">
          {sorted.map((d) => (
            <button key={d.id} className={`driver-row ${selected === d.id ? 'active' : ''}`} onClick={() => openDriver(d.id)}>
              <div className="driver-row-name">{d.name}</div>
              {d.latestCheckin ? (
                <RiskBanner risk={d.latestCheckin} compact />
              ) : (
                <span className="risk-pill risk-none">No check-in yet</span>
              )}
              {(d.riskFlags7d > 0 || d.chatFlags7d > 0) && (
                <div className="driver-row-flags">
                  {d.riskFlags7d > 0 && <span>{d.riskFlags7d} risk check-in{d.riskFlags7d > 1 ? 's' : ''} (7d)</span>}
                  {d.chatFlags7d > 0 && <span>{d.chatFlags7d} chat flag{d.chatFlags7d > 1 ? 's' : ''} (7d)</span>}
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="manager-detail">
          {!selected && <p className="manager-loading">Select a driver to see their history.</p>}
          {selected && !detail && <p className="manager-loading">Loading…</p>}
          {detail && (
            <>
              <h2>{detail.name}</h2>
              <h3>Recent check-ins</h3>
              {detail.checkins.length === 0 && <p className="manager-loading">No check-ins yet.</p>}
              <div className="history-list">
                {detail.checkins.map((c) => (
                  <div key={c.id} className={`history-row level-${c.level.toLowerCase()}`}>
                    <div className="history-row-top">
                      <span className="risk-pill compact-inline">{c.level}</span>
                      <span className="history-date">{c.createdAt}</span>
                    </div>
                    <div className="history-row-details">
                      {c.sleepHours}h sleep · stress {c.stressLevel}/5
                      {c.symptoms.length > 0 ? ` · ${c.symptoms.join(', ')}` : ''}
                    </div>
                  </div>
                ))}
              </div>

              {detail.chatFlags.length > 0 && (
                <>
                  <h3>Chat fatigue flags</h3>
                  <div className="history-list">
                    {detail.chatFlags.map((f) => (
                      <div key={f.id} className="history-row level-high">
                        <div className="history-row-top">
                          <span className="risk-pill compact-inline">Flagged: "{f.matched_keyword}"</span>
                          <span className="history-date">{f.created_at}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
