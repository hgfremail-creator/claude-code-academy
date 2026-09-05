import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CERT_PARTS, CERT_TOTAL_QUESTIONS, CERT_PASS_THRESHOLD } from '../content/certification';
import { useProgress } from '../store/progress';
import { courseProgressPct } from '../engine/adaptive';
import Quiz from '../components/Quiz';
import { Card, Pill, ProgressBar, Callout } from '../components/ui';

export default function Certification() {
  const { state, dispatch } = useProgress();
  const [activePart, setActivePart] = useState<string | null>(null);
  const coursePct = courseProgressPct(state);

  const partsPassed = CERT_PARTS.filter((p) => state.cert[p.id]?.passed).length;
  const allPassed = partsPassed === CERT_PARTS.length;

  const overallRatio = useMemo(() => {
    const sum = CERT_PARTS.reduce((n, p) => n + (state.cert[p.id]?.best ?? 0) * p.questions.length, 0);
    return sum / CERT_TOTAL_QUESTIONS;
  }, [state.cert]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Claude Code Certification</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Ten parts, {CERT_TOTAL_QUESTIONS} questions. Judgment over trivia. Pass every part at {Math.round(CERT_PASS_THRESHOLD * 100)}%+ to certify.
        </p>
      </div>

      {coursePct < 60 && (
        <Callout kind="warn" title="You can take it now, but…">
          You have completed {coursePct}% of the curriculum. The exam draws on every level — most people do best after finishing the
          lessons, clearing the daily challenges for a couple of weeks, and completing at least one project per tier.
        </Callout>
      )}

      {state.certPassed && (
        <Card className="border-brand/40 bg-brand/5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎓</span>
            <div>
              <div className="text-sm font-semibold text-ink">Certified — Claude Code Master</div>
              <div className="text-xs text-ink-faint">
                Recorded on this device · overall best {Math.round(overallRatio * 100)}%
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-ink">Exam progress</span>
          <Pill tone={allPassed ? 'ok' : 'default'}>{partsPassed}/{CERT_PARTS.length} parts passed</Pill>
        </div>
        <ProgressBar pct={(partsPassed / CERT_PARTS.length) * 100} tone={allPassed ? 'ok' : 'brand'} />
        {allPassed && !state.certPassed && (
          <button className="btn-primary mt-3" onClick={() => dispatch({ type: 'cert/pass' })}>
            Claim certification 🎓
          </button>
        )}
      </div>

      <div className="space-y-3">
        {CERT_PARTS.map((part) => {
          const rec = state.cert[part.id];
          const open = activePart === part.id;
          return (
            <div key={part.id} className="card overflow-hidden">
              <button onClick={() => setActivePart(open ? null : part.id)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-bg-hover">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">{part.title}</span>
                  <span className="block text-xs text-ink-faint">{part.description}</span>
                </span>
                {rec?.passed ? <Pill tone="ok">passed {Math.round((rec.best ?? 0) * 100)}%</Pill>
                  : rec ? <Pill tone="warn">best {Math.round(rec.best * 100)}%</Pill>
                  : <Pill>{part.questions.length} Q</Pill>}
                <span className="text-ink-faint">{open ? '▾' : '▸'}</span>
              </button>
              {open && (
                <div className="border-t border-line p-4">
                  <Quiz
                    questions={part.questions}
                    onComplete={(res) =>
                      dispatch({ type: 'cert/part', partId: part.id, ratio: res.ratio, passed: res.ratio >= CERT_PASS_THRESHOLD })
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Callout kind="note" title="Beyond the written exam">
        Parts 9 and 10 — a real project and a final autonomous-development challenge — are completed <em>in Claude Code itself</em>.
        Use the <Link to="/projects" className="link">Project Library</Link> (finish at least one expert-tier project) and design a
        full <Link to="/learn/l20-autonomous-dev" className="link">plan → execute → verify → review</Link> loop for it. The
        reflection questions in each project are your self-assessment.
      </Callout>
    </div>
  );
}
