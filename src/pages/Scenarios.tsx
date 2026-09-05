import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SCENARIOS, SCENARIO_CATEGORIES } from '../content/scenarios';
import { SKILL_LABEL } from '../content/skills';
import { useProgress } from '../store/progress';
import { Pill } from '../components/ui';

export default function Scenarios() {
  const { state, dispatch } = useProgress();
  const [params] = useSearchParams();
  const [cat, setCat] = useState<string>('All');
  const [answered, setAnswered] = useState<Record<string, number>>({});

  const list = useMemo(() => {
    let l = SCENARIOS;
    if (cat !== 'All') l = l.filter((s) => s.category === cat);
    const focusId = params.get('id');
    if (focusId) l = [...l].sort((a, b) => (a.id === focusId ? -1 : b.id === focusId ? 1 : 0));
    return l;
  }, [cat, params]);

  const cleared = Object.values(state.scenarios).filter((s) => s.correct).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">What Would You Do?</h1>
        <p className="mt-1 text-sm text-ink-faint">
          {SCENARIOS.length} scenarios · {cleared} cleared. Every answer is explained. These build the judgment the certification tests.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {['All', ...SCENARIO_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`chip ${cat === c ? '!border-brand/50 !bg-brand/10 !text-brand-soft' : 'hover:bg-bg-hover'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((sc) => {
          const chosen = answered[sc.id];
          const showResult = chosen != null;
          const rec = state.scenarios[sc.id];
          return (
            <div key={sc.id} className="card p-5">
              <div className="mb-1 flex items-center gap-2">
                <Pill>{sc.category}</Pill>
                {rec?.correct && <Pill tone="ok">cleared</Pill>}
              </div>
              <p className="text-sm text-ink-soft">{sc.situation}</p>
              <p className="mt-2 text-sm font-medium text-ink">{sc.question}</p>
              <div className="mt-3 space-y-2">
                {sc.options.map((opt, oi) => {
                  const isCorrect = oi === sc.correctAnswer;
                  let cls = 'border-line bg-bg-soft hover:bg-bg-hover';
                  if (showResult) {
                    if (isCorrect) cls = 'border-ok/50 bg-ok/10';
                    else if (oi === chosen) cls = 'border-bad/50 bg-bad/10';
                    else cls = 'border-line bg-bg-soft opacity-60';
                  }
                  return (
                    <button
                      key={oi}
                      disabled={showResult}
                      onClick={() => {
                        setAnswered((a) => ({ ...a, [sc.id]: oi }));
                        dispatch({ type: 'scenario/answer', scenarioId: sc.id, correct: isCorrect, skills: sc.skills });
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm text-ink-soft ${cls}`}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line text-[11px]">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {showResult && (
                <div className="mt-3 rounded-lg border border-line bg-bg-soft p-3 text-xs text-ink-soft">
                  <span className={chosen === sc.correctAnswer ? 'font-semibold text-ok' : 'font-semibold text-bad'}>
                    {chosen === sc.correctAnswer ? 'Correct. ' : `The better answer is ${String.fromCharCode(65 + sc.correctAnswer)}. `}
                  </span>
                  {sc.explanation}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {sc.skills.map((s) => (
                      <span key={s} className="chip">{SKILL_LABEL[s]}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
