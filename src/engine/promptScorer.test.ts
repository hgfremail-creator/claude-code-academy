import { describe, it, expect } from 'vitest';
import { scorePrompt } from './promptScorer';
import { PROMPT_TASKS } from '../content/promptLab';

describe('promptScorer', () => {
  it('gives a near-zero score to a one-liner', () => {
    for (const task of PROMPT_TASKS) {
      const r = scorePrompt(task, 'fix it');
      expect(r.total).toBeLessThanOrEqual(10);
    }
  });

  it('scores every task\'s own strong sample prompt at 70+', () => {
    for (const task of PROMPT_TASKS) {
      const r = scorePrompt(task, task.sampleStrongPrompt);
      expect(r.total, task.title).toBeGreaterThanOrEqual(70);
      expect(r.total).toBeLessThanOrEqual(100);
    }
  });

  it('always returns six criteria, each capped at 20', () => {
    const r = scorePrompt(PROMPT_TASKS[0], PROMPT_TASKS[0].sampleStrongPrompt);
    expect(r.criteria).toHaveLength(6);
    for (const c of r.criteria) {
      expect(c.score).toBeGreaterThanOrEqual(0);
      expect(c.score).toBeLessThanOrEqual(20);
    }
  });

  it('a stronger prompt never scores lower than a weaker one', () => {
    const task = PROMPT_TASKS[0];
    const weak = scorePrompt(task, 'fix the bug in the export function').total;
    const mid = scorePrompt(task, 'Fix the intermittent save bug in src/editor/useAutosave.ts. Run the tests after.').total;
    const strong = scorePrompt(task, task.sampleStrongPrompt).total;
    expect(mid).toBeGreaterThanOrEqual(weak);
    expect(strong).toBeGreaterThan(mid);
  });

  it('flags missing verification for a prompt with no check', () => {
    const r = scorePrompt(PROMPT_TASKS[0], 'Rewrite the autosave hook to be cleaner and simpler in structure.');
    expect(r.improvements.join(' ').toLowerCase()).toContain('verification');
  });
});
