import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/UI/Icon';
import { useUiStore } from '@/store/uiStore';
import { useIssues } from '@/features/issues/hooks';
import { truncate } from '@/lib/formatters';

interface CommandPaletteProps {
  onCreate: () => void;
}

interface Command {
  group: string;
  label: string;
  hint?: string;
  action: () => void;
}

export function CommandPalette({ onCreate }: CommandPaletteProps) {
  const open = useUiStore((s) => s.commandPaletteOpen);
  const close = useUiStore((s) => s.closeCommandPalette);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const issuesQuery = useIssues({ page: 1, limit: 10, sortBy: 'updatedAt', sortOrder: 'desc' });
  const recentIssues = issuesQuery.data?.data ?? [];

  const commands: Command[] = useMemo(
    () => [
      {
        group: 'Navigation',
        label: 'Go to Dashboard',
        hint: 'G then D',
        action: () => navigate('/dashboard'),
      },
      {
        group: 'Navigation',
        label: 'Go to Issues',
        hint: 'G then I',
        action: () => navigate('/issues'),
      },
      {
        group: 'Actions',
        label: 'Create new issue',
        hint: 'C',
        action: onCreate,
      },
      ...recentIssues.map((i) => ({
        group: 'Issues',
        label: `${i.id.slice(0, 8)} — ${truncate(i.title, 60)}`,
        action: () => navigate(`/issues/${i.id}`),
      })),
    ],
    [navigate, onCreate, recentIssues],
  );

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  useEffect(() => {
    setActive(0);
  }, [query, filtered.length]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActive(0);
    }
  }, [open]);

  if (!open) return null;

  const run = (cmd: Command) => {
    cmd.action();
    close();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter' && filtered[active]) {
      e.preventDefault();
      run(filtered[active]);
    } else if (e.key === 'Escape') {
      close();
    }
  };

  const groups: Record<string, Command[]> = {};
  filtered.forEach((c) => {
    (groups[c.group] = groups[c.group] ?? []).push(c);
  });
  let flatIdx = 0;

  return (
    <div className="scrim" onClick={close} style={{ alignItems: 'flex-start' }}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <input
          className="cmdk-input"
          autoFocus
          placeholder="Type a command or search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
        />
        <div className="cmdk-list">
          {filtered.length === 0 ? (
            <div className="empty" style={{ padding: 24 }}>
              <div className="text-sm">No matches for "{query}"</div>
            </div>
          ) : (
            Object.entries(groups).map(([groupName, items]) => (
              <div key={groupName}>
                <div className="cmdk-group-title">{groupName}</div>
                {items.map((c) => {
                  const idx = flatIdx++;
                  return (
                    <div
                      key={`${groupName}-${c.label}`}
                      className="cmdk-item"
                      data-active={idx === active}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => run(c)}
                    >
                      <Icon.ChevRight
                        size={14}
                        style={{ color: 'var(--fg-subtle)' }}
                      />
                      <span>{c.label}</span>
                      {c.hint && <span className="cmdk-hint">{c.hint}</span>}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div
          className="row-sb"
          style={{
            padding: '8px 14px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-subtle)',
            fontSize: 11,
            color: 'var(--fg-subtle)',
          }}
        >
          <div className="row gap-3">
            <span className="row gap-2">
              <span className="kbd">↑↓</span> navigate
            </span>
            <span className="row gap-2">
              <span className="kbd">↵</span> select
            </span>
            <span className="row gap-2">
              <span className="kbd">Esc</span> close
            </span>
          </div>
          <span className="mono">IssueFlow</span>
        </div>
      </div>
    </div>
  );
}
