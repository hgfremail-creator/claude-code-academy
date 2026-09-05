import type { ProgressState } from '../store/progress';
import { LESSONS } from '../content/lessons';
import { SKILLS } from '../content/skills';

export interface Badge {
  id: string;
  label: string;
  icon: string;
  description: string;
  earned: (s: ProgressState) => boolean;
}

const lessonCount = LESSONS.length;

export function skillMastery(s: ProgressState, skill: string): number {
  const rec = s.skillMastery[skill];
  if (!rec || rec.total === 0) return 0;
  return rec.correct / rec.total;
}

export function overallMastery(s: ProgressState): number {
  const vals = SKILLS.map((sk) => skillMastery(s, sk.id));
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function lessonsCompleted(s: ProgressState): number {
  return Object.values(s.lessons).filter((l) => l.read && (l.quizBest ?? 0) >= 0.6).length;
}

export const BADGES: Badge[] = [
  { id: 'first-session', label: 'First Session', icon: '🚀', description: 'Complete your first lesson.', earned: (s) => lessonsCompleted(s) >= 1 },
  { id: 'prompt-engineer', label: 'Prompt Engineer', icon: '✍️', description: 'Score 80+ on a Prompt Lab task.', earned: (s) => Object.values(s.promptLab).some((p) => (p.bestScore ?? 0) >= 80) },
  { id: 'git-master', label: 'Git Master', icon: '🌿', description: 'Reach 85% mastery in Git.', earned: (s) => skillMastery(s, 'git') >= 0.85 },
  { id: 'debugging-detective', label: 'Debugging Detective', icon: '🔎', description: 'Reach 85% mastery in Debugging.', earned: (s) => skillMastery(s, 'debugging') >= 0.85 },
  { id: 'context-master', label: 'Context Master', icon: '🧠', description: 'Reach 85% mastery in Context management.', earned: (s) => skillMastery(s, 'context') >= 0.85 },
  { id: 'claude-md-architect', label: 'CLAUDE.md Architect', icon: '📐', description: 'Complete the CLAUDE.md level and its challenge.', earned: (s) => (s.lessons['l8-claude-md']?.quizBest ?? 0) >= 0.8 && !!s.challenges['ch-design-claude-md']?.completed },
  { id: 'mcp-explorer', label: 'MCP Explorer', icon: '🔌', description: 'Reach 80% mastery in MCP.', earned: (s) => skillMastery(s, 'mcp') >= 0.8 },
  { id: 'agent-commander', label: 'Agent Commander', icon: '🤖', description: 'Reach 80% mastery in Subagents.', earned: (s) => skillMastery(s, 'subagents') >= 0.8 },
  { id: 'security-guardian', label: 'Security Guardian', icon: '🛡️', description: 'Reach 85% mastery in Security.', earned: (s) => skillMastery(s, 'security') >= 0.85 },
  { id: 'simulator-graduate', label: 'Simulator Graduate', icon: '🖥️', description: 'Complete every simulator mission.', earned: (s) => ['m-explore', 'm-diff-review', 'm-context'].every((m) => s.simMissions[m]?.completed) },
  { id: 'scenario-sage', label: 'Scenario Sage', icon: '⚖️', description: 'Answer 25 "What Would You Do?" scenarios correctly.', earned: (s) => Object.values(s.scenarios).filter((x) => x.correct).length >= 25 },
  { id: 'streak-7', label: 'Consistent', icon: '🔥', description: 'A 7-day learning streak.', earned: (s) => s.streak.longest >= 7 },
  { id: 'halfway', label: 'Halfway There', icon: '⛰️', description: `Complete ${Math.ceil(lessonCount / 2)} lessons.`, earned: (s) => lessonsCompleted(s) >= Math.ceil(lessonCount / 2) },
  { id: 'certified', label: 'Claude Code Master', icon: '🎓', description: 'Pass the final certification exam.', earned: (s) => s.certPassed },
];

export function earnedBadges(s: ProgressState): Badge[] {
  return BADGES.filter((b) => b.earned(s));
}
