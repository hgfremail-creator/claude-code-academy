import { useState } from 'react';
import type { QuizQuestion } from '../content/types';
import { Pill } from './ui';

interface Props {
  questions: QuizQuestion[];
  onComplete?: (result: { ratio: number; correct: number; total: number; perQuestion: { q: QuizQuestion; chosen: number; correct: boolean }[] }) => void;
  compact?: boolean;
}

export default function Quiz({ questions, onComplete, compact }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] != null);
  const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const ratio = questions.length ? correctCount / questions.length : 0;

  function submit() {
    setSubmitted(true);
    onComplete?.({
      ratio,
      correct: correctCount,
      total: questions.length,
      perQuestion: questions.map((q) => ({ q, chosen: answers[q.id], correct: answers[q.id] === q.correctAnswer })),
    });
  }

  function retry() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => (
        <div key={q.id} className={compact ? '' : 'card p-4'}>
          <div className="mb-3 flex items-start gap-2">
            <span className="mt-0.5 text-xs font-semibold text-ink-faint">{qi + 1}.</span>
            <p className="text-sm font-medium text-ink">{q.question}</p>
          </div>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const chosen = answers[q.id] === oi;
              const isCorrect = oi === q.correctAnswer;
              let cls = 'border-line bg-bg-soft hover:bg-bg-hover';
              if (submitted) {
                if (isCorrect) cls = 'border-ok/50 bg-ok/10';
                else if (chosen) cls = 'border-bad/50 bg-bad/10';
                else cls = 'border-line bg-bg-soft opacity-60';
              } else if (chosen) {
                cls = 'border-brand/60 bg-brand/10';
              }
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm text-ink-soft transition-colors ${cls}`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line text-[11px]">
                    {String.fromCharCode(65 + oi)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
          {submitted && (
            <div className="mt-3 rounded-lg border border-line bg-bg-soft p-3 text-xs text-ink-soft">
              <span className={answers[q.id] === q.correctAnswer ? 'font-semibold text-ok' : 'font-semibold text-bad'}>
                {answers[q.id] === q.correctAnswer ? 'Correct. ' : 'Not quite. '}
              </span>
              {q.explanation}
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center gap-3">
        {!submitted ? (
          <button className="btn-primary" disabled={!allAnswered} onClick={submit}>
            Submit ({Object.keys(answers).length}/{questions.length})
          </button>
        ) : (
          <>
            <Pill tone={ratio >= 0.8 ? 'ok' : ratio >= 0.6 ? 'warn' : 'bad'}>
              {correctCount}/{questions.length} correct · {Math.round(ratio * 100)}%
            </Pill>
            <button className="btn-ghost btn-sm" onClick={retry}>
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}
