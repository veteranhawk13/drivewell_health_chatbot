import { renderMarkdown } from '../utils/markdown.js';

export default function Message({ role, text }) {
  const isAi = role === 'ai';
  return (
    <div className={`msg ${role}`}>
      {isAi && <div className="avatar ai">AI</div>}
      {isAi ? (
        <div className="bubble" dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
      ) : (
        <div className="bubble">{text}</div>
      )}
      {!isAi && <div className="avatar user">ME</div>}
    </div>
  );
}
