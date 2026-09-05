import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PROJECTS, PROJECT_TIERS } from '../content/projects';
import { SKILL_LABEL } from '../content/skills';
import { useProgress } from '../store/progress';
import { Pill } from '../components/ui';

const TIER_LABEL: Record<string, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', expert: 'Expert' };

export default function Projects() {
  const { state, dispatch } = useProgress();
  const [params] = useSearchParams();
  const [openId, setOpenId] = useState<string | null>(params.get('id'));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Project Library</h1>
        <p className="mt-1 text-sm text-ink-faint">
          16 projects, rising in difficulty. Each has requirements, constraints, a suggested workflow, hidden tests, evaluation
          criteria, hints, a solution strategy, and reflection questions. Do them <em>with</em> Claude Code — the methodology is the point.
        </p>
      </div>

      {PROJECT_TIERS.map((tier) => (
        <div key={tier}>
          <div className="mb-2 mt-4 flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">{TIER_LABEL[tier]}</h2>
            <div className="h-px flex-1 bg-line" />
          </div>
          <div className="space-y-3">
            {PROJECTS.filter((p) => p.tier === tier).map((p) => {
              const open = openId === p.id;
              const notesKey = `project:${p.id}:reflect`;
              return (
                <div key={p.id} className="card overflow-hidden">
                  <button onClick={() => setOpenId(open ? null : p.id)} className="flex w-full items-start gap-3 p-4 text-left hover:bg-bg-hover">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">{p.title}</span>
                      <span className="block text-xs text-ink-soft">{p.summary}</span>
                    </span>
                    <span className="text-ink-faint">{open ? '▾' : '▸'}</span>
                  </button>
                  {open && (
                    <div className="space-y-4 border-t border-line p-4 text-sm text-ink-soft">
                      <div className="flex flex-wrap gap-1.5">
                        {p.skills.map((s) => <span key={s} className="chip">{SKILL_LABEL[s]}</span>)}
                      </div>
                      <Section title="Requirements" items={p.requirements} />
                      <Section title="Constraints" items={p.constraints} tone="warn" />
                      <Section title="Suggested workflow" items={p.suggestedWorkflow} ordered />
                      <details className="rounded-lg border border-line bg-bg-soft p-3">
                        <summary className="cursor-pointer text-xs font-semibold uppercase text-ink-faint">Hidden tests (peek only when stuck)</summary>
                        <ul className="mt-2 space-y-1">{p.hiddenTests.map((t, i) => <li key={i}>· {t}</li>)}</ul>
                      </details>
                      <Section title="Evaluation criteria" items={p.evaluationCriteria} tone="ok" />
                      <details className="rounded-lg border border-line bg-bg-soft p-3">
                        <summary className="cursor-pointer text-xs font-semibold uppercase text-ink-faint">Hints</summary>
                        <ul className="mt-2 space-y-1">{p.hints.map((t, i) => <li key={i}>· {t}</li>)}</ul>
                      </details>
                      <details className="rounded-lg border border-line bg-bg-soft p-3">
                        <summary className="cursor-pointer text-xs font-semibold uppercase text-ink-faint">Solution strategy</summary>
                        <p className="mt-2">{p.solutionStrategy}</p>
                      </details>
                      <div>
                        <div className="mb-1 text-xs font-semibold uppercase text-ink-faint">Reflection</div>
                        <ul className="mb-2 space-y-1">{p.reflectionQuestions.map((q, i) => <li key={i}>· {q}</li>)}</ul>
                        <textarea
                          defaultValue={state.notes[notesKey] ?? ''}
                          onBlur={(e) => dispatch({ type: 'note/set', id: notesKey, text: e.target.value })}
                          rows={3}
                          placeholder="Your reflections (saved locally)…"
                          className="w-full rounded-lg border border-line bg-bg-soft p-2.5 text-sm text-ink outline-none focus:border-brand/50"
                        />
                      </div>
                      <button
                        className={state.challenges[p.id]?.completed ? 'btn-ghost btn-sm' : 'btn-primary btn-sm'}
                        onClick={() => dispatch({ type: 'challenge/complete', challengeId: p.id, skills: p.skills, reflection: state.notes[notesKey] })}
                      >
                        {state.challenges[p.id]?.completed ? '✓ Marked complete' : 'Mark project complete (+XP)'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({ title, items, ordered, tone }: { title: string; items: string[]; ordered?: boolean; tone?: 'ok' | 'warn' }) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase text-ink-faint">
        {tone && <Pill tone={tone}>{title}</Pill>}
        {!tone && title}
      </div>
      <List className={`${ordered ? 'list-decimal' : 'list-disc'} space-y-1 pl-5`}>
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </List>
    </div>
  );
}
