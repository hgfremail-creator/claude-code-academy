import { useState } from 'react';
import { PROMPT_TASKS } from '../content/promptLab';
import { useProgress } from '../store/progress';
import { scorePrompt, type PromptScore } from '../engine/promptScorer';
import { Pill, ProgressBar, Callout } from '../components/ui';

export default function PromptLab() {
  const { state, dispatch } = useProgress();
  const [taskId, setTaskId] = useState(PROMPT_TASKS[0].id);
  const [text, setText] = useState('');
  const [result, setResult] = useState<PromptScore | null>(null);
  const [showModel, setShowModel] = useState(false);

  const task = PROMPT_TASKS.find((t) => t.id === taskId)!;
  const rec = state.promptLab[taskId];

  function evaluate() {
    const r = scorePrompt(task, text);
    setResult(r);
    dispatch({ type: 'promptlab/run', taskId, score: r.total });
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Prompt Lab</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Write the prompt you would actually send Claude Code. The scorer is a heuristic coach — it rewards the signals of a strong
          agent prompt, not exact wording.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PROMPT_TASKS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTaskId(t.id); setText(''); setResult(null); setShowModel(false); }}
            className={`chip ${taskId === t.id ? '!border-brand/50 !bg-brand/10 !text-brand-soft' : 'hover:bg-bg-hover'}`}
          >
            {t.title}
            {state.promptLab[t.id]?.bestScore ? <span className="ml-1 text-ink-faint">· {state.promptLab[t.id].bestScore}</span> : null}
          </button>
        ))}
      </div>

      <div className="card p-5">
        <div className="mb-1 flex items-center gap-2">
          <Pill tone="brand">Task</Pill>
          {rec?.bestScore ? <Pill tone={rec.bestScore >= 80 ? 'ok' : 'warn'}>best {rec.bestScore}/100</Pill> : null}
        </div>
        <h2 className="text-base font-semibold text-ink">{task.title}</h2>
        <p className="mt-1 text-sm text-ink-soft">{task.brief}</p>
        <div className="mt-3 rounded-lg border border-line bg-bg-soft p-3 text-sm text-ink-soft">{task.context}</div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="Your prompt to Claude Code…"
          className="mt-4 w-full rounded-lg border border-line bg-bg-soft p-3 font-mono text-[13px] text-ink outline-none focus:border-brand/50"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="btn-primary" disabled={text.trim().length < 10} onClick={evaluate}>
            Evaluate prompt
          </button>
          <button className="btn-ghost btn-sm" onClick={() => setShowModel((s) => !s)}>
            {showModel ? 'Hide' : 'Show'} a strong example
          </button>
          <span className="text-xs text-ink-faint">{text.trim().split(/\s+/).filter(Boolean).length} words</span>
        </div>
        {showModel && (
          <div className="mt-3 rounded-lg border border-ok/30 bg-ok/5 p-3 text-sm text-ink-soft">
            <div className="mb-1 text-xs font-semibold uppercase text-ok">One strong version</div>
            {task.sampleStrongPrompt}
          </div>
        )}
      </div>

      {result && (
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Prompt quality</h3>
            <Pill tone={result.total >= 80 ? 'ok' : result.total >= 60 ? 'warn' : 'bad'}>{result.total}/100</Pill>
          </div>
          <div className="mt-3 space-y-2.5">
            {result.criteria.map((c) => (
              <div key={c.key}>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-soft">{c.label}</span>
                  <span className="text-ink-faint">{c.score}/20</span>
                </div>
                <ProgressBar pct={(c.score / 20) * 100} tone={c.score >= 15 ? 'ok' : c.score >= 9 ? 'brand' : 'accent'} className="mt-1 h-1.5" />
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-ok/30 bg-ok/5 p-3 text-xs text-ink-soft">
              <div className="mb-1 font-semibold text-ok">Strengths</div>
              <ul className="space-y-1">{result.strengths.map((s, i) => <li key={i}>· {s}</li>)}</ul>
            </div>
            <div className="rounded-lg border border-warn/30 bg-warn/5 p-3 text-xs text-ink-soft">
              <div className="mb-1 font-semibold text-warn">To improve</div>
              <ul className="space-y-1">{result.improvements.map((s, i) => <li key={i}>· {s}</li>)}</ul>
            </div>
          </div>
        </div>
      )}

      <Callout kind="note" title="How scoring works">
        Six criteria, 20 points each, scaled to 100. The scorer looks for task-relevant keywords plus structural signals: naming
        files, stating "do not…" constraints, asking for tests/output/screenshots, scoping ("only this file"), and control
        ("show me the plan", "do not commit"). It is a directional coach, not a grader — compare against the strong example.
      </Callout>
    </div>
  );
}
