import { Link } from 'react-router-dom';
import { useProgress } from '../store/progress';
import { SCENARIOS } from '../content/scenarios';
import { PROMPT_TASKS } from '../content/promptLab';
import { MISSIONS } from '../sim/missions';
import { DAILY_CHALLENGES } from '../content/challenges';
import { Card, SectionTitle, Pill } from '../components/ui';

export default function Practice() {
  const { state } = useProgress();
  const scenariosCleared = Object.values(state.scenarios).filter((s) => s.correct).length;
  const promptRuns = Object.values(state.promptLab).reduce((n, p) => n + p.runs, 0);
  const simDone = MISSIONS.filter((m) => state.simMissions[m.id]?.completed).length;

  const tiles = [
    { to: '/practice/scenarios', title: 'What Would You Do?', desc: `${SCENARIOS.length} realistic judgment calls with full explanations.`, stat: `${scenariosCleared}/${SCENARIOS.length} cleared` },
    { to: '/prompt-lab', title: 'Prompt Lab', desc: `${PROMPT_TASKS.length} real tasks — write the prompt, get scored on clarity, context, constraints, verification, scope, safety.`, stat: `${promptRuns} runs` },
    { to: '/simulator', title: 'Claude Code Simulator', desc: 'A safe simulated terminal + file tree. Practice the loop with no API needed.', stat: `${simDone}/${MISSIONS.length} missions` },
    { to: '/challenges', title: 'Challenges', desc: `${DAILY_CHALLENGES.length} daily + weekly + library challenges: improve a prompt, find the bug, design a workflow.`, stat: `${Object.values(state.challenges).filter((c) => c.completed).length} done` },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Practice</h1>
        <p className="mt-1 text-sm text-ink-faint">
          The course is deliberately not passive reading. This is where concepts become judgment.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="card p-5 transition-colors hover:bg-bg-hover">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">{t.title}</h2>
              <Pill>{t.stat}</Pill>
            </div>
            <p className="mt-1.5 text-sm text-ink-soft">{t.desc}</p>
            <div className="mt-3 text-xs font-medium text-brand-soft">Open →</div>
          </Link>
        ))}
      </div>

      <Card>
        <SectionTitle sub="The teaching arc behind every level">Concept → mastery</SectionTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
          {['Concept', 'Explanation', 'Demonstration', 'Interactive exercise', 'Challenge', 'Real project', 'Reflection'].map((s, i, arr) => (
            <span key={s} className="flex items-center gap-2">
              <span className="chip">{s}</span>
              {i < arr.length - 1 && <span className="text-ink-faint">→</span>}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
