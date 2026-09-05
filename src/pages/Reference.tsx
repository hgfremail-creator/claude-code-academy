import { useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { COMMANDS, COMMAND_BY_ID } from '../content/commands';
import { fuzzyMatch } from '../lib/fuzzy';
import { Callout } from '../components/ui';

const CATS: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'starting', label: 'Starting' },
  { id: 'session', label: 'Session' },
  { id: 'context', label: 'Context' },
  { id: 'config', label: 'Config' },
  { id: 'review', label: 'Review' },
  { id: 'agents', label: 'Agents' },
  { id: 'mcp', label: 'MCP' },
  { id: 'automation', label: 'Automation' },
];

export default function Reference() {
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [openId, setOpenId] = useState<string | null>(params.get('cmd'));

  const list = useMemo(() => {
    return COMMANDS.filter((c) => (cat === 'all' || c.category === cat) && (!q || fuzzyMatch(q, `${c.name} ${c.summary} ${c.whatItDoes}`)));
  }, [q, cat]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Command Explorer</h1>
        <p className="mt-1 text-sm text-ink-faint">
          For each command: what it does, when to use it, a beginner and an advanced example, the common mistake, and related
          commands. Also: <Link to="/reference/cheatsheet" className="link">the cheat sheet</Link>.
        </p>
      </div>

      <Callout kind="warn" title="Version-sensitive by nature">
        Commands and flags change every few weeks. This is a teaching layer — the authoritative list for your install is{' '}
        <code>/help</code>, and the source of truth is the{' '}
        <a className="link" href="https://code.claude.com/docs/en/cli-reference" target="_blank" rel="noreferrer">CLI reference</a>.
      </Callout>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter commands…"
          className="w-full rounded-lg border border-line bg-bg-soft px-3 py-2 text-sm text-ink outline-none focus:border-brand/50 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-1.5">
          {CATS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`chip ${cat === c.id ? '!border-brand/50 !bg-brand/10 !text-brand-soft' : 'hover:bg-bg-hover'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {list.map((c) => {
          const open = openId === c.id;
          return (
            <div key={c.id} className="card overflow-hidden">
              <button onClick={() => setOpenId(open ? null : c.id)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-bg-hover">
                <code className="rounded bg-bg-soft px-2 py-1 font-mono text-[13px] text-brand-soft">{c.name}</code>
                <span className="min-w-0 flex-1 truncate text-sm text-ink-soft">{c.summary}</span>
                <span className="text-ink-faint">{open ? '▾' : '▸'}</span>
              </button>
              {open && (
                <div className="space-y-3 border-t border-line p-4 text-sm text-ink-soft">
                  <Row label="What it does">{c.whatItDoes}</Row>
                  <Row label="When to use it">{c.whenToUse}</Row>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-line bg-bg-soft p-3">
                      <div className="mb-1 text-[11px] font-semibold uppercase text-ink-faint">Beginner example</div>
                      <code className="block whitespace-pre-wrap font-mono text-[12px] text-ink">{c.beginnerExample}</code>
                    </div>
                    <div className="rounded-lg border border-line bg-bg-soft p-3">
                      <div className="mb-1 text-[11px] font-semibold uppercase text-ink-faint">Advanced example</div>
                      <code className="block whitespace-pre-wrap font-mono text-[12px] text-ink">{c.advancedExample}</code>
                    </div>
                  </div>
                  <div className="rounded-lg border border-bad/30 bg-bad/5 p-3 text-xs">
                    <span className="font-semibold text-bad">Common mistake — </span>{c.commonMistake}
                  </div>
                  {c.related.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-ink-faint">Related:</span>
                      {c.related.map((r) => (
                        <button key={r} onClick={() => setOpenId(r)} className="chip hover:bg-bg-hover">
                          {COMMAND_BY_ID[r]?.name ?? r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && <p className="text-sm text-ink-faint">No commands match.</p>}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-0.5 text-[11px] font-semibold uppercase text-ink-faint">{label}</div>
      <div>{children}</div>
    </div>
  );
}
