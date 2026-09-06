import { describe, it, expect } from 'vitest';
import { LESSONS, LESSON_BY_ID, ALL_QUIZ_QUESTIONS } from './lessons';
import { LEVELS } from './levels';
import { SKILLS } from './skills';
import { GLOSSARY, GLOSSARY_BY_ID } from './glossary';
import { SCENARIOS } from './scenarios';
import { COMMANDS, COMMAND_BY_ID } from './commands';
import { CHALLENGES } from './challenges';
import { PROJECTS } from './projects';
import { CERT_PARTS } from './certification';
import { GRAPH_NODES, GRAPH_EDGES } from './knowledgeGraph';

const SKILL_IDS = new Set(SKILLS.map((s) => s.id));

describe('lessons', () => {
  it('have unique ids', () => {
    const ids = LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cover every level 0..21', () => {
    for (const lvl of LEVELS) {
      expect(LESSONS.some((l) => l.level === lvl.level), `level ${lvl.level}`).toBe(true);
    }
  });

  it('reference only real prerequisite lesson ids', () => {
    for (const l of LESSONS) {
      for (const p of l.prerequisites) expect(LESSON_BY_ID[p], `${l.id} -> ${p}`).toBeDefined();
    }
  });

  it('reference only real related lesson ids', () => {
    for (const l of LESSONS) {
      for (const r of l.relatedLessons) expect(LESSON_BY_ID[r], `${l.id} -> ${r}`).toBeDefined();
    }
  });

  it('use only known skill ids', () => {
    for (const l of LESSONS) {
      for (const s of l.skills) expect(SKILL_IDS.has(s), `${l.id}: ${s}`).toBe(true);
    }
  });

  it('have at least one objective, one exercise, and one quiz question each', () => {
    for (const l of LESSONS) {
      expect(l.objectives.length, l.id).toBeGreaterThan(0);
      expect(l.exercises.length, l.id).toBeGreaterThan(0);
      expect(l.quiz.length, l.id).toBeGreaterThan(0);
    }
  });

  it('have resource links that look like URLs', () => {
    for (const l of LESSONS) {
      for (const r of l.resources) expect(r.url).toMatch(/^https?:\/\//);
    }
  });

  it('order-steps exercises have a correctOrder that is a permutation of its items', () => {
    for (const l of LESSONS) {
      for (const ex of l.exercises) {
        if (ex.kind === 'order-steps') {
          expect(ex.items, ex.id).toBeDefined();
          expect(ex.correctOrder, ex.id).toBeDefined();
          const n = ex.items!.length;
          expect([...ex.correctOrder!].sort((a, b) => a - b)).toEqual([...Array(n).keys()]);
        }
      }
    }
  });
});

describe('quiz questions (all sources)', () => {
  const pools = [
    ['lessons', ALL_QUIZ_QUESTIONS],
    ['scenarios', SCENARIOS.map((s) => ({ ...s, options: s.options, correctAnswer: s.correctAnswer }))],
    ['cert', CERT_PARTS.flatMap((p) => p.questions)],
  ] as const;

  for (const [name, qs] of pools) {
    it(`${name}: every correctAnswer indexes a real option and has an explanation`, () => {
      for (const q of qs) {
        expect(q.options.length, JSON.stringify(q).slice(0, 80)).toBeGreaterThanOrEqual(2);
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswer).toBeLessThan(q.options.length);
        expect((q as { explanation: string }).explanation.length).toBeGreaterThan(10);
      }
    });
  }

  it('lesson quiz question ids are unique', () => {
    const ids = ALL_QUIZ_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('glossary', () => {
  it('seeAlso and lesson links resolve', () => {
    for (const t of GLOSSARY) {
      for (const s of t.seeAlso) expect(GLOSSARY_BY_ID[s], `${t.id} seeAlso ${s}`).toBeDefined();
      for (const l of t.lessons) expect(LESSON_BY_ID[l], `${t.id} lesson ${l}`).toBeDefined();
    }
  });
  it('has unique term ids', () => {
    const ids = GLOSSARY.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('commands', () => {
  it('related command ids resolve', () => {
    for (const c of COMMANDS) {
      for (const r of c.related) expect(COMMAND_BY_ID[r], `${c.id} -> ${r}`).toBeDefined();
    }
  });
});

describe('scenarios / challenges / projects use known skills', () => {
  it('scenarios', () => {
    for (const s of SCENARIOS) for (const sk of s.skills) expect(SKILL_IDS.has(sk), `${s.id}: ${sk}`).toBe(true);
  });
  it('challenges', () => {
    for (const c of CHALLENGES) for (const sk of c.skills) expect(SKILL_IDS.has(sk), `${c.id}: ${sk}`).toBe(true);
  });
  it('projects', () => {
    for (const p of PROJECTS) for (const sk of p.skills) expect(SKILL_IDS.has(sk), `${p.id}: ${sk}`).toBe(true);
  });
});

describe('knowledge graph', () => {
  it('every edge connects two real nodes', () => {
    const ids = new Set(GRAPH_NODES.map((n) => n.id));
    for (const e of GRAPH_EDGES) {
      expect(ids.has(e.from), `edge from ${e.from}`).toBe(true);
      expect(ids.has(e.to), `edge to ${e.to}`).toBe(true);
    }
  });
  it('every node with a lesson points at a real lesson', () => {
    for (const n of GRAPH_NODES) {
      if (n.lesson) expect(LESSON_BY_ID[n.lesson], `${n.id} -> ${n.lesson}`).toBeDefined();
    }
  });
});
