import { describe, it, expect } from 'vitest';
import { search, ALL_DOCS } from './search';

describe('global search', () => {
  it('indexes every content type', () => {
    const kinds = new Set(ALL_DOCS.map((d) => d.kind));
    for (const k of ['Lesson', 'Command', 'Glossary', 'Troubleshooting', 'Scenario', 'Challenge', 'Project', 'Cheat sheet']) {
      expect(kinds.has(k as never)).toBe(true);
    }
  });

  it('returns nothing for an empty query', () => {
    expect(search('')).toEqual([]);
  });

  it('tolerates typos ("claud.md" -> CLAUDE.md)', () => {
    const titles = search('claud.md').map((r) => r.title.toLowerCase());
    expect(titles.some((t) => t.includes('claude.md'))).toBe(true);
  });

  it('tolerates typos ("subagant" -> Subagent)', () => {
    const titles = search('subagant').map((r) => r.title.toLowerCase());
    expect(titles.some((t) => t.includes('subagent'))).toBe(true);
  });

  it('every result has a routable "to" path', () => {
    for (const r of search('context')) {
      expect(r.to.startsWith('/')).toBe(true);
    }
  });
});
