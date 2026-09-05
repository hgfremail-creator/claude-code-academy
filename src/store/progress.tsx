import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import { load, save, todayISO, daysBetween } from '../lib/storage';
import { XP, levelForXp } from '../lib/xp';
import type { SkillId } from '../content/types';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface LessonProgress {
  read: boolean;
  quizBest?: number; // 0..1
  exercisesDone: string[];
}
export interface SkillRec { correct: number; total: number }
export interface ScenarioRec { attempts: number; correct: boolean }
export interface ChallengeRec { completed: boolean; reflection?: string }
export interface SimRec { goals: string[]; completed: boolean }
export interface PromptRec { runs: number; bestScore: number }
export interface CertRec { best: number; passed: boolean }

export interface ProgressState {
  version: number;
  xp: number;
  lessons: Record<string, LessonProgress>;
  skillMastery: Record<string, SkillRec>;
  scenarios: Record<string, ScenarioRec>;
  challenges: Record<string, ChallengeRec>;
  simMissions: Record<string, SimRec>;
  promptLab: Record<string, PromptRec>;
  cert: Record<string, CertRec>;
  certPassed: boolean;
  streak: { current: number; longest: number; lastActiveDay: string | null };
  bookmarks: string[];
  notes: Record<string, string>;
  dailyDoneDates: string[];
  seenBadges: string[];
}

const INITIAL: ProgressState = {
  version: 1,
  xp: 0,
  lessons: {},
  skillMastery: {},
  scenarios: {},
  challenges: {},
  simMissions: {},
  promptLab: {},
  cert: {},
  certPassed: false,
  streak: { current: 0, longest: 0, lastActiveDay: null },
  bookmarks: [],
  notes: {},
  dailyDoneDates: [],
  seenBadges: [],
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type Action =
  | { type: 'lesson/read'; lessonId: string }
  | { type: 'lesson/quiz'; lessonId: string; ratio: number; correct: number; skills: SkillId[]; perSkill: { skill: SkillId; correct: boolean }[] }
  | { type: 'lesson/exercise'; lessonId: string; exerciseId: string }
  | { type: 'scenario/answer'; scenarioId: string; correct: boolean; skills: SkillId[] }
  | { type: 'challenge/complete'; challengeId: string; reflection?: string; skills: SkillId[] }
  | { type: 'sim/goal'; missionId: string; goal: string }
  | { type: 'sim/complete'; missionId: string }
  | { type: 'promptlab/run'; taskId: string; score: number }
  | { type: 'cert/part'; partId: string; ratio: number; passed: boolean }
  | { type: 'cert/pass' }
  | { type: 'bookmark/toggle'; id: string }
  | { type: 'note/set'; id: string; text: string }
  | { type: 'daily/done'; date: string }
  | { type: 'badges/markSeen'; ids: string[] }
  | { type: 'reset' }
  | { type: 'import'; state: ProgressState };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function touchStreak(s: ProgressState): ProgressState['streak'] {
  const today = todayISO();
  const last = s.streak.lastActiveDay;
  if (last === today) return s.streak;
  if (!last) return { current: 1, longest: Math.max(1, s.streak.longest), lastActiveDay: today };
  const gap = daysBetween(last, today);
  const current = gap === 1 ? s.streak.current + 1 : 1;
  return { current, longest: Math.max(current, s.streak.longest), lastActiveDay: today };
}

function addSkill(map: Record<string, SkillRec>, skill: string, correct: boolean): Record<string, SkillRec> {
  const cur = map[skill] ?? { correct: 0, total: 0 };
  return { ...map, [skill]: { correct: cur.correct + (correct ? 1 : 0), total: cur.total + 1 } };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function reducer(state: ProgressState, action: Action): ProgressState {
  let s: ProgressState = { ...state, streak: touchStreak(state) };

  switch (action.type) {
    case 'lesson/read': {
      const prev = s.lessons[action.lessonId] ?? { read: false, exercisesDone: [] };
      if (prev.read) return s;
      return { ...s, xp: s.xp + XP.lessonRead, lessons: { ...s.lessons, [action.lessonId]: { ...prev, read: true } } };
    }
    case 'lesson/quiz': {
      const prev = s.lessons[action.lessonId] ?? { read: true, exercisesDone: [] };
      const wasBest = prev.quizBest ?? 0;
      const improved = action.ratio > wasBest;
      let xp = s.xp;
      if (improved) {
        xp += action.correct * XP.quizPerCorrect;
        if (action.ratio === 1) xp += XP.quizPerfectBonus;
      }
      let skillMastery = s.skillMastery;
      for (const ps of action.perSkill) skillMastery = addSkill(skillMastery, ps.skill, ps.correct);
      return {
        ...s,
        xp,
        skillMastery,
        lessons: { ...s.lessons, [action.lessonId]: { ...prev, read: true, quizBest: Math.max(wasBest, action.ratio) } },
      };
    }
    case 'lesson/exercise': {
      const prev = s.lessons[action.lessonId] ?? { read: true, exercisesDone: [] };
      if (prev.exercisesDone.includes(action.exerciseId)) return s;
      return {
        ...s,
        xp: s.xp + XP.exercise,
        lessons: { ...s.lessons, [action.lessonId]: { ...prev, exercisesDone: [...prev.exercisesDone, action.exerciseId] } },
      };
    }
    case 'scenario/answer': {
      const prev = s.scenarios[action.scenarioId] ?? { attempts: 0, correct: false };
      let skillMastery = s.skillMastery;
      for (const sk of action.skills) skillMastery = addSkill(skillMastery, sk, action.correct);
      const firstCorrect = action.correct && !prev.correct;
      return {
        ...s,
        xp: s.xp + (firstCorrect ? XP.scenarioCorrect : 0),
        skillMastery,
        scenarios: { ...s.scenarios, [action.scenarioId]: { attempts: prev.attempts + 1, correct: prev.correct || action.correct } },
      };
    }
    case 'challenge/complete': {
      const prev = s.challenges[action.challengeId];
      const already = prev?.completed;
      let skillMastery = s.skillMastery;
      if (!already) for (const sk of action.skills) skillMastery = addSkill(skillMastery, sk, true);
      return {
        ...s,
        xp: s.xp + (already ? 0 : XP.challengeComplete),
        skillMastery,
        challenges: { ...s.challenges, [action.challengeId]: { completed: true, reflection: action.reflection ?? prev?.reflection } },
      };
    }
    case 'sim/goal': {
      const prev = s.simMissions[action.missionId] ?? { goals: [], completed: false };
      if (prev.goals.includes(action.goal)) return s;
      return {
        ...s,
        xp: s.xp + XP.simGoal,
        simMissions: { ...s.simMissions, [action.missionId]: { ...prev, goals: [...prev.goals, action.goal] } },
      };
    }
    case 'sim/complete': {
      const prev = s.simMissions[action.missionId] ?? { goals: [], completed: false };
      if (prev.completed) return s;
      return { ...s, xp: s.xp + 20, simMissions: { ...s.simMissions, [action.missionId]: { ...prev, completed: true } } };
    }
    case 'promptlab/run': {
      const prev = s.promptLab[action.taskId] ?? { runs: 0, bestScore: 0 };
      const improved = action.score > prev.bestScore;
      let xp = s.xp + XP.promptLabRun;
      if (improved && action.score >= 80 && prev.bestScore < 80) xp += XP.promptLabHighScore;
      return {
        ...s,
        xp,
        promptLab: { ...s.promptLab, [action.taskId]: { runs: prev.runs + 1, bestScore: Math.max(prev.bestScore, action.score) } },
      };
    }
    case 'cert/part': {
      const prev = s.cert[action.partId] ?? { best: 0, passed: false };
      const newlyPassed = action.passed && !prev.passed;
      return {
        ...s,
        xp: s.xp + (newlyPassed ? XP.certPartPass : 0),
        cert: { ...s.cert, [action.partId]: { best: Math.max(prev.best, action.ratio), passed: prev.passed || action.passed } },
      };
    }
    case 'cert/pass': {
      if (s.certPassed) return s;
      return { ...s, certPassed: true, xp: s.xp + XP.certPass };
    }
    case 'bookmark/toggle': {
      const has = s.bookmarks.includes(action.id);
      return { ...s, bookmarks: has ? s.bookmarks.filter((b) => b !== action.id) : [...s.bookmarks, action.id] };
    }
    case 'note/set':
      return { ...s, notes: { ...s.notes, [action.id]: action.text } };
    case 'daily/done':
      if (s.dailyDoneDates.includes(action.date)) return s;
      return { ...s, dailyDoneDates: [...s.dailyDoneDates, action.date] };
    case 'badges/markSeen':
      return { ...s, seenBadges: Array.from(new Set([...s.seenBadges, ...action.ids])) };
    case 'reset':
      return { ...INITIAL, streak: { current: 0, longest: 0, lastActiveDay: null } };
    case 'import':
      return { ...INITIAL, ...action.state, version: 1 };
    default:
      return s;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface Ctx {
  state: ProgressState;
  dispatch: Dispatch<Action>;
  level: number;
}

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL, (init) => ({ ...init, ...load<Partial<ProgressState>>('progress', {}) }));

  useEffect(() => {
    save('progress', state);
  }, [state]);

  const value = useMemo<Ctx>(() => ({ state, dispatch, level: levelForXp(state.xp) }), [state]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): Ctx {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
