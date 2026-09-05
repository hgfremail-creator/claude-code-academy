import { Link } from 'react-router-dom';
import { useProgress } from '../store/progress';
import { levelProgress } from '../lib/xp';
import { RANKS } from '../content/levels';
import { SKILLS } from '../content/skills';
import { LESSONS, LESSON_BY_ID } from '../content/lessons';
import { BADGES, earnedBadges, skillMastery, overallMastery, lessonsCompleted } from '../engine/badges';
import { Card, SectionTitle, ProgressBar, Pill, Stat } from '../components/ui';

export default function ProgressPage() {
  const { state, dispatch } = useProgress();
  const lp = levelProgress(state.xp);
  const earned = new Set(earnedBadges(state).map((b) => b.id));
  const overall = overallMastery(state);

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'claude-code-academy-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e: { target: HTMLInputElement }) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((txt) => {
      try {
        dispatch({ type: 'import', state: JSON.parse(txt) });
      } catch {
        alert('Could not read that file.');
      }
    });
  }

  const bookmarkedLessons = state.bookmarks.filter((b) => LESSON_BY_ID[b]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Progress</h1>
        <p className="mt-1 text-sm text-ink-faint">All progress is stored locally in your browser. Export it to move between devices.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Level" value={`${lp.level} · ${RANKS[lp.level]}`} sub={`${lp.pct}% to level ${lp.level + 1}`} />
        <Stat label="XP" value={state.xp} />
        <Stat label="Lessons mastered" value={`${lessonsCompleted(state)}/${LESSONS.length}`} />
        <Stat label="Overall mastery" value={`${Math.round(overall * 100)}%`} />
      </div>

      <Card>
        <SectionTitle sub="correct answers ÷ attempts across quizzes and scenarios (min 3 attempts to rate)">Skill mastery</SectionTitle>
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {SKILLS.map((sk) => {
            const rec = state.skillMastery[sk.id];
            const m = skillMastery(state, sk.id);
            const rated = rec && rec.total >= 3;
            return (
              <div key={sk.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-soft">{sk.label}</span>
                  <span className="text-ink-faint">{rated ? `${Math.round(m * 100)}%` : rec ? `${rec.total} attempts` : '—'}</span>
                </div>
                <ProgressBar pct={m * 100} tone={m >= 0.85 ? 'ok' : 'brand'} className="mt-1 h-1.5" />
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <SectionTitle sub={`${earned.size}/${BADGES.length} earned`}>Badges</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((b) => {
            const got = earned.has(b.id);
            return (
              <div key={b.id} className={`rounded-lg border p-3 ${got ? 'border-brand/40 bg-brand/5' : 'border-line bg-bg-soft opacity-55'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-sm font-semibold text-ink">{b.label}</span>
                </div>
                <p className="mt-1 text-xs text-ink-faint">{b.description}</p>
                {got && <Pill tone="ok">earned</Pill>}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle>Bookmarks</SectionTitle>
          {bookmarkedLessons.length ? (
            <ul className="space-y-1.5 text-sm">
              {bookmarkedLessons.map((b) => (
                <li key={b}><Link to={`/learn/${b}`} className="link">{LESSON_BY_ID[b].title}</Link></li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-faint">Bookmark lessons from the lesson page to pin them here.</p>
          )}
        </Card>
        <Card>
          <SectionTitle>Data</SectionTitle>
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost btn-sm" onClick={exportData}>Export progress</button>
            <label className="btn-ghost btn-sm cursor-pointer">
              Import<input type="file" accept="application/json" className="hidden" onChange={importData} />
            </label>
            <button
              className="btn-ghost btn-sm !text-bad"
              onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) dispatch({ type: 'reset' }); }}
            >
              Reset
            </button>
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            Offline-first: the whole Academy works without a backend or API key. A future version could add an optional
            "Ask Claude about this lesson" — kept modular and off by default.
          </p>
        </Card>
      </div>
    </div>
  );
}
