import { describe, it, expect } from 'vitest';
import { reducer, INITIAL_PROGRESS, type ProgressState } from './progress';
import { XP } from '../lib/xp';

const base = (): ProgressState => structuredClone(INITIAL_PROGRESS);

describe('progress reducer', () => {
  it('awards lesson/read XP once, not twice', () => {
    let s = base();
    s = reducer(s, { type: 'lesson/read', lessonId: 'l0' });
    expect(s.xp).toBe(XP.lessonRead);
    s = reducer(s, { type: 'lesson/read', lessonId: 'l0' });
    expect(s.xp).toBe(XP.lessonRead);
  });

  it('awards quiz XP only when the score improves', () => {
    let s = base();
    s = reducer(s, {
      type: 'lesson/quiz', lessonId: 'l0', ratio: 0.5, correct: 2,
      skills: ['prompting'], perSkill: [{ skill: 'prompting', correct: true }, { skill: 'prompting', correct: false }],
    });
    const afterFirst = s.xp;
    expect(afterFirst).toBe(2 * XP.quizPerCorrect);
    // worse re-attempt: no XP, best score preserved
    s = reducer(s, { type: 'lesson/quiz', lessonId: 'l0', ratio: 0.25, correct: 1, skills: ['prompting'], perSkill: [] });
    expect(s.xp).toBe(afterFirst);
    expect(s.lessons['l0'].quizBest).toBe(0.5);
    // perfect re-attempt: XP + perfect bonus
    s = reducer(s, { type: 'lesson/quiz', lessonId: 'l0', ratio: 1, correct: 4, skills: ['prompting'], perSkill: [] });
    expect(s.xp).toBe(afterFirst + 4 * XP.quizPerCorrect + XP.quizPerfectBonus);
    expect(s.lessons['l0'].quizBest).toBe(1);
  });

  it('tracks skill mastery from quiz per-skill results', () => {
    let s = base();
    s = reducer(s, {
      type: 'lesson/quiz', lessonId: 'l1', ratio: 0.67, correct: 2, skills: ['git'],
      perSkill: [{ skill: 'git', correct: true }, { skill: 'git', correct: true }, { skill: 'git', correct: false }],
    });
    expect(s.skillMastery.git).toEqual({ correct: 2, total: 3 });
  });

  it('records a scenario, awarding XP only on the first correct answer', () => {
    let s = base();
    s = reducer(s, { type: 'scenario/answer', scenarioId: 'sc-1', correct: false, skills: ['git'] });
    expect(s.xp).toBe(0);
    expect(s.scenarios['sc-1']).toEqual({ attempts: 1, correct: false });
    s = reducer(s, { type: 'scenario/answer', scenarioId: 'sc-1', correct: true, skills: ['git'] });
    expect(s.xp).toBe(XP.scenarioCorrect);
    s = reducer(s, { type: 'scenario/answer', scenarioId: 'sc-1', correct: true, skills: ['git'] });
    expect(s.xp).toBe(XP.scenarioCorrect);
    expect(s.scenarios['sc-1']).toEqual({ attempts: 3, correct: true });
  });

  it('advances the streak on consecutive days and resets after a gap', () => {
    let s = base();
    s = reducer({ ...s, streak: { current: 3, longest: 3, lastActiveDay: yesterday() } }, { type: 'lesson/read', lessonId: 'x' });
    expect(s.streak.current).toBe(4);
    expect(s.streak.longest).toBe(4);

    s = reducer({ ...base(), streak: { current: 9, longest: 9, lastActiveDay: '2000-01-01' } }, { type: 'lesson/read', lessonId: 'y' });
    expect(s.streak.current).toBe(1);
    expect(s.streak.longest).toBe(9);
  });

  it('cert/pass awards the big bonus exactly once', () => {
    let s = base();
    s = reducer(s, { type: 'cert/pass' });
    expect(s.certPassed).toBe(true);
    expect(s.xp).toBe(XP.certPass);
    s = reducer(s, { type: 'cert/pass' });
    expect(s.xp).toBe(XP.certPass);
  });

  it('reset returns a clean state', () => {
    let s = base();
    s = reducer(s, { type: 'lesson/read', lessonId: 'a' });
    s = reducer(s, { type: 'bookmark/toggle', id: 'a' });
    s = reducer(s, { type: 'reset' });
    expect(s.xp).toBe(0);
    expect(s.bookmarks).toEqual([]);
    expect(s.lessons).toEqual({});
  });

  it('bookmark/toggle adds then removes', () => {
    let s = base();
    s = reducer(s, { type: 'bookmark/toggle', id: 'l5' });
    expect(s.bookmarks).toContain('l5');
    s = reducer(s, { type: 'bookmark/toggle', id: 'l5' });
    expect(s.bookmarks).not.toContain('l5');
  });
});

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
