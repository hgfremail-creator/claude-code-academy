import { useState } from 'react';
import type { Exercise } from '../content/types';
import { Pill } from './ui';

export default function ExerciseCard({ exercise, done, onDone }: { exercise: Exercise; done: boolean; onDone: () => void }) {
  const [text, setText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [order, setOrder] = useState<number[]>(exercise.items ? exercise.items.map((_, i) => i) : []);
  const [checked, setChecked] = useState<number[]>([]);

  const kindLabel: Record<Exercise['kind'], string> = {
    'improve-prompt': 'Improve the prompt',
    reflection: 'Reflection',
    checklist: 'Self-check',
    freeform: 'Exercise',
    'order-steps': 'Put in order',
  };

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  }

  const orderCorrect =
    exercise.kind === 'order-steps' && exercise.correctOrder
      ? JSON.stringify(order) === JSON.stringify(exercise.correctOrder)
      : false;

  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill tone="accent">{kindLabel[exercise.kind]}</Pill>
          <span className="text-sm font-medium text-ink">{exercise.title}</span>
        </div>
        {done && <Pill tone="ok">✓ done</Pill>}
      </div>
      <p className="mb-3 text-sm text-ink-soft">{exercise.prompt}</p>

      {exercise.kind === 'improve-prompt' && exercise.starter && (
        <div className="mb-3 rounded-lg border border-bad/30 bg-bad/5 p-3 font-mono text-xs text-ink-soft">
          <span className="text-bad">weak prompt →</span> {exercise.starter}
        </div>
      )}

      {(exercise.kind === 'improve-prompt' || exercise.kind === 'reflection' || exercise.kind === 'freeform') && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={exercise.kind === 'improve-prompt' ? 4 : 3}
          placeholder="Write your attempt here…"
          className="w-full rounded-lg border border-line bg-bg-soft p-3 text-sm text-ink outline-none focus:border-brand/50"
        />
      )}

      {exercise.kind === 'checklist' && exercise.items && (
        <ul className="space-y-1.5">
          {exercise.items.map((it, i) => (
            <li key={i}>
              <label className="flex cursor-pointer items-start gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={checked.includes(i)}
                  onChange={() => setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]))}
                  className="mt-0.5 accent-brand"
                />
                <span>{it}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {exercise.kind === 'order-steps' && exercise.items && (
        <ol className="space-y-1.5">
          {order.map((idx, pos) => (
            <li key={idx} className="flex items-center gap-2 rounded-lg border border-line bg-bg-soft px-3 py-2 text-sm text-ink-soft">
              <span className="text-xs text-ink-faint">{pos + 1}</span>
              <span className="flex-1">{exercise.items![idx]}</span>
              <button className="btn-ghost btn-sm" onClick={() => move(pos, -1)} aria-label="move up">↑</button>
              <button className="btn-ghost btn-sm" onClick={() => move(pos, 1)} aria-label="move down">↓</button>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {exercise.kind === 'order-steps' ? (
          <>
            <button className="btn-ghost btn-sm" onClick={() => setRevealed(true)}>Check order</button>
            {revealed && <Pill tone={orderCorrect ? 'ok' : 'bad'}>{orderCorrect ? 'Correct order' : 'Not yet — keep adjusting'}</Pill>}
          </>
        ) : (
          exercise.modelAnswer && (
            <button className="btn-ghost btn-sm" onClick={() => setRevealed((r) => !r)}>
              {revealed ? 'Hide' : 'Show'} model answer
            </button>
          )
        )}
        {!done && (
          <button
            className="btn-primary btn-sm"
            onClick={onDone}
            disabled={
              (exercise.kind === 'checklist' && checked.length === 0) ||
              ((exercise.kind === 'improve-prompt' || exercise.kind === 'reflection' || exercise.kind === 'freeform') && text.trim().length < 10) ||
              (exercise.kind === 'order-steps' && !orderCorrect)
            }
          >
            Mark done (+XP)
          </button>
        )}
      </div>

      {revealed && exercise.modelAnswer && (
        <div className="mt-3 rounded-lg border border-ok/30 bg-ok/5 p-3 text-sm text-ink-soft">
          <div className="mb-1 text-xs font-semibold uppercase text-ok">Model answer</div>
          {exercise.modelAnswer}
        </div>
      )}
    </div>
  );
}
