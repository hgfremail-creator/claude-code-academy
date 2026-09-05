import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LESSON_BY_ID, LESSONS } from '../content/lessons';
import { SKILL_LABEL } from '../content/skills';
import { useProgress } from '../store/progress';
import { Pill, Callout, OfficialLink, ProgressBar } from '../components/ui';
import Markdown from '../components/Markdown';
import Quiz from '../components/Quiz';
import ExerciseCard from '../components/ExerciseCard';
import type { SkillId } from '../content/types';

const REFLECTION = [
  'What did Claude Code actually *do* — which files, tools, decisions?',
  'What information did Claude need, and did you provide it or did it have to dig?',
  'What could have gone wrong? Where was the risk concentrated?',
  'How would you verify the result if you had not watched?',
  'Would you trust Claude to do this autonomously? What would have to be true first?',
];

export default function LessonView() {
  const { lessonId } = useParams();
  const lesson = lessonId ? LESSON_BY_ID[lessonId] : undefined;
  const { state, dispatch } = useProgress();
  const [tab, setTab] = useState<'read' | 'practice' | 'quiz' | 'reflect'>('read');
  const readMarked = useRef(false);

  useEffect(() => {
    setTab('read');
    readMarked.current = false;
    window.scrollTo(0, 0);
  }, [lessonId]);

  useEffect(() => {
    if (lesson && !readMarked.current) {
      const t = setTimeout(() => {
        dispatch({ type: 'lesson/read', lessonId: lesson.id });
        readMarked.current = true;
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [lesson, dispatch]);

  const idx = useMemo(() => LESSONS.findIndex((l) => l.id === lessonId), [lessonId]);
  const prev = idx > 0 ? LESSONS[idx - 1] : null;
  const nextL = idx >= 0 && idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null;

  if (!lesson) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm text-ink-soft">Lesson not found.</p>
        <Link to="/learn" className="link mt-2 inline-block">Back to Learn</Link>
      </div>
    );
  }

  const lp = state.lessons[lesson.id];
  const bookmarked = state.bookmarks.includes(lesson.id);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs text-ink-faint">
        <Link to="/learn" className="hover:text-ink">Learn</Link>
        <span>/</span>
        <span>Level {lesson.level}</span>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="brand">Level {lesson.level}</Pill>
          <Pill>{lesson.category}</Pill>
          <Pill>{lesson.difficulty}</Pill>
          <span className="text-xs text-ink-faint">{lesson.estimatedMinutes} min</span>
          <button
            onClick={() => dispatch({ type: 'bookmark/toggle', id: lesson.id })}
            className="ml-auto btn-ghost btn-sm"
          >
            {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
          </button>
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-ink">{lesson.title}</h1>
        <p className="mt-1 text-sm text-ink-soft">{lesson.tagline}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {lesson.skills.map((s) => (
            <span key={s} className="chip">{SKILL_LABEL[s]}</span>
          ))}
        </div>
      </div>

      {lesson.versionSensitive && (
        <Callout kind="warn" title="Version-sensitive">
          Parts of this lesson depend on the current Claude Code version, plan, or surface. Verify specifics against the official
          documentation and <code>/help</code> in your session.
        </Callout>
      )}

      {/* objectives + prereqs */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <div className="mb-2 text-xs font-semibold uppercase text-ink-faint">You will be able to</div>
          <ul className="space-y-1 text-sm text-ink-soft">
            {lesson.objectives.map((o, i) => (
              <li key={i} className="flex gap-2"><span className="text-brand">›</span>{o}</li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <div className="mb-2 text-xs font-semibold uppercase text-ink-faint">Prerequisites</div>
          {lesson.prerequisites.length ? (
            <ul className="space-y-1 text-sm">
              {lesson.prerequisites.map((p) => (
                <li key={p}>
                  <Link to={`/learn/${p}`} className="link">{LESSON_BY_ID[p]?.title ?? p}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-faint">None — you can start here.</p>
          )}
        </div>
      </div>

      {/* tabs */}
      <div className="flex gap-1 border-b border-line">
        {([
          ['read', 'Lesson'],
          ['practice', `Exercises (${lesson.exercises.length})`],
          ['quiz', `Quiz (${lesson.quiz.length})`],
          ['reflect', 'Reflect'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`border-b-2 px-3 py-2 text-sm ${tab === k ? 'border-brand text-ink' : 'border-transparent text-ink-faint hover:text-ink-soft'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'read' && (
        <div className="space-y-5">
          <Markdown>{lesson.body}</Markdown>
          <div className="card p-4">
            <div className="mb-2 text-xs font-semibold uppercase text-ink-faint">Resources</div>
            <ul className="space-y-1.5">
              {lesson.resources.map((r) => (
                <li key={r.url}><OfficialLink href={r.url} official={r.official}>{r.label}</OfficialLink></li>
              ))}
            </ul>
          </div>
          {lesson.relatedLessons.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-ink-faint">Related:</span>
              {lesson.relatedLessons.map((r) => (
                <Link key={r} to={`/learn/${r}`} className="chip hover:bg-bg-hover">{LESSON_BY_ID[r]?.title ?? r}</Link>
              ))}
            </div>
          )}
          <button className="btn-primary" onClick={() => setTab('practice')}>Continue to exercises →</button>
        </div>
      )}

      {tab === 'practice' && (
        <div className="space-y-4">
          {lesson.exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              done={!!lp?.exercisesDone.includes(ex.id)}
              onDone={() => dispatch({ type: 'lesson/exercise', lessonId: lesson.id, exerciseId: ex.id })}
            />
          ))}
          <button className="btn-primary" onClick={() => setTab('quiz')}>Continue to quiz →</button>
        </div>
      )}

      {tab === 'quiz' && (
        <div className="space-y-4">
          {lp?.quizBest != null && (
            <div className="flex items-center gap-2 text-xs text-ink-faint">
              Best so far: <ProgressBar pct={lp.quizBest * 100} tone={lp.quizBest >= 0.8 ? 'ok' : 'brand'} className="max-w-[160px]" />
              {Math.round(lp.quizBest * 100)}%
            </div>
          )}
          <Quiz
            questions={lesson.quiz}
            onComplete={(res) => {
              dispatch({
                type: 'lesson/quiz',
                lessonId: lesson.id,
                ratio: res.ratio,
                correct: res.correct,
                skills: lesson.skills,
                perSkill: res.perQuestion.flatMap((pq) =>
                  (pq.q.skills && pq.q.skills.length ? pq.q.skills : lesson.skills).map((skill) => ({ skill: skill as SkillId, correct: pq.correct })),
                ),
              });
            }}
          />
        </div>
      )}

      {tab === 'reflect' && (
        <div className="space-y-4">
          <Callout kind="tip" title="Reflection builds judgment">
            Command recall fades. The habit of asking these questions after every real task is what makes you an advanced user.
          </Callout>
          {REFLECTION.map((q, i) => {
            const key = `reflect:${lesson.id}:${i}`;
            return (
              <div key={i} className="card p-4">
                <div className="mb-2 text-sm font-medium text-ink">{q}</div>
                <textarea
                  defaultValue={state.notes[key] ?? ''}
                  onBlur={(e) => dispatch({ type: 'note/set', id: key, text: e.target.value })}
                  rows={2}
                  placeholder="Your answer (saved locally)…"
                  className="w-full rounded-lg border border-line bg-bg-soft p-2.5 text-sm text-ink outline-none focus:border-brand/50"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* nav */}
      <div className="flex items-center justify-between border-t border-line pt-4">
        {prev ? (
          <Link to={`/learn/${prev.id}`} className="btn-ghost btn-sm">← {prev.title}</Link>
        ) : <span />}
        {nextL ? (
          <Link to={`/learn/${nextL.id}`} className="btn-ghost btn-sm">{nextL.title} →</Link>
        ) : (
          <Link to="/certification" className="btn-primary btn-sm">Go to certification →</Link>
        )}
      </div>
    </div>
  );
}
