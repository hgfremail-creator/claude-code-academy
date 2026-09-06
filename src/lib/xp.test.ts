import { describe, it, expect } from 'vitest';
import { levelForXp, levelProgress } from './xp';

describe('xp / level curve', () => {
  it('starts at level 0 with no XP', () => {
    expect(levelForXp(0)).toBe(0);
  });

  it('is monotonic non-decreasing in XP', () => {
    let prev = 0;
    for (let xp = 0; xp <= 200_000; xp += 137) {
      const lvl = levelForXp(xp);
      expect(lvl).toBeGreaterThanOrEqual(prev);
      prev = lvl;
    }
  });

  it('caps at level 21', () => {
    expect(levelForXp(10_000_000)).toBe(21);
  });

  it('crosses to level 1 at exactly the first threshold (120 XP)', () => {
    expect(levelForXp(119)).toBe(0);
    expect(levelForXp(120)).toBe(1);
  });

  it('levelProgress reports a bounded percentage and a higher next threshold', () => {
    for (const xp of [0, 50, 120, 500, 5000, 50000]) {
      const p = levelProgress(xp);
      expect(p.pct).toBeGreaterThanOrEqual(0);
      expect(p.pct).toBeLessThanOrEqual(100);
      expect(p.nextAt).toBeGreaterThanOrEqual(xp - p.into);
      expect(p.into).toBeGreaterThanOrEqual(0);
    }
  });
});
