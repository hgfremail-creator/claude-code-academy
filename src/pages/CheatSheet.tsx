import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CHEATSHEET, CHEAT_SECTIONS } from '../content/cheatsheet';
import { useProgress } from '../store/progress';
import { fuzzyMatch } from '../lib/fuzzy';


export default function CheatSheet() {
  const { state, dispatch } = useProgress();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [favOnly, setFavOnly] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const items = useMemo(
    () => CHEATSHEET.filter((c) => (!q || fuzzyMatch(q, `${c.command} ${c.description} ${c.section}`)) && (!favOnly || state.bookmarks.includes('cheat:' + c.id))),
    [q, favOnly, state.bookmarks],
  );

  function copy(text: string, id: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1200);
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Cheat Sheet</h1>
        <p className="mt-1 text-sm text-ink-faint">Search, filter, favorite, and copy. Version-sensitive — verify with <code>/help</code>.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the cheat sheet… (typos ok)"
          className="w-full rounded-lg border border-line bg-bg-soft px-3 py-2 text-sm text-ink outline-none focus:border-brand/50 sm:max-w-sm"
        />
        <label className="flex items-center gap-2 text-xs text-ink-soft">
          <input type="checkbox" checked={favOnly} onChange={(e) => setFavOnly(e.target.checked)} className="accent-brand" />
          Favorites only
        </label>
      </div>

      {CHEAT_SECTIONS.map((section) => {
        const rows = items.filter((c) => c.section === section);
        if (!rows.length) return null;
        return (
          <div key={section} className="card overflow-hidden">
            <div className="border-b border-line bg-bg-soft px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {section}
            </div>
            <div>
              {rows.map((c) => {
                const favId = 'cheat:' + c.id;
                const fav = state.bookmarks.includes(favId);
                return (
                  <div key={c.id} className="flex items-start gap-3 border-b border-line px-4 py-2.5 last:border-0 hover:bg-bg-hover">
                    <button onClick={() => dispatch({ type: 'bookmark/toggle', id: favId })} className="mt-0.5 text-sm text-ink-faint hover:text-warn" aria-label="favorite">
                      {fav ? '★' : '☆'}
                    </button>
                    <code className="min-w-0 flex-1 whitespace-pre-wrap font-mono text-[12.5px] text-brand-soft">{c.command}</code>
                    <span className="hidden max-w-[45%] text-xs text-ink-soft sm:block">{c.description}</span>
                    <button onClick={() => copy(c.command, c.id)} className="btn-ghost btn-sm shrink-0">
                      {copied === c.id ? 'copied' : 'copy'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {items.length === 0 && <p className="text-sm text-ink-faint">Nothing matches.</p>}
    </div>
  );
}
