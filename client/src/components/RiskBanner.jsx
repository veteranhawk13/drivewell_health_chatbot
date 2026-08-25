const LEVEL_CONFIG = {
  Low: { className: 'risk-low', icon: '✓', title: 'Low risk' },
  Moderate: { className: 'risk-moderate', icon: '!', title: 'Moderate risk' },
  High: { className: 'risk-high', icon: '⛔', title: 'High risk' },
};

export default function RiskBanner({ risk, compact, onContinue }) {
  if (!risk) return null;
  const cfg = LEVEL_CONFIG[risk.level] || LEVEL_CONFIG.Low;

  if (compact) {
    return (
      <div className={`risk-pill ${cfg.className}`}>
        <span className="risk-pill-icon">{cfg.icon}</span>
        {cfg.title}
      </div>
    );
  }

  return (
    <div className={`risk-banner ${cfg.className}`}>
      <div className="risk-banner-head">
        <span className="risk-banner-icon">{cfg.icon}</span>
        <h2>{cfg.title}{risk.urgent ? ' — urgent' : ''}</h2>
      </div>
      <p className="risk-recommendation">{risk.recommendation}</p>

      {risk.factors?.length > 0 && (
        <details className="risk-factors">
          <summary>What factored into this ({risk.factors.length})</summary>
          <ul>
            {risk.factors.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </details>
      )}

      {onContinue && (
        <button className="risk-continue" onClick={onContinue}>
          {risk.level === 'High' ? 'I understand — continue anyway' : 'Continue to chat'}
        </button>
      )}
    </div>
  );
}
