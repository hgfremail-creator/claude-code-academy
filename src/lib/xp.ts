// XP → level curve. Level thresholds grow ~1.35x each step.
const THRESHOLDS: number[] = (() => {
  const t = [0];
  let step = 120;
  for (let i = 1; i <= 21; i++) {
    t.push(Math.round(t[i - 1] + step));
    step = Math.round(step * 1.32);
  }
  return t;
})();

export function levelForXp(xp: number): number {
  let lvl = 0;
  for (let i = 0; i < THRESHOLDS.length; i++) {
    if (xp >= THRESHOLDS[i]) lvl = i;
  }
  return Math.min(lvl, 21);
}

export function levelProgress(xp: number): { level: number; into: number; span: number; pct: number; nextAt: number } {
  const level = levelForXp(xp);
  const base = THRESHOLDS[level] ?? 0;
  const next = THRESHOLDS[Math.min(level + 1, THRESHOLDS.length - 1)] ?? base + 1000;
  const span = Math.max(next - base, 1);
  const into = xp - base;
  return { level, into, span, pct: Math.min(100, Math.round((into / span) * 100)), nextAt: next };
}

export const XP = {
  lessonRead: 20,
  quizPerCorrect: 8,
  quizPerfectBonus: 15,
  exercise: 10,
  scenarioCorrect: 6,
  challengeComplete: 25,
  simGoal: 6,
  promptLabRun: 12,
  promptLabHighScore: 20,
  certPartPass: 30,
  certPass: 250,
} as const;
