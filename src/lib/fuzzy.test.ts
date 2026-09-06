import { describe, it, expect } from 'vitest';
import { editDistance, fuzzyMatch, normalize } from './fuzzy';

describe('normalize', () => {
  it('lowercases and collapses non-alphanumerics to single spaces', () => {
    expect(normalize('CLAUDE.md  Files!')).toBe('claude md files');
  });
});

describe('editDistance', () => {
  it('is 0 for identical strings', () => {
    expect(editDistance('subagent', 'subagent')).toBe(0);
  });
  it('counts single-character edits', () => {
    expect(editDistance('subagent', 'subagant')).toBe(1);
    expect(editDistance('claude', 'clause')).toBe(1);
  });
  it('returns cap+1 when far apart (short-circuits)', () => {
    expect(editDistance('a', 'abcdefghij', 3)).toBe(4);
  });
});

describe('fuzzyMatch', () => {
  it('matches exact substrings', () => {
    expect(fuzzyMatch('context', 'Context management for agents')).toBe(true);
  });
  it('tolerates small typos on longer tokens', () => {
    expect(fuzzyMatch('subagant', 'subagents delegation')).toBe(true);
    expect(fuzzyMatch('claud md', 'CLAUDE.md files and imports')).toBe(true);
  });
  it('matches short queries by token prefix', () => {
    expect(fuzzyMatch('mcp', 'MCP server transports')).toBe(true);
  });
  it('rejects unrelated text', () => {
    expect(fuzzyMatch('kubernetes helm chart', 'writing a good CLAUDE.md file')).toBe(false);
  });
  it('empty query matches anything', () => {
    expect(fuzzyMatch('', 'whatever')).toBe(true);
  });
});
