import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TROUBLESHOOTING, TS_CATEGORIES } from '../content/troubleshooting';
import { fuzzyMatch } from '../lib/fuzzy';
import { Pill } from '../components/ui';

export default function Troubleshooting() {
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [openId, setOpenId] = useState<string | null>(params.get('id'));

  const list = useMemo(
    () => TROUBLESHOOTING.filter((t) => (cat === 'All' || t.category === cat) && (!q || fuzzyMatch(q, `${t.symptom} ${t.causes.join(' ')} ${t.solution} ${t.category}`))),
    [q, cat],
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Troubleshooting Lab</h1>
        <p className="mt-1 text-sm text-ink-faint">
          {TROUBLESHOOTING.length} issues, each with symptom → causes → diagnostic steps → solution → prevention.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Describe the symptom… (typos ok)"
          className="w-full rounded-lg border border-line bg-bg-soft px-3 py-2 text-sm text-ink outline-none focus:border-brand/50 sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-1.5">
          {['All', ...TS_CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`chip ${cat === c ? '!border-brand/50 !bg-brand/10 !text-brand-soft' : 'hover:bg-bg-hover'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {list.map((t) => {
          const open = openId === t.id;
          return (
            <div key={t.id} className="card overflow-hidden">
              <button onClick={() => setOpenId(open ? null : t.id)} className="flex w-full items-start gap-3 p-4 text-left hover:bg-bg-hover">
                <Pill>{t.category}</Pill>
                <span className="min-w-0 flex-1 text-sm font-medium text-ink">{t.symptom}</span>
                <span className="text-ink-faint">{open ? '▾' : '▸'}</span>
              </button>
              {open && (
                <div className="space-y-3 border-t border-line p-4 text-sm text-ink-soft">
                  <Block label="Likely causes"><ul className="list-disc space-y-1 pl-5">{t.causes.map((c, i) => <li key={i}>{c}</li>)}</ul></Block>
                  <Block label="Diagnostic steps"><ol className="list-decimal space-y-1 pl-5">{t.diagnostics.map((c, i) => <li key={i}>{c}</li>)}</ol></Block>
                  <Block label="Solution" tone="ok">{t.solution}</Block>
                  <Block label="Prevention" tone="accent">{t.prevention}</Block>
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && <p className="text-sm text-ink-faint">No matches. Try describing it differently.</p>}
      </div>
    </div>
  );
}

function Block({ label, children, tone }: { label: string; children: ReactNode; tone?: 'ok' | 'accent' }) {
  const border = tone === 'ok' ? 'border-ok/30 bg-ok/5' : tone === 'accent' ? 'border-accent/30 bg-accent/5' : 'border-line bg-bg-soft';
  return (
    <div className={`rounded-lg border p-3 ${border}`}>
      <div className="mb-1 text-[11px] font-semibold uppercase text-ink-faint">{label}</div>
      <div>{children}</div>
    </div>
  );
}
