import { renderMarkdown } from '../utils/markdown.js';

export default function Message({ role, text }) {
  return (
    <div className={`msg ${role}`}>
      <div className={`avatar ${role}`}>
        {role === 'ai' ? (
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
        ) : (
          'ME'
        )}
      </div>
      {/* Trusted content only: model output is prompted to use a small markdown
          subset and is rendered via renderMarkdown, never raw user HTML. */}
      <div className="bubble" dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
    </div>
  );
}
