import type { PromptTask } from './types';

// Prompt Lab tasks. The scorer (src/engine/promptScorer.ts) rewards presence of
// these keyword families and structural signals — it is a heuristic coach, not a grader.
export const PROMPT_TASKS: PromptTask[] = [
  {
    id: 'pt-1',
    title: 'Fix an intermittent bug',
    brief: 'Write the prompt you would send Claude Code to fix this bug.',
    context:
      'Users report the "Save draft" button "sometimes doesn\'t work" — no error message, the draft just isn\'t saved. It seems worse when typing fast. Codebase: React + a REST API. The editor component is src/editor/Editor.tsx; the save call is in src/editor/useAutosave.ts.',
    rubric: {
      clarity: ['reproduce', 'repro', 'steps', 'failing test', 'exact'],
      context: ['useAutosave', 'Editor.tsx', 'REST', 'debounce', 'typing fast', 'race'],
      constraints: ['root cause', 'do not suppress', 'no retry that hides', 'without swallowing'],
      verification: ['regression test', 'run the tests', 'full suite', 'paste the output', 'test that fails without'],
      scope: ['only', 'do not change other', 'this component', 'targeted'],
      safety: ['do not', 'confirm before', 'show me the diff'],
    },
    sampleStrongPrompt:
      '"Save draft" intermittently fails to persist with no error, worse when typing fast. Repro: type quickly in the editor and stop; the last content is sometimes not saved. Likely a race/debounce issue between src/editor/Editor.tsx and src/editor/useAutosave.ts. First write a failing test that reproduces the dropped save. Then find the root cause — do NOT add a blind retry or swallow errors. Fix it, keep the reproduction as a regression test, and run the full test suite. Show me the diff and the test output. Do not modify unrelated files.',
  },
  {
    id: 'pt-2',
    title: 'Add a feature to an unfamiliar codebase',
    brief: 'You need to add CSV export to a reports page in a codebase you do not know well.',
    context:
      'The app is a Next.js dashboard. There is an existing "Export PDF" button somewhere. You want an "Export CSV" button next to it that exports the currently filtered table data.',
    rubric: {
      clarity: ['export csv', 'button next to', 'filtered', 'current view', 'plan first'],
      context: ['existing Export PDF', 'follow the pattern', 'how the table', 'filter state', 'inspect', 'plan mode'],
      constraints: ['no new dependencies', 'match the pattern', 'reuse', 'no backend change', 'existing libraries'],
      verification: ['test', 'download', 'open the file', 'verify the rows match', 'screenshot'],
      scope: ['only the reports page', 'just this button', 'do not touch pdf'],
      safety: ['show me the plan', 'before implementing', 'diff'],
    },
    sampleStrongPrompt:
      'In plan mode first: find how the existing "Export PDF" button works on the reports page, and how the table\'s current filter state is held. Then propose a plan to add an "Export CSV" button beside it that exports exactly the currently filtered rows, following the same pattern, with no new dependencies. After I approve: implement it, add a test asserting the CSV rows match the filtered data (including the empty-filter and no-results cases), and take a screenshot of the two buttons. Only touch the reports page. Show me the diff.',
  },
  {
    id: 'pt-3',
    title: 'Refactor safely',
    brief: 'A 400-line function with no tests needs to be broken up.',
    context: 'src/billing/computeInvoice.ts — one function, 400 lines, deeply nested, no tests. It works in production. You want it readable.',
    rubric: {
      clarity: ['refactor', 'readability', 'without changing behavior', 'break up', 'extract'],
      context: ['computeInvoice.ts', 'no tests', 'production', 'characterization'],
      constraints: ['do not change behavior', 'no functional change', 'same output', 'green suite'],
      verification: ['characterization tests', 'capture current behavior', 'tests pass before and after', 'run the suite', 'same results'],
      scope: ['this file only', 'do not change callers', 'behavior identical'],
      safety: ['tests first', 'before refactoring', 'diff'],
    },
    sampleStrongPrompt:
      'Before any refactor of src/billing/computeInvoice.ts: write characterization tests that capture its current output for a representative set of inputs, including edge cases (zero line items, discounts, tax-exempt, rounding). Run them green. Then refactor for readability only — extract helpers, flatten nesting — with NO behavior change. The same characterization tests must still pass unchanged. Do not modify callers or other files. Show me the diff and the test run.',
  },
  {
    id: 'pt-4',
    title: 'Investigate without changing anything',
    brief: 'You inherited a service and need to understand how authentication works — read-only.',
    context: 'A 30k-line Express API. You must not modify anything. You have ~1 session of budget.',
    rubric: {
      clarity: ['explain', 'how authentication works', 'trace', 'read-only', 'do not modify'],
      context: ['from these files', 'entry point', 'middleware', 'session', 'token', 'scope the reads'],
      constraints: ['do not change', 'plan mode', 'no edits', 'read only'],
      verification: ['write notes', 'document', 'architecture-notes.md', 'summary i can verify'],
      scope: ['just auth', 'not the whole codebase', 'auth flow only'],
      safety: ['use subagents', 'do not read the entire tree'],
    },
    sampleStrongPrompt:
      'Plan mode, no edits. I want to understand authentication only. Start from the server entry point and the auth middleware; trace a login request end to end (route → validation → token issue → session store) file by file. Use subagents for any wide searches so my context stays focused. Do not read the whole tree. When done, write docs/auth-notes.md: the flow, the key files, where tokens/sessions live, and any open questions.',
  },
  {
    id: 'pt-5',
    title: 'Set up an autonomous run',
    brief: 'Write the prompt to have Claude fix all failing tests in one module, mostly unattended.',
    context: 'The module src/import/ has 14 failing tests after a dependency upgrade. You want to check back in an hour.',
    rubric: {
      clarity: ['fix the failing tests', 'src/import', 'iterate until green', 'one module'],
      context: ['dependency upgrade', 'the 14 failing tests', 'root cause of each'],
      constraints: ['do not weaken assertions', 'do not skip tests', 'root cause', 'no test deletion', 'allowedTools'],
      verification: ['run the suite', 'until all pass', 'goal', 'paste results', 'full suite at the end'],
      scope: ['only src/import', 'do not change unrelated', 'stay in the module'],
      safety: ['do not commit', 'do not push', 'stop at', 'human review', 'report what you did'],
    },
    sampleStrongPrompt:
      'The 14 failing tests in src/import/ broke after upgrading <dep>. Fix the root cause of each — do NOT skip, delete, or weaken any test to get green. Work only within src/import/ and its direct dependencies. Iterate: run the suite after each fix until all 14 pass, then run the full test suite to check for regressions. Do not commit or push. When done, write a short report of what each failure was and how you fixed it, and stop for my review.',
  },
];

export const PROMPT_TASK_BY_ID: Record<string, PromptTask> = Object.fromEntries(PROMPT_TASKS.map((t) => [t.id, t]));
