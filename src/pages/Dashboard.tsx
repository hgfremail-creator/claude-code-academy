import { Link } from 'react-router-dom';
import { useProgress } from '../store/progress';
import { levelProgress } from '../lib/xp';
import { RANKS, LEVELS } from '../content/levels';
import { SKILLS } from '../content/skills';
import { LESSONS } from '../content/lessons';
import { DAILY_CHALLENGES } from '../content/challenges';
import { skillMastery, earnedBadges, lessonsCompleted } from '../engine/badges';
import { recommendedLesson, weakAreas, strongAreas, courseProgressPct } from '../engine/adaptive';
import { Card, ProgressBar, Pill, Stat, SectionTitle } from '../components/ui';
import { todayISO } from '../lib/storage';

function dailyChallenge() {
  const d = todayISO();
  let h = 0;
  for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) >>> 0;
  return DAILY_CHALLENGES[h % DAILY_CHALLENGES.length];
}

export default function Dashboard() {
  const { state } = useProgress();
  const lp = levelProgress(state.xp);
  const next = recommendedLesson(state);
  const weak = weakAreas(state);
  const strong = strongAreas(state);
  const badges = earnedBadges(state);
  const completed = lessonsCompleted(state);
  const pct = courseProgressPct(state);
  const daily = dailyChallenge();
  const dailyDone = state.dailyDoneDates.includes(todayISO());

  const coreSkills = ['prompting', 'navigation', 'git', 'debugging', 'context', 'mcp', 'hooks', 'subagents', 'skills', 'security', 'autonomy'] as const;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="card overflow-hidden">
        <div className="border-b border-line bg-gradient-to-r from-brand-dim/40 to-transparent p-6">
          <div className="text-xs uppercase tracking-widest text-brand-soft">Claude Code Academy</div>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <h1 className="text-2xl font-semibold text-ink">
              Level {lp.level} — {RANKS[lp.level]}
            </h1>
            <span className="text-sm text-ink-faint">{state.xp} XP · next level at {lp.nextAt} XP</span>
          </div>
          <div className="mt-3 max-w-md">
            <ProgressBar pct={pct} />
            <div className="mt-1 flex justify-between text-xs text-ink-faint">
              <span>Course progress {pct}%</span>
              <span>{completed}/{LESSONS.length} lessons</span>
            </div>
          </div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Streak" value={<span>🔥 {state.streak.current}</span>} sub={`longest ${state.streak.longest} days`} />
          <Stat label="XP" value={state.xp} sub={`Level ${lp.level} · ${lp.pct}% to next`} />
          <Stat label="Badges" value={`${badges.length}/${14}`} sub="serious-developer achievements" />
          <Stat label="Scenarios cleared" value={Object.values(state.scenarios).filter((x) => x.correct).length} sub="judgment calls" />
        </div>
      </div>

      {/* Next + Daily */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle sub="Adaptive — the next lesson you have not mastered">Recommended next</SectionTitle>
          {next ? (
            <Link to={`/learn/${next.id}`} className="block rounded-lg border border-line bg-bg-soft p-4 transition-colors hover:bg-bg-hover">
              <div className="flex items-center gap-2">
                <Pill tone="brand">Level {next.level}</Pill>
                <Pill>{next.category}</Pill>
                <span className="ml-auto text-xs text-ink-faint">{next.estimatedMinutes} min</span>
              </div>
              <div className="mt-2 text-base font-semibold text-ink">{next.title}</div>
              <div className="mt-0.5 text-sm text-ink-soft">{next.tagline}</div>
              <div className="mt-3 text-sm font-medium text-brand-soft">Continue →</div>
            </Link>
          ) : (
            <div className="rounded-lg border border-ok/30 bg-ok/5 p-4 text-sm text-ink-soft">
              🎓 You have mastered every lesson. Head to <Link to="/certification" className="link">Certification</Link>.
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-bg-soft p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-ink">Daily challenge</span>
                {dailyDone ? <Pill tone="ok">done today</Pill> : <Pill tone="warn">open</Pill>}
              </div>
              <div className="text-sm text-ink-soft">{daily.title}</div>
              <Link to={`/challenges?id=${daily.id}`} className="mt-2 inline-block text-xs font-medium text-brand-soft">
                Take the challenge →
              </Link>
            </div>
            <div className="rounded-lg border border-line bg-bg-soft p-4">
              <div className="mb-1 text-sm font-medium text-ink">Quick reference</div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <Link to="/reference" className="chip hover:bg-bg-hover">Command Explorer</Link>
                <Link to="/reference/cheatsheet" className="chip hover:bg-bg-hover">Cheat sheet</Link>
                <Link to="/glossary" className="chip hover:bg-bg-hover">Glossary</Link>
                <Link to="/docs" className="chip hover:bg-bg-hover">Latest docs</Link>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle>Skills mastered</SectionTitle>
          <div className="space-y-2.5">
            {coreSkills.map((sk) => {
              const m = skillMastery(state, sk);
              const meta = SKILLS.find((x) => x.id === sk)!;
              return (
                <div key={sk}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-soft">{m >= 0.85 ? '✓' : m > 0 ? '◐' : '○'} {meta.label}</span>
                    <span className="text-ink-faint">{Math.round(m * 100)}%</span>
                  </div>
                  <ProgressBar pct={m * 100} tone={m >= 0.85 ? 'ok' : 'brand'} className="mt-1 h-1.5" />
                </div>
              );
            })}
          </div>
          <Link to="/progress" className="mt-3 inline-block text-xs font-medium text-brand-soft">All skills & badges →</Link>
        </Card>
      </div>

      {/* Weak / strong */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionTitle sub="Where your quiz & scenario answers show gaps">Weak areas</SectionTitle>
          {weak.length === 0 ? (
            <p className="text-sm text-ink-faint">Nothing flagged yet — answer more quizzes and scenarios and the Academy will spot patterns.</p>
          ) : (
            <ul className="space-y-2">
              {weak.map((w) => (
                <li key={w.skill} className="flex items-center gap-2 text-sm">
                  <Pill tone="bad">{Math.round(w.mastery * 100)}%</Pill>
                  <span className="text-ink-soft">{w.label}</span>
                  {w.reviewLessonId && (
                    <Link to={`/learn/${w.reviewLessonId}`} className="ml-auto text-xs font-medium text-brand-soft">
                      Review →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <SectionTitle sub="Consistently strong — ready for the harder material">Strengths unlocked</SectionTitle>
          {strong.length === 0 ? (
            <p className="text-sm text-ink-faint">Reach 85%+ on a skill and advanced follow-ups appear here.</p>
          ) : (
            <ul className="space-y-2">
              {strong.map((w) => (
                <li key={w.skill} className="flex items-center gap-2 text-sm">
                  <Pill tone="ok">{Math.round(w.mastery * 100)}%</Pill>
                  <span className="text-ink-soft">{w.label}</span>
                  {w.nextLessonId && (
                    <Link to={`/learn/${w.nextLessonId}`} className="ml-auto text-xs font-medium text-brand-soft">
                      Go deeper →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Levels overview */}
      <Card>
        <SectionTitle sub="21 levels, beginner to autonomous developer">The learning path</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((lvl) => {
            const lessons = LESSONS.filter((l) => l.level === lvl.level);
            const done = lessons.filter((l) => (state.lessons[l.id]?.quizBest ?? 0) >= 0.6 && state.lessons[l.id]?.read).length;
            return (
              <Link
                key={lvl.level}
                to="/learn"
                className="rounded-lg border border-line bg-bg-soft p-3 transition-colors hover:bg-bg-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-ink-faint">L{lvl.level}</span>
                  <span className="text-[11px] text-ink-faint">{done}/{lessons.length}</span>
                </div>
                <div className="mt-0.5 text-sm font-medium text-ink">{lvl.title}</div>
                <div className="text-xs text-ink-faint">{lvl.subtitle}</div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
