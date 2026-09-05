import type { SimMission } from './types';

export const MISSIONS: SimMission[] = [
  {
    id: 'm-explore',
    title: 'Explore an unfamiliar project',
    brief:
      'You just ran `claude` in a small project you have never seen. Practice the read-only exploration loop before touching anything.',
    goals: [
      'Run `/context` to see what loaded',
      'Use `ls` and `cat` to look around',
      'Ask Claude for a tour: try `tour` or "explain this project"',
      'Ask where a feature lives: try `find auth`',
      'Do NOT make any changes yet',
    ],
    hints: [
      'In a real session you would not run grep yourself — you would ask Claude. Here, `find <term>` simulates that.',
      'Notice how a scoped question ("what runs the tests?") is cheaper than "explain everything".',
      'Type `/help` to see the simulated commands.',
    ],
    teaches: ['agent-loop', 'codebase', 'context', 'navigation'],
    diff: '',
    files: [
      { path: 'package.json', content: '{\n  "name": "notes-api",\n  "scripts": {\n    "dev": "node src/server.js",\n    "test": "vitest run"\n  },\n  "dependencies": { "express": "^4", "better-sqlite3": "^9" }\n}' },
      { path: 'README.md', content: '# notes-api\n\nA tiny REST API for personal notes. SQLite storage.\n\n- `npm run dev` — start on :3000\n- `npm test` — run the vitest suite' },
      { path: 'src/server.js', content: "const express = require('express');\nconst notes = require('./routes/notes');\nconst { requireAuth } = require('./auth');\nconst app = express();\napp.use(express.json());\napp.use('/notes', requireAuth, notes);\napp.listen(3000);" },
      { path: 'src/auth.js', content: "// Very small bearer-token check\nconst TOKENS = new Set([process.env.API_TOKEN]);\nfunction requireAuth(req, res, next) {\n  const t = (req.headers.authorization || '').replace('Bearer ', '');\n  if (!TOKENS.has(t)) return res.status(401).json({ error: 'unauthorized' });\n  next();\n}\nmodule.exports = { requireAuth };" },
      { path: 'src/routes/notes.js', content: "const router = require('express').Router();\nconst db = require('../db');\nrouter.get('/', (req, res) => res.json(db.all()));\nrouter.post('/', (req, res) => res.status(201).json(db.create(req.body)));\nmodule.exports = router;" },
      { path: 'src/db.js', content: "const Database = require('better-sqlite3');\nconst d = new Database('notes.db');\nd.exec('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, body TEXT)');\nmodule.exports = {\n  all: () => d.prepare('SELECT * FROM notes').all(),\n  create: (n) => { const r = d.prepare('INSERT INTO notes (body) VALUES (?)').run(n.body); return { id: r.lastInsertRowid, ...n }; },\n};" },
      { path: 'test/notes.test.js', content: "import { it, expect } from 'vitest';\nit('lists notes', () => { expect(Array.isArray([])).toBe(true); });" },
    ],
  },
  {
    id: 'm-diff-review',
    title: 'Review a diff before committing',
    brief:
      'Claude made changes for a task: "add a DELETE /notes/:id endpoint". Review the diff and decide what to do. One of the changed files is not part of the task.',
    goals: [
      'Run `/diff` and read every hunk',
      'Ask `explain diff` for a grouped summary',
      'Identify the change that is unrelated to the task',
      'Decide: `commit` the good part, or `reject` the unrelated part',
    ],
    hints: [
      'The task was DELETE endpoint only. Anything else is scope creep.',
      'Unrelated reformatting or config edits make review and revert harder — push back.',
      'Try `commit` and `reject` to see how each is scored.',
    ],
    teaches: ['git', 'navigation', 'security'],
    diff: `diff --git a/src/routes/notes.js b/src/routes/notes.js
@@
 router.post('/', (req, res) => res.status(201).json(db.create(req.body)));
+router.delete('/:id', (req, res) => {
+  const ok = db.remove(Number(req.params.id));
+  return ok ? res.status(204).end() : res.status(404).json({ error: 'not found' });
+});
 module.exports = router;

diff --git a/src/db.js b/src/db.js
@@
   create: (n) => { const r = d.prepare('INSERT INTO notes (body) VALUES (?)').run(n.body); return { id: r.lastInsertRowid, ...n }; },
+  remove: (id) => d.prepare('DELETE FROM notes WHERE id = ?').run(id).changes > 0,
 };

diff --git a/src/server.js b/src/server.js
@@
-app.listen(3000);
+app.listen(process.env.PORT || 3000);
+app.set('json spaces', 2);   // unrelated: pretty-print all responses`,
    files: [
      { path: 'src/routes/notes.js', content: '(see /diff — this file gained a DELETE route)' },
      { path: 'src/db.js', content: '(see /diff — this file gained a remove() helper)' },
      { path: 'src/server.js', content: '(see /diff — port change + an unrelated json-spaces tweak)' },
    ],
  },
  {
    id: 'm-context',
    title: 'Manage a polluted context',
    brief:
      "You've been in this session a while. You fixed a bug, then explored deployment, then started a new feature. Claude is getting sloppy. Decide what to do.",
    goals: [
      'Run `/context` to see the situation',
      'Recognize the three unrelated topics in the history',
      'Choose the right move: `/clear`, `/compact`, or `continue` — and defend it',
      'Try `notes` to persist state before clearing',
    ],
    hints: [
      'Three unrelated topics in one window = classic pollution.',
      '`/compact` keeps a summary; `/clear` wipes. Which fits a task switch?',
      'Write state to a notes file first so nothing important is lost.',
    ],
    teaches: ['context', 'prompting'],
    diff: '',
    files: [
      { path: 'SESSION.md', content: '## This session so far\n1. Fixed the pagination off-by-one in list()  ✅ committed\n2. Discussed deploy options (Fly vs Render) — no code\n3. Started: add tag support to notes  ⬅ current task, barely begun' },
    ],
  },
];

export const MISSION_BY_ID: Record<string, SimMission> = Object.fromEntries(MISSIONS.map((m) => [m.id, m]));
