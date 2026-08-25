export default function Welcome({ cfg, onQuick }) {
  return (
    <div className="welcome">
      <div className="welcome-icon">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
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
      <h2>{cfg.welcomeTitle}</h2>
      <p>{cfg.welcomeDesc}</p>
      <div className="welcome-chips">
        {cfg.chips.map((q, i) => (
          <div key={i} className="welcome-chip" onClick={() => onQuick(q)}>
            {cfg.chipLabels[i]}
          </div>
        ))}
      </div>
    </div>
  );
}
