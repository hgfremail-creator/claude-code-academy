import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search } from '../engine/search';
import { Pill } from './ui';

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => search(q), [q]);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  function go(to: string) {
    onClose();
    navigate(to);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[10vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="text-ink-faint">⌕</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              if (e.key === 'Enter' && results[active]) go(results[active].to);
              if (e.key === 'Escape') onClose();
            }}
            placeholder="Search lessons, commands, concepts, troubleshooting… (typos ok)"
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <kbd className="kbd">Esc</kbd>
        </div>
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {q && results.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-ink-faint">No matches. Try fewer or different words.</div>
          )}
          {!q && (
            <div className="px-3 py-6 text-center text-sm text-ink-faint">
              Type to search everything — lessons, the Command Explorer, the glossary, troubleshooting, scenarios, projects.
            </div>
          )}
          {results.map((r, i) => (
            <button
              key={`${r.kind}-${r.id}`}
              onClick={() => go(r.to)}
              onMouseEnter={() => setActive(i)}
              className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left ${i === active ? 'bg-bg-hover' : ''}`}
            >
              <Pill>{r.kind}</Pill>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">{r.title}</span>
                <span className="block truncate text-xs text-ink-faint">{r.subtitle}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
