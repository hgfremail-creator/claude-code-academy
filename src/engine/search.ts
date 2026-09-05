import Fuse from 'fuse.js';
import { LESSONS } from '../content/lessons';
import { COMMANDS } from '../content/commands';
import { GLOSSARY } from '../content/glossary';
import { TROUBLESHOOTING } from '../content/troubleshooting';
import { SCENARIOS } from '../content/scenarios';
import { CHALLENGES } from '../content/challenges';
import { PROJECTS } from '../content/projects';
import { CHEATSHEET } from '../content/cheatsheet';

export interface SearchDoc {
  id: string;
  kind: 'Lesson' | 'Command' | 'Glossary' | 'Troubleshooting' | 'Scenario' | 'Challenge' | 'Project' | 'Cheat sheet';
  title: string;
  subtitle: string;
  body: string;
  to: string;
}

const docs: SearchDoc[] = [
  ...LESSONS.map((l) => ({
    id: l.id, kind: 'Lesson' as const, title: l.title, subtitle: `Level ${l.level} · ${l.category}`,
    body: `${l.tagline} ${l.objectives.join(' ')} ${l.body.slice(0, 400)}`, to: `/learn/${l.id}`,
  })),
  ...COMMANDS.map((c) => ({
    id: c.id, kind: 'Command' as const, title: c.name, subtitle: c.category,
    body: `${c.summary} ${c.whatItDoes} ${c.whenToUse}`, to: `/reference?cmd=${c.id}`,
  })),
  ...GLOSSARY.map((g) => ({
    id: g.id, kind: 'Glossary' as const, title: g.term, subtitle: 'Glossary',
    body: g.definition, to: `/glossary?term=${g.id}`,
  })),
  ...TROUBLESHOOTING.map((t) => ({
    id: t.id, kind: 'Troubleshooting' as const, title: t.symptom, subtitle: t.category,
    body: `${t.causes.join(' ')} ${t.solution}`, to: `/troubleshooting?id=${t.id}`,
  })),
  ...SCENARIOS.map((sc) => ({
    id: sc.id, kind: 'Scenario' as const, title: sc.situation, subtitle: `Scenario · ${sc.category}`,
    body: `${sc.question} ${sc.explanation}`, to: `/practice/scenarios?id=${sc.id}`,
  })),
  ...CHALLENGES.map((ch) => ({
    id: ch.id, kind: 'Challenge' as const, title: ch.title, subtitle: `Challenge · ${ch.pool}`,
    body: `${ch.scenario} ${ch.objective}`, to: `/challenges?id=${ch.id}`,
  })),
  ...PROJECTS.map((p) => ({
    id: p.id, kind: 'Project' as const, title: p.title, subtitle: `Project · ${p.tier}`,
    body: `${p.summary} ${p.requirements.join(' ')}`, to: `/projects?id=${p.id}`,
  })),
  ...CHEATSHEET.map((c) => ({
    id: c.id, kind: 'Cheat sheet' as const, title: c.command, subtitle: `Cheat sheet · ${c.section}`,
    body: c.description, to: `/reference/cheatsheet?q=${encodeURIComponent(c.command)}`,
  })),
];

const fuse = new Fuse(docs, {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'subtitle', weight: 0.15 },
    { name: 'body', weight: 0.35 },
  ],
  includeScore: true,
  threshold: 0.44, // typo tolerance
  ignoreLocation: true,
  minMatchCharLength: 2,
});

export function search(query: string, limit = 24): SearchDoc[] {
  const q = query.trim();
  if (!q) return [];
  return fuse.search(q, { limit }).map((r) => r.item);
}

export const ALL_DOCS = docs;
