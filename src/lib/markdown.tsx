import { type ReactNode } from 'react';

function renderInline(s: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|_([^_]+)_/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = re.exec(s)) !== null) {
    if (match.index > last) {
      parts.push(s.slice(last, match.index));
    }
    if (match[1]) parts.push(<code key={k++}>{match[1]}</code>);
    else if (match[2]) parts.push(<b key={k++}>{match[2]}</b>);
    else if (match[3]) {
      parts.push(
        <i key={k++} style={{ color: 'var(--fg-subtle)' }}>
          {match[3]}
        </i>,
      );
    }
    last = re.lastIndex;
  }
  if (last < s.length) parts.push(s.slice(last));
  return parts;
}

export function renderMarkdown(md: string): ReactNode[] {
  const blocks = md.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith('```')) {
      const code = block.replace(/^```\w*\n?/, '').replace(/```$/, '');
      return <pre key={i}>{code}</pre>;
    }
    if (block.startsWith('### ')) return <h3 key={i}>{renderInline(block.slice(4))}</h3>;
    if (block.startsWith('## ')) return <h3 key={i}>{renderInline(block.slice(3))}</h3>;
    if (block.startsWith('- ')) {
      const items = block.split('\n').map((l) => l.replace(/^- /, ''));
      return (
        <ul key={i}>
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    }
    return <p key={i}>{renderInline(block)}</p>;
  });
}
