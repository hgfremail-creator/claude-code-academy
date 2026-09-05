import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../content/levels';
import { LESSONS } from '../content/lessons';
import { useProgress } from '../store/progress';
import { lessonStatus } from '../engine/adaptive';
import { Pill, ProgressBar } from '../components/ui';

export default function Learn() {
  const { state } = useProgress();
  const [open, setOpen] = useState<number | null>(() => {
    const firstIncomplete = LESSONS.find((l) => lessonStatus(state, l) !== 'complete');
    return firstIncomplete ? firstIncomplete.level : 0;
  });

  const totalDone = LESSONS.filter((l) => lessonStatus(state, l) === 'complete').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Learn</h1>
        <p className="mt-1 text-sm text-ink-faint">
          {LESSONS.length} lessons across 21 levels. {totalDone} complete. A lesson counts as mastered when you have read it and
          scored 60%+ on its quiz.
        </p>
        <ProgressBar pct={(totalDone / LESSONS.length) * 100} className="mt-3 max-w-md" />
      </div>

      <div className="space-y-3">
        {LEVELS.map((lvl) => {
          const lessons = LESSONS.filter((l) => l.level === lvl.level);
          if (!lessons.length) return null;
          const done = lessons.filter((l) => lessonStatus(state, l) === 'complete').length;
          const isOpen = open === lvl.level;
          return (
            <div key={lvl.level} className="card overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : lvl.level)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-bg-hover"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-soft font-mono text-xs text-ink-faint">
                  {lvl.level}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">{lvl.title}</span>
                  <span className="block truncate text-xs text-ink-faint">{lvl.summary}</span>
                </span>
                <Pill tone={done === lessons.length ? 'ok' : 'default'}>
                  {done}/{lessons.length}
                </Pill>
                <span className="text-ink-faint">{isOpen ? '▾' : '▸'}</span>
              </button>
              {isOpen && (
                <div className="border-t border-line">
                  {lessons.map((l) => {
                    const st = lessonStatus(state, l);
                    return (
                      <Link
                        key={l.id}
                        to={`/learn/${l.id}`}
                        className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0 hover:bg-bg-hover"
                      >
                        <span className="text-sm">
                          {st === 'complete' ? '✅' : st === 'available' ? '▸' : '🔒'}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-ink">{l.title}</span>
                          <span className="block truncate text-xs text-ink-faint">{l.tagline}</span>
                        </span>
                        {l.versionSensitive && <Pill tone="warn">version-sensitive</Pill>}
                        <span className="text-xs text-ink-faint">{l.estimatedMinutes}m</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
