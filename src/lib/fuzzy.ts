// Tiny typo-tolerant matcher used by global search alongside Fuse for scoring.

export function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** Levenshtein distance, capped for speed. */
export function editDistance(a: string, b: string, cap = 4): number {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  const prev = new Array(b.length + 1);
  const cur = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    let rowMin = cur[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > cap) return cap + 1;
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
  }
  return prev[b.length];
}

/** Does query loosely match text? Handles substrings, token prefixes, and 1–2 char typos. */
export function fuzzyMatch(query: string, text: string): boolean {
  const q = normalize(query);
  const t = normalize(text);
  if (!q) return true;
  if (t.includes(q)) return true;
  const qTokens = q.split(' ');
  const tTokens = t.split(' ');
  return qTokens.every((qt) => {
    if (qt.length <= 2) return tTokens.some((tt) => tt.startsWith(qt));
    return tTokens.some((tt) => tt.includes(qt) || tt.startsWith(qt) || editDistance(qt, tt, qt.length > 6 ? 3 : 2) <= (qt.length > 6 ? 3 : 2));
  });
}
