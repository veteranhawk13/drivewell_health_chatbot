import { useState } from 'react';
import { submitCheckin } from '../api/backend.js';

const SYMPTOMS = [
  { key: 'headache', label: 'Headache' },
  { key: 'backPain', label: 'Back pain' },
  { key: 'neckPain', label: 'Neck pain' },
  { key: 'eyeStrain', label: 'Eye strain' },
  { key: 'nausea', label: 'Nausea' },
  { key: 'blurredVision', label: 'Blurred vision' },
  { key: 'dizziness', label: 'Dizziness / lightheadedness' },
  { key: 'chestPain', label: 'Chest pain or pressure' },
];

export default function CheckIn({ driver, onDone, onSkip }) {
  const [sleepHours, setSleepHours] = useState(7);
  const [stressLevel, setStressLevel] = useState(2);
  const [symptoms, setSymptoms] = useState([]);
  const [medication, setMedication] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSymptom = (key) => {
    setSymptoms((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]));
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { checkin, risk } = await submitCheckin(driver.id, {
        sleepHours,
        stressLevel,
        symptoms,
        medication,
      });
      onDone({ checkin, risk });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin-screen">
      <div className="checkin-card">
        <h1>Pre-shift check-in</h1>
        <p className="checkin-sub">Hey {driver.name.split(' ')[0]} — a few quick questions before you start driving.</p>

        <div className="checkin-field">
          <div className="checkin-label-row">
            <label>Hours of sleep last night</label>
            <span className="checkin-value">{sleepHours}h</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
          />
        </div>

        <div className="checkin-field">
          <div className="checkin-label-row">
            <label>Current stress level</label>
            <span className="checkin-value">{stressLevel}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={stressLevel}
            onChange={(e) => setStressLevel(Number(e.target.value))}
          />
        </div>

        <div className="checkin-field">
          <label>Any symptoms right now?</label>
          <div className="symptom-grid">
            {SYMPTOMS.map((s) => (
              <button
                type="button"
                key={s.key}
                className={`symptom-chip ${symptoms.includes(s.key) ? 'active' : ''}`}
                onClick={() => toggleSymptom(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <label className="checkin-checkbox">
          <input type="checkbox" checked={medication} onChange={(e) => setMedication(e.target.checked)} />
          I've taken medication that can cause drowsiness
        </label>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <div className="checkin-actions">
          <button className="checkin-skip" onClick={onSkip} type="button">
            Skip for now
          </button>
          <button className="checkin-submit" onClick={submit} disabled={loading} type="button">
            {loading ? 'Checking…' : 'Submit check-in'}
          </button>
        </div>
      </div>
    </div>
  );
}
