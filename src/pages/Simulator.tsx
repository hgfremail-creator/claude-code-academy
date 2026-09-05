import { useEffect, useMemo, useRef, useState } from 'react';
import { MISSIONS } from '../sim/missions';
import { initSim, runCommand, type SimState } from '../sim/engine';
import type { SimLine } from '../sim/types';
import { useProgress } from '../store/progress';
import { Pill } from '../components/ui';

const LINE_STYLE: Record<SimLine['kind'], string> = {
  user: 'text-ink',
  claude: 'text-brand-soft',
  tool: 'text-ink-soft',
  system: 'text-accent',
  error: 'text-bad',
  diff: 'text-ink-soft',
};

export default function Simulator() {
  const { state: prog, dispatch } = useProgress();
  const [missionId, setMissionId] = useState(MISSIONS[0].id);
  const mission = useMemo(() => MISSIONS.find((m) => m.id === missionId)!, [missionId]);
  const [sim, setSim] = useState<SimState>(() => initSim(mission));
  const [lines, setLines] = useState<SimLine[]>([{ kind: 'system', text: `Mission: ${mission.title}\n${mission.brief}\n\nType /help for commands.` }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = MISSIONS.find((x) => x.id === missionId)!;
    setSim(initSim(m));
    setLines([{ kind: 'system', text: `Mission: ${m.title}\n${m.brief}\n\nType /help for commands.` }]);
    setHistory([]);
    setHistIdx(-1);
  }, [missionId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const missionProg = prog.simMissions[missionId];
  const goalsDone = missionProg?.goals ?? [];
  const allGoalsDone = mission.goals.every((g) => goalsDone.includes(g));

  function submit() {
    const cmd = input.trim();
    if (!cmd) return;
    const { lines: newLines, state: nextState, newlyCompleted } = runCommand(sim, cmd);
    setSim({ ...nextState });
    setLines((l) => [...l, ...newLines]);
    setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);
    setInput('');
    for (const g of newlyCompleted) dispatch({ type: 'sim/goal', missionId, goal: g });
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Claude Code Simulator</h1>
        <p className="mt-1 text-sm text-ink-faint">
          A simulated terminal, file tree, and Claude — no API key needed. Practice the loop:
          <span className="text-ink-soft"> you → Claude Code → tools → files → result → your decision.</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {MISSIONS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMissionId(m.id)}
            className={`chip ${missionId === m.id ? '!border-brand/50 !bg-brand/10 !text-brand-soft' : 'hover:bg-bg-hover'}`}
          >
            {m.title}
            {prog.simMissions[m.id]?.completed && <span className="ml-1 text-ok">✓</span>}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line bg-bg-soft px-3 py-2 text-xs text-ink-faint">
            <span className="h-2.5 w-2.5 rounded-full bg-bad/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-ok/60" />
            <span className="ml-2 font-mono">claude — sim/{missionId}</span>
          </div>
          <div ref={scrollRef} className="h-[420px] overflow-y-auto bg-[#0d1015] p-4 font-mono text-[12.5px] leading-relaxed">
            {lines.map((l, i) => (
              <div key={i} className={`whitespace-pre-wrap ${LINE_STYLE[l.kind]}`}>
                {l.kind === 'user' ? <span className="text-ink-faint">❯ </span> : l.kind === 'claude' ? <span className="text-brand">claude ▸ </span> : null}
                {l.text}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-line bg-bg-soft px-3 py-2">
            <span className="font-mono text-xs text-brand">❯</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
                if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(histIdx + 1, history.length - 1); setHistIdx(n); setInput(history[n] ?? ''); }
                if (e.key === 'ArrowDown') { e.preventDefault(); const n = Math.max(histIdx - 1, -1); setHistIdx(n); setInput(n === -1 ? '' : history[n]); }
              }}
              placeholder="type a command or a prompt…  (/help)"
              className="flex-1 bg-transparent font-mono text-[13px] text-ink outline-none placeholder:text-ink-faint"
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="card p-4">
            <div className="mb-2 text-xs font-semibold uppercase text-ink-faint">Files</div>
            <ul className="space-y-0.5 font-mono text-[11px] text-ink-soft">
              {mission.files.map((f) => (
                <li key={f.path} className="truncate">📄 {f.path}</li>
              ))}
            </ul>
            <div className="mt-2 text-[11px] text-ink-faint">Use <code>cat &lt;path&gt;</code> to open.</div>
          </div>

          <div className="card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-ink-faint">Goals</span>
              <Pill tone={allGoalsDone ? 'ok' : 'default'}>{goalsDone.length}/{mission.goals.length}</Pill>
            </div>
            <ul className="space-y-1.5 text-xs text-ink-soft">
              {mission.goals.map((g) => (
                <li key={g} className="flex gap-2">
                  <span>{goalsDone.includes(g) ? '✅' : '○'}</span>
                  <span className={goalsDone.includes(g) ? 'line-through opacity-60' : ''}>{g}</span>
                </li>
              ))}
            </ul>
            {allGoalsDone && !missionProg?.completed && (
              <button className="btn-primary btn-sm mt-3 w-full" onClick={() => dispatch({ type: 'sim/complete', missionId })}>
                Complete mission (+XP)
              </button>
            )}
            {missionProg?.completed && <div className="mt-3 text-center text-xs text-ok">Mission complete ✓</div>}
          </div>

          <details className="card p-4">
            <summary className="cursor-pointer text-xs font-semibold uppercase text-ink-faint">Hints</summary>
            <ul className="mt-2 space-y-1 text-xs text-ink-soft">
              {mission.hints.map((h, i) => <li key={i}>· {h}</li>)}
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
