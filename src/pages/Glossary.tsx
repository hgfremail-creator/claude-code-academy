import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GLOSSARY, GLOSSARY_BY_ID } from '../content/glossary';
import { LESSON_BY_ID } from '../content/lessons';
import { fuzzyMatch } from '../lib/fuzzy';

export default function Glossary() {
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const focus = params.get('term');
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const list = useMemo(
    () => [...GLOSSARY].filter((t) => !q || fuzzyMatch(q, `${t.term} ${t.definition}`)).sort((a, b) => a.term.localeCompare(b.term)),
    [q],
  );

  useEffect(() => {
    if (focus && refs.current[focus]) {
      refs.current[focus]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focus]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Glossary</h1>
        <p className="mt-1 text-sm text-ink-faint">{GLOSSARY.length} terms. Each links to the lessons where it matters.</p>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search terms… (typos ok)"
        className="w-full rounded-lg border border-line bg-bg-soft px-3 py-2 text-sm text-ink outline-none focus:border-brand/50 sm:max-w-sm"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((t) => (
          <div
            key={t.id}
            ref={(el) => { refs.current[t.id] = el; }}
            className={`card p-4 ${focus === t.id ? 'ring-1 ring-brand/50' : ''}`}
          >
            <div className="text-sm font-semibold text-ink">{t.term}</div>
            <p className="mt-1 text-sm text-ink-soft">{t.definition}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              {t.seeAlso.map((s) => GLOSSARY_BY_ID[s] && (
                <Link key={s} to={`/glossary?term=${s}`} className="chip hover:bg-bg-hover">{GLOSSARY_BY_ID[s].term}</Link>
              ))}
              {t.lessons.map((l) => LESSON_BY_ID[l] && (
                <Link key={l} to={`/learn/${l}`} className="chip !border-brand/30 !text-brand-soft hover:bg-bg-hover">
                  📖 {LESSON_BY_ID[l].title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="text-sm text-ink-faint">No terms match.</p>}
    </div>
  );
}
