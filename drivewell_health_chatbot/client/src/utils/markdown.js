// Minimal, safe-ish markdown renderer for chat bubbles: bold, bullet lists, line breaks.
// Not a full markdown parser — just enough for the AI's typical reply formatting.
export function renderMarkdown(text) {
  if (!text) return '';

  const escapeHtml = (s) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const lines = escapeHtml(text).split('\n');
  let html = '';
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const isBullet = /^[-*]\s+/.test(line);

    if (isBullet) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${inlineFormat(line.replace(/^[-*]\s+/, ''))}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      if (line) {
        html += `<p>${inlineFormat(line)}</p>`;
      }
    }
  }
  if (inList) html += '</ul>';

  return html;
}

function inlineFormat(str) {
  return str.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
