import type { PromptTask } from '../content/types';

export interface CriterionScore {
  key: string;
  label: string;
  score: number; // 0..20
  max: 20;
  notes: string;
}

export interface PromptScore {
  total: number; // 0..100 (roughly — safety can push structure)
  criteria: CriterionScore[];
  strengths: string[];
  improvements: string[];
}

const LABELS: Record<string, string> = {
  clarity: 'Clarity',
  context: 'Context',
  constraints: 'Constraints',
  verification: 'Verification',
  scope: 'Scope',
  safety: 'Safety & control',
};

function countHits(text: string, keywords: string[]): { hits: number; matched: string[] } {
  const t = text.toLowerCase();
  const matched = keywords.filter((k) => t.includes(k.toLowerCase()));
  return { hits: matched.length, matched };
}

export function scorePrompt(task: PromptTask, prompt: string): PromptScore {
  const text = prompt.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const criteria: CriterionScore[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];

  const rubricKeys: (keyof PromptTask['rubric'])[] = ['clarity', 'context', 'constraints', 'verification', 'scope', 'safety'];

  const tooShort = words < 8;

  for (const key of rubricKeys) {
    const keywords = task.rubric[key];
    const { hits } = countHits(text, keywords);
    // base from keyword coverage: 1 hit = 11, 2 = 14, 3+ = 17
    let score = hits >= 1 ? Math.min(17, 8 + Math.min(hits, 3) * 3) : 0;
    // a substantive prompt earns a small floor on every criterion
    if (words >= 40) score += 2;
    if (words >= 90) score += 1;

    // generic structural signals per criterion (up to +6)
    if (key === 'clarity') {
      if (words >= 20) score += 3;
      if (words >= 45) score += 1;
      if (/\b(goal|i want|implement|write a|add a|so that|expected)\b/i.test(text)) score += 2;
      if (tooShort) { score = Math.min(score, 4); improvements.push('Clarity: the prompt is very short — name the concrete outcome you want.'); }
    }
    if (key === 'context') {
      if (/[`@]|src\/|\.tsx?|\.jsx?|\.py|\.rb|\.go\b/i.test(text)) score += 3;
      if (/\b(pattern|follow|like|example|existing|in the file|located|lives in)\b/i.test(text)) score += 2;
      if (/\b(because|since|context|currently|the app|our)\b/i.test(text)) score += 1;
    }
    if (key === 'constraints') {
      if (/\b(do ?n['o]t|don't|no new|without|must not|only|keep the|no retry|do not modify|do not change)\b/i.test(text)) score += 4;
      if (/\b(no dependencies|match the|same behaviou?r|no functional change)\b/i.test(text)) score += 2;
    }
    if (key === 'verification') {
      if (/\b(run the|run it|run them|npm test|pytest|test suite|regression test|failing test|screenshot|compare|write .*(test|notes|doc)|document)\b/i.test(text)) score += 4;
      if (/\b(show me|paste|the output|prove|verify|until (they|it|all) pass|check that|summar|so (i|we) can verify)\b/i.test(text)) score += 3;
      if (score === 0) improvements.push('Verification: add a check Claude can run (tests, build, screenshot compare) and ask it to show the result.');
    }
    if (key === 'scope') {
      if (/\b(only|just this|do not touch|this file|this function|nothing else|unrelated|in scope|out of scope|stay (in|within))\b/i.test(text)) score += 5;
      if (/\b(do not modify|leave .* unchanged|do not change other)\b/i.test(text)) score += 2;
    }
    if (key === 'safety') {
      if (/\b(show me|before (you|implementing)|first,? (write|find|show)|plan|confirm|do not commit|do not push|stop (for|and)|the diff|for my review)\b/i.test(text)) score += 5;
      if (/\b(do not delete|ask me|approve)\b/i.test(text)) score += 2;
    }

    score = Math.max(0, Math.min(20, score));
    criteria.push({ key, label: LABELS[key], score, max: 20, notes: '' });
    if (score >= 15) strengths.push(`${LABELS[key]}: well covered.`);
    else if (score <= 7) improvements.push(`${LABELS[key]}: weak — see the model prompt for what "strong" looks like here.`);
  }

  // Total: average of 6 criteria, scaled to 100
  const raw = criteria.reduce((s, c) => s + c.score, 0); // 0..120
  const total = Math.round((raw / 120) * 100);

  if (words > 220) improvements.push('The prompt is long — trim anything Claude can infer; density beats volume.');
  if (!strengths.length) strengths.push('You engaged with the task — iterate using the feedback below.');

  return { total, criteria, strengths, improvements: dedupe(improvements) };
}

function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr));
}
