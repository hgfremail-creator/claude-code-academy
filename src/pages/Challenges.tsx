import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CHALLENGES } from '../content/challenges';
import { SKILL_LABEL } from '../content/skills';
import { useProgress } from '../store/progress';
import { Pill, Callout } from '../components/ui';
import { todayISO } from '../lib/storage';

function dailyId() {
  const d = todayISO();
  let h = 0;
  for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) >>> 0;
  const daily = CHALLENGES.filter((c) => c.pool === 'daily');
  return daily[h % daily.length].id;
}

export default function Challenges() {
  const { state, dispatch } = useProgress();
  const [params] = useSearchParams();
  const [pool, setPool] = useState<'daily' | 'weekly' | 'library'>('daily');
  const [openId, setOpenId] = useState<string | null>(params.get('id'));
  const dId = useMemo(dailyId, []);

  const list = CHALLENGES.filter((c) => c.pool === pool);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Challenges</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Applied judgment drills. Each has a scenario, an objective, hints, a solution strategy, and reflection questions.
        </p>
      </div>

      <Callout kind="tip" title="Today's daily challenge">
        <button className="link" onClick={() => { setPool('daily'); setOpenId(dId); }}>
          {CHALLENGES.find((c) => c.id === dId)?.title}
        </button>{' '}
        — {state.dailyDoneDates.includes(todayISO()) ? 'done today ✓' : 'not done yet'}.
      </Callout>

      <div className="flex gap-1.5">
        {(['daily', 'weekly', 'library'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPool(p)}
            className={`chip capitalize ${pool === p ? '!border-brand/50 !bg-brand/10 !text-brand-soft' : 'hover:bg-bg-hover'}`}
          >
            {p} ({CHALLENGES.filter((c) => c.pool === p).length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((ch) => {
          const open = openId === ch.id;
          const done = state.challenges[ch.id]?.completed;
          const notesKey = `challenge:${ch.id}:reflect`;
          return (
            <div key={ch.id} className="card overflow-hidden">
              <button onClick={() => setOpenId(open ? null : ch.id)} className="flex w-full items-start gap-3 p-4 text-left hover:bg-bg-hover">
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{ch.title}</span>
                    {ch.id === dId && ch.pool === 'daily' && <Pill tone="brand">today</Pill>}
                    {done && <Pill tone="ok">done</Pill>}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-soft">{ch.scenario}</span>
                </span>
                <Pill>{ch.difficulty}</Pill>
                <span className="text-ink-faint">{open ? '▾' : '▸'}</span>
              </button>
              {open && (
                <div className="space-y-4 border-t border-line p-4 text-sm text-ink-soft">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-ink-faint">Objective</div>
                    <p>{ch.objective}</p>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-ink-faint">Instructions</div>
                    <ol className="list-decimal space-y-1 pl-5">{ch.instructions.map((i, k) => <li key={k}>{i}</li>)}</ol>
                  </div>
                  <details className="rounded-lg border border-line bg-bg-soft p-3">
                    <summary className="cursor-pointer text-xs font-semibold uppercase text-ink-faint">Hints</summary>
                    <ul className="mt-2 space-y-1">{ch.hints.map((h, k) => <li key={k}>· {h}</li>)}</ul>
                  </details>
                  <details className="rounded-lg border border-line bg-bg-soft p-3">
                    <summary className="cursor-pointer text-xs font-semibold uppercase text-ink-faint">Solution strategy</summary>
                    <p className="mt-2">{ch.solutionStrategy}</p>
                  </details>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase text-ink-faint">Reflection</div>
                    <ul className="mb-2 space-y-1">{ch.reflectionQuestions.map((q, k) => <li key={k}>· {q}</li>)}</ul>
                    <textarea
                      defaultValue={state.notes[notesKey] ?? ''}
                      onBlur={(e) => dispatch({ type: 'note/set', id: notesKey, text: e.target.value })}
                      rows={3}
                      placeholder="Your answer (saved locally)…"
                      className="w-full rounded-lg border border-line bg-bg-soft p-2.5 text-sm text-ink outline-none focus:border-brand/50"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ch.skills.map((s) => <span key={s} className="chip">{SKILL_LABEL[s]}</span>)}
                  </div>
                  <button
                    className={done ? 'btn-ghost btn-sm' : 'btn-primary btn-sm'}
                    onClick={() => {
                      dispatch({ type: 'challenge/complete', challengeId: ch.id, skills: ch.skills, reflection: state.notes[notesKey] });
                      if (ch.id === dId) dispatch({ type: 'daily/done', date: todayISO() });
                    }}
                  >
                    {done ? '✓ Completed' : 'Mark complete (+XP)'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
