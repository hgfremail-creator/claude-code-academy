import type { SimMission, SimLine } from './types';

export interface SimState {
  mission: SimMission;
  contextTopics: string[];
  changesReviewed: boolean;
  completedGoals: string[];
}

export interface SimResult {
  lines: SimLine[];
  state: SimState;
  /** goal ids newly satisfied this command */
  newlyCompleted: string[];
}

export function initSim(mission: SimMission): SimState {
  return { mission, contextTopics: [], changesReviewed: false, completedGoals: [] };
}

const HELP = `Simulated Claude Code — available commands:
  /help              this list
  /context           what is loaded + context health
  /diff              show pending changes
  /status            session status
  /clear             wipe conversation context
  /compact [focus]   summarize conversation, keep key state
  ls [path]          list files
  cat <path>         show a file
  tour               ask Claude for a project tour
  find <term>        ask Claude to locate where <term> lives
  explain diff       ask Claude to summarize pending changes by purpose
  notes              write current state to a notes file
  commit             commit the pending changes
  reject             reject / revert an unrelated part of the changes
  continue           keep working in the same session
  <anything else>    treated as a natural-language prompt to Claude`;

function mark(state: SimState, goalMatch: string): string[] {
  const g = state.mission.goals.find((x) => x.toLowerCase().includes(goalMatch.toLowerCase()));
  if (g && !state.completedGoals.includes(g)) {
    state.completedGoals.push(g);
    return [g];
  }
  return [];
}

export function runCommand(state: SimState, raw: string): SimResult {
  const input = raw.trim();
  const lower = input.toLowerCase();
  const lines: SimLine[] = [{ kind: 'user', text: input }];
  const newlyCompleted: string[] = [];
  const m = state.mission;

  const push = (kind: SimLine['kind'], text: string) => lines.push({ kind, text });
  const done = (match: string) => newlyCompleted.push(...mark(state, match));

  if (lower === '/help' || lower === 'help') {
    push('system', HELP);
  } else if (lower === '/context') {
    const topics = state.contextTopics.length ? state.contextTopics : inferTopics(m);
    const full = topics.length >= 3;
    push('system', `Memory files: CLAUDE.md (loaded)\nConversation topics in context: ${topics.join(', ') || '(fresh)'}\nContext health: ${full ? '⚠ crowded — multiple unrelated topics' : 'ok'}`);
    done('/context');
    if (m.id === 'm-context') {
      push('claude', full
        ? 'Heads up: this window holds a bug fix, a deployment discussion, and a new feature. That mix tends to degrade my responses. Consider /clear (task switch) after saving state, or /compact if you want a summary kept.'
        : 'Context looks focused.');
    }
  } else if (lower === '/status') {
    push('system', `Session: sim-${m.id}\nModel: (simulated)\nPermission mode: default (Manual)\nPending changes: ${m.diff ? 'yes — run /diff' : 'none'}`);
  } else if (lower === '/diff') {
    if (!m.diff) {
      push('system', 'No pending changes.');
    } else {
      push('diff', m.diff);
      state.changesReviewed = true;
      done('/diff');
    }
  } else if (lower === '/clear') {
    state.contextTopics = [];
    push('system', 'Context cleared. CLAUDE.md reloaded.');
    if (m.id === 'm-context') {
      done('/clear');
      push('claude', 'Clean slate. If you saved state to a notes file, point me at it and we continue on the tag feature with a sharp prompt.');
    }
  } else if (lower.startsWith('/compact')) {
    push('system', 'Conversation compacted. Kept: key decisions, modified files, test commands.');
    if (m.id === 'm-context') {
      push('claude', 'Compaction keeps a summary of all three topics — useful mid-task, but for a clean switch to the tag feature, /clear after saving state is usually better.');
    }
  } else if (lower === 'ls' || lower.startsWith('ls ')) {
    const prefix = input.slice(2).trim();
    const paths = m.files.map((f) => f.path).filter((p) => !prefix || p.startsWith(prefix));
    push('tool', paths.length ? paths.join('\n') : '(nothing here)');
    done('ls');
  } else if (lower.startsWith('cat ')) {
    const p = input.slice(4).trim();
    const f = m.files.find((x) => x.path === p || x.path.endsWith('/' + p));
    push('tool', f ? f.content : `cat: ${p}: no such file`);
    done('cat');
  } else if (lower === 'tour' || lower.includes('explain this project') || lower.includes('give me a tour')) {
    push('claude', projectTour(m));
    state.contextTopics.push('project tour');
    done('tour');
    done('explain this project');
  } else if (lower.startsWith('find ')) {
    const term = input.slice(5).trim();
    push('claude', findTerm(m, term));
    state.contextTopics.push(`search: ${term}`);
    done('find');
  } else if (lower === 'explain diff' || lower.includes('summarize the changes') || lower.includes('what changed')) {
    if (!m.diff) push('claude', 'There are no pending changes to summarize.');
    else {
      push('claude', explainDiff(m));
      state.changesReviewed = true;
      done('unrelated');
      done('explain diff');
    }
  } else if (lower === 'notes' || lower.includes('write') && lower.includes('notes')) {
    push('tool', 'Wrote SESSION-NOTES.md with: current task, decisions made, files touched, open questions.');
    push('claude', 'State saved. Now it is safe to /clear without losing the thread.');
    done('notes');
    done('persist');
  } else if (lower === 'commit') {
    if (!state.changesReviewed) {
      push('error', 'You have not run /diff or asked for a summary yet. Review before you commit.');
    } else if (m.id === 'm-diff-review') {
      push('claude', 'Committing the DELETE endpoint + db.remove() as one commit: "add DELETE /notes/:id". The unrelated `json spaces` / port tweak in server.js is left out — flag it separately or revert it.');
      push('system', '[1 file group committed] — server.js unrelated change still pending');
      done('commit');
      done('decide');
    } else {
      push('claude', 'Committed with a descriptive message.');
      done('commit');
    }
  } else if (lower === 'reject' || lower.includes('revert')) {
    if (m.id === 'm-diff-review') {
      push('claude', 'Reverted the `app.set("json spaces", 2)` line and the PORT change in server.js — those were not part of "add a DELETE endpoint". The DELETE route and db.remove() remain, ready to commit.');
      done('reject');
      done('decide');
      done('unrelated');
    } else {
      push('claude', 'Reverted the last change.');
    }
  } else if (lower === 'continue') {
    if (m.id === 'm-context') {
      push('claude', 'We can continue, but with a bug fix and a deployment tangent still in context, expect me to be less reliable on the tag feature. A /clear (after saving notes) usually wins here.');
    } else {
      push('claude', 'Continuing in the same session.');
    }
    done('continue');
  } else if (input === '') {
    lines.pop();
  } else {
    // Treated as a natural-language prompt
    push('claude', genericPrompt(m, input));
    state.contextTopics.push('ad-hoc question');
  }

  return { lines, state, newlyCompleted };
}

function inferTopics(m: SimMission): string[] {
  if (m.id === 'm-context') return ['pagination bug fix', 'deploy options (Fly vs Render)', 'add tag support (current)'];
  return [];
}

function projectTour(m: SimMission): string {
  if (m.id === 'm-explore') {
    return [
      'This is **notes-api** — a small Express REST API with SQLite storage.',
      '• Entry point: `src/server.js` — mounts `/notes` behind `requireAuth`.',
      '• Auth: `src/auth.js` — a bearer-token check against `process.env.API_TOKEN`.',
      '• Routes: `src/routes/notes.js` — GET list, POST create.',
      '• Data: `src/db.js` — thin better-sqlite3 wrapper.',
      '• Run: `npm run dev` (port 3000). Test: `npm test` (vitest).',
      'Nothing here has been modified. Ask me to trace a request or point at a specific area next.',
    ].join('\n');
  }
  return 'This is a small project. Use `ls` and `cat` to look around, then ask a scoped question.';
}

function findTerm(m: SimMission, term: string): string {
  if (m.id === 'm-explore' && /auth/i.test(term)) {
    return 'Authentication lives in `src/auth.js` (`requireAuth`), and it is applied in `src/server.js:5` — `app.use(\'/notes\', requireAuth, notes)`. Tokens come from `process.env.API_TOKEN`. There is no login flow; it is a static bearer token.';
  }
  if (m.id === 'm-explore' && /(db|database|sql|store)/i.test(term)) {
    return 'Storage is `src/db.js` — a better-sqlite3 wrapper exposing `all()` and `create()`. The table is created inline. `src/routes/notes.js` is the only caller.';
  }
  return `Searching for "${term}"... (in a real session I would grep the tree and report file:line matches). Try \`find auth\` or \`find db\` in this mission.`;
}

function explainDiff(m: SimMission): string {
  if (m.id === 'm-diff-review') {
    return [
      'Grouped by purpose:',
      '1. **DELETE endpoint (the task)** — `src/routes/notes.js` adds `router.delete(\'/:id\')`; `src/db.js` adds `remove(id)`. Correct: 404 when nothing deleted, 204 on success.',
      '2. **Unrelated** — `src/server.js` also changes `app.listen(3000)` to use `process.env.PORT` **and** adds `app.set(\'json spaces\', 2)`. Neither is part of "add a DELETE endpoint". The json-spaces change affects every response.',
      'Recommendation: commit group 1; revert or separately justify group 2.',
    ].join('\n');
  }
  return 'No structured summary available for this mission.';
}

function genericPrompt(m: SimMission, input: string): string {
  if (/delete|remove/i.test(input) && m.id === 'm-diff-review') {
    return 'The DELETE route is already in the pending diff — run `/diff` to review it rather than asking me to write it again.';
  }
  if (/test/i.test(input)) {
    return 'Run `npm test` (vitest). In this simulator, imagine the output — the teaching point is to demand the output as evidence, not take "it passes" on faith.';
  }
  return 'In a real session I would act on that. For this mission, focus on the goals in the sidebar — type `/help` for the commands that matter here.';
}
