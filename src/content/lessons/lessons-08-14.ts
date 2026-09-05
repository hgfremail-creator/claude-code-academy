import type { Lesson } from '../types';

export const LESSONS_08_14: Lesson[] = [
  // ======================================================================
  {
    id: 'l8-claude-md',
    level: 8,
    order: 1,
    title: 'Building an Effective CLAUDE.md',
    tagline: 'It is context, not enforced config. Every line competes for attention — so make each one earn its place.',
    category: 'Instructions',
    difficulty: 'intermediate',
    estimatedMinutes: 22,
    skills: ['claude-md', 'context', 'teamwork'],
    versionSensitive: true,
    objectives: [
      'Explain what CLAUDE.md is, where it loads from, and in what order',
      'Decide what belongs in CLAUDE.md vs a rule, a skill, or a hook',
      'Write specific, verifiable instructions and prune ruthlessly',
      'Use the hierarchy (managed → user → project → local) and .claude/rules/',
    ],
    prerequisites: ['l2-task-formula', 'l9-context-management'],
    body: `
## What it is

\`CLAUDE.md\` is a markdown file Claude Code reads at the **start of every session**. You write it; Claude treats it as context — persuasive, not binding. The more specific and concise it is, the more reliably Claude follows it. To *guarantee* something happens, use a hook instead (Level 13).

There's also **auto memory**: notes Claude writes for itself from your corrections, stored per-repo. CLAUDE.md is you telling Claude the rules; auto memory is Claude remembering what you corrected.

## Where CLAUDE.md files live (load order, broad → specific)

| Scope | Location | For |
| --- | --- | --- |
| Managed policy | OS-specific system path | Org-wide standards (can't be overridden) |
| User | \`~/.claude/CLAUDE.md\` | Your personal preferences, all projects |
| Project | \`./CLAUDE.md\` or \`./.claude/CLAUDE.md\` | Team-shared, committed to git |
| Local | \`./CLAUDE.local.md\` (gitignored) | Your private per-project notes |

All discovered files are concatenated. Files in parent directories load at launch; files in subdirectories load on demand when Claude reads there. Run \`/context\` to see what actually loaded; \`/memory\` to open and edit them.

## What to include — and what to cut

| ✅ Include | ❌ Exclude |
| --- | --- |
| Build/test/run commands Claude can't guess | Anything derivable by reading the code |
| Style rules that **differ from the tool default** | Standard language conventions |
| Preferred test runner and how to run one test | Full API docs (link instead) |
| Branch naming, PR conventions | Info that changes frequently |
| Architectural decisions specific to this project | File-by-file descriptions of the tree |
| Required env vars, dev-env quirks | "Write clean code" / vague platitudes |
| Non-obvious gotchas | Long tutorials |

**The test for every line:** *"Would removing this cause Claude to make a mistake?"* If not, delete it. A bloated CLAUDE.md causes Claude to ignore the rules that matter — they get lost in the noise. Target **under 200 lines**.

If Claude keeps ignoring one rule despite it being present, the file is probably too long. Add \`IMPORTANT\` to *that one line* — but if you emphasize everything, nothing stands out.

## Beyond one file: rules

For bigger projects, split topics into \`.claude/rules/*.md\`. A rule with \`paths:\` frontmatter (glob patterns) loads **only when Claude touches matching files** — so API conventions load when editing \`src/api/**\`, not every session. This is how you keep context lean while still having detailed guidance available.

## Getting started

\`/init\` analyzes your codebase and drafts a starting CLAUDE.md (build commands, test instructions, conventions it discovers). If one exists, it suggests improvements instead. Then refine over time — treat it like code: review it when things go wrong, prune regularly, and check whether edits actually change Claude's behavior. \`/doctor\` proposes trims for a checked-in file.

## Team usage

Commit the project CLAUDE.md. When a review catches something Claude "should have known," add it. When a new teammate would need the same context, add it. It compounds in value.
`,
    exercises: [
      {
        id: 'l8-e1',
        kind: 'checklist',
        title: 'Prune this CLAUDE.md',
        prompt: 'Check every line that should be CUT from a CLAUDE.md.',
        items: [
          '"Write clean, readable code."',
          '"Run `pnpm test:unit` for unit tests; `pnpm test:e2e` needs a running Postgres on :5433."',
          '"This project uses React."',
          '"Never edit files in `src/generated/` — they are built from the OpenAPI spec."',
          '"Use 2-space indentation (our Prettier config enforces this, but Claude sometimes uses 4)."',
          '"The `src/components/` folder contains components. The `src/hooks/` folder contains hooks."',
          '"Always create a feature branch; PR titles use Conventional Commits."',
        ],
      },
      {
        id: 'l8-e2',
        kind: 'freeform',
        title: 'Write a real CLAUDE.md',
        prompt:
          'For a project you know, write a CLAUDE.md under 30 lines. Include only: commands Claude cannot guess, style rules that differ from defaults, one or two real gotchas, and repo etiquette. Then delete two more lines.',
      },
      {
        id: 'l8-e3',
        kind: 'reflection',
        title: 'Rule, skill, or hook?',
        prompt:
          'For each: "always run the formatter after editing" / "how to add a new payment provider (12 steps)" / "our REST endpoints use kebab-case paths and camelCase JSON" — should it be a CLAUDE.md line, a path-scoped rule, a skill, or a hook? Why?',
        modelAnswer:
          'Formatter-after-edit: a hook — it must happen every time regardless of what Claude decides. The 12-step provider guide: a skill — it is a procedure only relevant sometimes; loading it every session wastes context. REST naming: a path-scoped rule on src/api/** (or a short CLAUDE.md line if the API is small) — always-relevant when touching API code, noise otherwise.',
      },
    ],
    quiz: [
      {
        id: 'l8-q1',
        question: 'CLAUDE.md is best described as…',
        options: [
          'Enforced configuration that blocks disallowed actions',
          'Persistent context loaded every session that Claude tries to follow but is not guaranteed to',
          'A one-time setup wizard',
          'A replacement for the system prompt',
        ],
        correctAnswer: 1,
        explanation: 'It is advisory context. For hard guarantees you need a hook or a permission rule.',
        skills: ['claude-md'],
      },
      {
        id: 'l8-q2',
        question: 'The single best test for whether a line belongs in CLAUDE.md:',
        options: [
          '"Is it true?"',
          '"Would removing this line cause Claude to make a mistake?"',
          '"Is it well-written?"',
          '"Did /init generate it?"',
        ],
        correctAnswer: 1,
        explanation: 'If Claude already does the right thing without the line, the line is just noise diluting the rules that matter.',
        skills: ['claude-md'],
      },
      {
        id: 'l8-q3',
        question: 'A path-scoped rule (`.claude/rules/` with `paths:` frontmatter) is loaded…',
        options: [
          'Every session, always',
          'Only when Claude works with files matching the glob patterns',
          'Only when you run /rules',
          'Never — it is deprecated',
        ],
        correctAnswer: 1,
        explanation: 'Path-scoped rules keep detailed guidance out of context until it is relevant to the files being touched.',
        skills: ['claude-md', 'context'],
      },
      {
        id: 'l8-q4',
        question: 'Claude keeps violating one specific rule in a long CLAUDE.md. Best fix?',
        options: [
          'Add "IMPORTANT" to every line',
          'The file is likely too long — prune aggressively, and add emphasis to just that one rule',
          'Repeat the rule five times',
          'Switch to a bigger model',
        ],
        correctAnswer: 1,
        explanation: 'Rules get lost in bloated files. Trim first; reserve emphasis for the one line that needs it.',
        skills: ['claude-md'],
      },
    ],
    resources: [
      { label: 'How Claude remembers your project (CLAUDE.md + auto memory)', url: 'https://code.claude.com/docs/en/memory', official: true },
      { label: 'Best practices — write an effective CLAUDE.md', url: 'https://code.claude.com/docs/en/best-practices', official: true },
    ],
    relatedLessons: ['l9-context-management', 'l13-hooks', 'l14-skills'],
  },

  // ======================================================================
  {
    id: 'l9-context-management',
    level: 9,
    order: 1,
    title: 'Context Management: The Constraint Everything Else Serves',
    tagline: 'Performance degrades as the window fills. Managing it is the master skill.',
    category: 'Context',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    skills: ['context', 'prompting', 'subagents'],
    objectives: [
      'Explain why LLM performance degrades as context fills',
      'Recognize context pollution and its symptoms',
      'Choose between /clear, /compact, /rewind, subagents, and a fresh session',
      'Give Claude the right information and withhold the irrelevant',
    ],
    prerequisites: ['l2-iterative-dev'],
    body: `
## Why this is Level 9's whole point

Almost every best practice traces back to one fact: **the context window holds the entire conversation — every message, every file read, every command output — and model performance drops as it fills.** A single debugging session can burn tens of thousands of tokens. When it's near full, Claude starts "forgetting" earlier instructions and making more mistakes.

Context is the fundamental resource. Manage it deliberately.

## Symptoms of context pollution

- Claude re-asks something you answered.
- It reintroduces a bug you already fixed together.
- It references a file or approach from an unrelated earlier task.
- Its edits get sloppier as the session goes long.
- You've corrected the same thing 2–3 times.

## The tools, and when to reach for each

| Tool | Effect | Use when |
| --- | --- | --- |
| **\`/clear\`** | Wipes context entirely | Switching to an unrelated task |
| **\`/compact\`** | Summarizes history, keeps key code/decisions/files | Long single task approaching limits |
| **\`/compact <focus>\`** | Compaction steered by your instruction | You know what matters ("focus on the API changes") |
| **\`Esc Esc\` / \`/rewind\`** | Restore earlier conversation/code, or summarize from/up to a message | A thread went down a dead end |
| **Subagents** | Research happens in *their* context; you get a summary | Exploration that would flood your window |
| **New session** | Clean slate + a written spec/notes | Interview→spec done; corrections piled up; new workstream |
| **\`/btw\`** | Answer a side question without adding it to history | Quick check you don't want polluting context |

## Give the right info — and only that

- **Scope reads:** "answer from these 3 files" not "figure it out."
- **Reference, don't paste:** \`@path/to/file\` lets Claude read exactly what it needs.
- **Don't pre-load:** dumping five files "for background" that turn out irrelevant is pollution you chose.
- **Summarize and persist:** at the end of a phase, "write what we decided to \`NOTES.md\`" — then \`/clear\` and continue from the file.

## What survives compaction

Project-root CLAUDE.md is re-read from disk after \`/compact\`. Nested CLAUDE.md and path-scoped rules reload when Claude next reads matching files. **Conversation-only instructions do not survive** — if it matters, it belongs in CLAUDE.md or a written doc. You can also tell Claude in CLAUDE.md what to always preserve when compacting.

## The decision: continue or start fresh?

Continue if: you're deep in one coherent problem and the history *is* the value. Start fresh if: the task changed, corrections have piled up, or you have a written artifact that captures the useful state. When in doubt, a clean session with a sharper prompt beats a long polluted one — almost every time.
`,
    exercises: [
      {
        id: 'l9-e1',
        kind: 'reflection',
        title: 'Continue or /clear?',
        prompt:
          'For each: (a) You finished adding a feature and now want to write its docs. (b) You are 40 minutes into isolating a subtle race condition and have built up useful evidence. (c) You asked about deployment, got an answer, and now want to go back to the feature you were building. Decide and justify.',
        modelAnswer:
          '(a) /clear or new session — docs need the code state, not the implementation back-and-forth; point Claude at the diff. (b) Continue — the accumulated evidence and narrowed hypotheses are exactly the context you need. (c) /clear the deployment detour, or better, you should have used /btw for it so it never entered history.',
      },
      {
        id: 'l9-e2',
        kind: 'checklist',
        title: 'Context pollution symptoms',
        prompt: 'Which of these mean it is time to /clear or /compact?',
        items: [
          'Claude re-asks a question you already answered this session',
          'Claude reintroduces a bug you fixed together earlier',
          'You have corrected the same point three times',
          'The session has been open for 10 minutes',
          'Claude references an unrelated file from a task you finished an hour ago',
          'Edits are getting sloppier as the session runs long',
        ],
      },
    ],
    quiz: [
      {
        id: 'l9-q1',
        question: 'Why does managing context matter more than almost any other Claude Code skill?',
        options: [
          'It saves money',
          'Model performance degrades as the window fills — a polluted context directly causes forgotten instructions and mistakes',
          'It is required to use subagents',
          'It makes responses stream faster',
        ],
        correctAnswer: 1,
        explanation: 'The degradation-with-fullness fact is the root cause most best practices address.',
        skills: ['context'],
      },
      {
        id: 'l9-q2',
        question: 'Difference between /clear and /compact?',
        options: [
          'They are identical',
          '/clear wipes context entirely (for unrelated tasks); /compact summarizes history while keeping key code, decisions, and files (for a long single task)',
          '/compact deletes files',
          '/clear only works once per session',
        ],
        correctAnswer: 1,
        explanation: 'Reach for /clear on a task switch; /compact when you are still on one task but running out of room.',
        skills: ['context', 'commands'],
      },
      {
        id: 'l9-q3',
        question: 'An instruction you gave only in chat disappears after /compact. Why, and the fix?',
        options: [
          'A bug; report it',
          'Conversation-only instructions are not guaranteed to survive compaction — put durable instructions in CLAUDE.md or a written doc',
          'You must disable compaction',
          'It never actually disappeared',
        ],
        correctAnswer: 1,
        explanation: 'Project-root CLAUDE.md is re-read after compaction; ad-hoc chat instructions may be summarized away.',
        skills: ['context', 'claude-md'],
      },
      {
        id: 'l9-q4',
        question: 'You want to double-check a syntax detail mid-task without cluttering the session. Best tool?',
        options: ['/clear', '/compact', '/btw', 'Start a new session'],
        correctAnswer: 2,
        explanation: '/btw answers a side question without adding it to conversation history.',
        skills: ['context', 'commands'],
      },
    ],
    resources: [
      { label: 'Explore the context window', url: 'https://code.claude.com/docs/en/context-window', official: true },
      { label: 'Best practices — manage your session', url: 'https://code.claude.com/docs/en/best-practices', official: true },
      { label: 'Manage costs / reduce token usage', url: 'https://code.claude.com/docs/en/costs', official: true },
    ],
    relatedLessons: ['l8-claude-md', 'l11-subagents', 'l17-large-projects'],
  },

  // ======================================================================
  {
    id: 'l10-advanced-commands',
    level: 10,
    order: 1,
    title: 'The Command & Control Surface',
    tagline: 'Slash commands, CLI flags, permission modes, checkpoints — and how to keep learning them as they change.',
    category: 'Commands',
    difficulty: 'intermediate',
    estimatedMinutes: 18,
    skills: ['commands', 'context', 'autonomy'],
    versionSensitive: true,
    objectives: [
      'Navigate the categories of slash commands and CLI flags',
      'Choose a permission mode deliberately (default/plan/acceptEdits/auto/bypass)',
      'Use checkpoints and interactive controls fluently',
      'Keep your command knowledge current against the official docs',
    ],
    prerequisites: ['l1-install-auth', 'l9-context-management'],
    body: `
## This changes — so learn the map, not the list

Commands and flags evolve every few weeks. Memorizing a fixed list is a losing game. Instead, learn the **categories** and know where the current reference is. Use the Academy's **Command Explorer** (Reference tab) for interactive detail, and always cross-check the [CLI reference](https://code.claude.com/docs/en/cli-reference) and [commands](https://code.claude.com/docs/en/commands) pages.

## Slash commands by purpose

- **Understand your session:** \`/context\` (what's loaded + usage), \`/status\`, \`/cost\`, \`/model\`, \`/doctor\`.
- **Manage context:** \`/clear\`, \`/compact [focus]\`, \`/rewind\`, \`/btw\`.
- **Memory & config:** \`/memory\`, \`/init\`, \`/permissions\`, \`/hooks\`, \`/config\`.
- **Work:** \`/run\`, \`/verify\`, \`/review\` (or \`/code-review\`), \`/security-review\`, \`/debug\`.
- **Extend:** \`/skills\`, \`/plugin\`, \`/mcp\`, \`/agents\`.
- **Scale:** \`/batch\`, \`/loop\`, \`/goal\`, \`/schedule\`, \`/workflow-authoring\`.

> **Verify against current Claude Code documentation.** Names, grouping, and availability differ by version, plan, and surface. Run \`/help\` in your session for the authoritative local list.

## CLI flags that matter

| Flag | Does |
| --- | --- |
| \`-p / --print\` | Non-interactive: run and exit (CI, scripts, pipes) |
| \`-c / --continue\`, \`-r / --resume\` | Resume conversations |
| \`--permission-mode <mode>\` | Start in default/acceptEdits/plan/auto/bypassPermissions |
| \`--model\`, \`--effort\` | Model and reasoning effort |
| \`--add-dir\` | Grant access to extra directories |
| \`--mcp-config\` | Load MCP servers from JSON |
| \`--allowedTools\` / \`--dangerously-skip-permissions\` | Scope or bypass permissions (careful) |
| \`--append-system-prompt\` | Add a system-level instruction (scripts) |
| \`--output-format json\|stream-json\` | Parseable output |

## Permission modes — pick on purpose

| Mode | Behavior | Use when |
| --- | --- | --- |
| **default / Manual** | Asks before edits, Bash, MCP | Unfamiliar code, sensitive repo |
| **Plan** | Read-only; produces a plan | Exploring, designing an approach |
| **acceptEdits** | Auto-approves edits + basic FS commands | Trusted, well-scoped batch of edits |
| **auto** | Classifier screens actions, blocks risky ones | You want flow but keep a safety net (Pro/Max/Team) |
| **bypassPermissions** | No prompts at all | Isolated throwaway sandbox only — never on a machine with credentials or a real repo you care about |

\`Shift+Tab\` cycles modes mid-session.

## Checkpoints & interactive controls

Every prompt creates a checkpoint. \`Esc\` interrupts (context kept). \`Esc Esc\` / \`/rewind\` restores conversation, code, or both — and can summarize from a chosen message. Checkpoints track Claude's edits only, **not Bash changes** — still not a Git substitute.
`,
    exercises: [
      {
        id: 'l10-e1',
        kind: 'reflection',
        title: 'Pick the mode',
        prompt:
          'Which permission mode for each: (a) first time opening a client\'s production repo; (b) applying a reviewed 20-file rename you already planned; (c) a "fix all lint errors" run you want to walk away from on your Max plan; (d) poking at a random GitHub repo in a throwaway VM.',
        modelAnswer:
          '(a) default/Manual — you do not know what is safe yet. (b) acceptEdits — scoped, reviewed, mechanical. (c) auto — flow without babysitting, classifier catches scope escalation. (d) bypassPermissions is only acceptable because it is a throwaway VM with nothing to lose; on any real machine, never.',
      },
      {
        id: 'l10-e2',
        kind: 'checklist',
        title: 'Know where to check',
        prompt: 'Check the ones you could find right now.',
        items: [
          'The authoritative list of slash commands for MY installed version (`/help`)',
          'What is currently loaded into my context (`/context`)',
          'The official CLI reference URL',
          'How to cycle permission modes without restarting',
          'How to resume a specific named session',
        ],
      },
    ],
    quiz: [
      {
        id: 'l10-q1',
        question: 'Why does this Academy teach command categories rather than a fixed command list?',
        options: [
          'The list is secret',
          'Commands and flags change frequently; the map plus knowing where the current reference is stays valid',
          'There are too few commands to list',
          'Commands do not matter',
        ],
        correctAnswer: 1,
        explanation: 'Version churn makes memorized lists stale fast. Learn the shape and verify specifics against docs / `/help`.',
        skills: ['commands'],
      },
      {
        id: 'l10-q2',
        question: 'bypassPermissions mode is appropriate…',
        options: [
          'Whenever prompts get annoying',
          'Only in an isolated throwaway sandbox with nothing valuable to lose',
          'On any personal project',
          'In CI on the main repo',
        ],
        correctAnswer: 1,
        explanation: 'No prompts means no gate on destructive or exfiltrating commands. Confine it to disposable environments.',
        skills: ['security', 'commands'],
      },
      {
        id: 'l10-q3',
        question: '`claude -p "..."` is primarily for…',
        options: [
          'Private conversations',
          'Non-interactive use: CI pipelines, pre-commit hooks, scripts, pipes',
          'Faster responses',
          'Plan mode',
        ],
        correctAnswer: 1,
        explanation: 'Print mode runs once and exits, with text/JSON/stream-json output for automation.',
        skills: ['commands', 'autonomy'],
      },
      {
        id: 'l10-q4',
        question: 'You made changes via a Bash script Claude ran, then hit /rewind. What happens to those changes?',
        options: [
          'They are reverted like file edits',
          'They are NOT reverted — checkpoints only track Claude\'s file-editing tools, not Bash or external processes',
          'The session crashes',
          'They are pushed to Git',
        ],
        correctAnswer: 1,
        explanation: 'Checkpointing is in-session undo for edit tools. Bash-made changes need Git.',
        skills: ['commands', 'git'],
      },
    ],
    resources: [
      { label: 'CLI reference', url: 'https://code.claude.com/docs/en/cli-reference', official: true },
      { label: 'Commands', url: 'https://code.claude.com/docs/en/commands', official: true },
      { label: 'Permission modes', url: 'https://code.claude.com/docs/en/permission-modes', official: true },
      { label: 'Interactive mode', url: 'https://code.claude.com/docs/en/interactive-mode', official: true },
    ],
    relatedLessons: ['l9-context-management', 'l16-security', 'l20-autonomous-dev'],
  },

  // ======================================================================
  {
    id: 'l11-subagents',
    level: 11,
    order: 1,
    title: 'Subagents: Delegation That Protects Your Context',
    tagline: 'A subagent does verbose work in its own window and hands you back a summary.',
    category: 'Agents',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    skills: ['subagents', 'context', 'teamwork'],
    versionSensitive: true,
    objectives: [
      'Explain what a subagent is and the problem it solves',
      'Write a subagent definition (frontmatter + system prompt) and store it correctly',
      'Compose a team of specialized agents for a task',
      'Judge when delegation adds value and when it adds only overhead',
    ],
    prerequisites: ['l3-codebase-understanding', 'l9-context-management'],
    body: `
## The problem subagents solve

Some work generates a flood of output you'll never reference again — reading 40 files to answer one question, grinding through a test log, scanning a whole module for a pattern. If that happens in your main session, it fills *your* context and degrades everything after.

A **subagent** runs that work in an **isolated context window** and returns only a summary. Benefits: preserve context, enforce tool restrictions, reuse configs, specialize behavior, and route cheap work to cheaper/faster models.

## Anatomy of a subagent

\`\`\`markdown
---
name: security-reviewer
description: Reviews a diff for security vulnerabilities. Use before merging auth or input-handling changes.
tools: Read, Grep, Glob, Bash
model: opus
---
You are a senior application security engineer. Given a diff, review for:
- Injection (SQL, command, XSS), and unsafe deserialization
- AuthN/AuthZ flaws and missing access checks
- Secrets or credentials committed in code
- Unsafe handling of untrusted input

For each finding: file:line, severity, why it's exploitable, and a concrete fix.
Report only issues that affect security — not style.
\`\`\`

**Required:** \`name\` (lowercase-hyphens), \`description\` (when to delegate). **Common optional:** \`tools\` (allowlist), \`model\`, \`permissionMode\`, \`skills\`, \`memory\`, \`isolation: worktree\`, \`maxTurns\`.

**Where:** \`.claude/agents/\` (project, commit it) or \`~/.claude/agents/\` (personal). Built-ins: **Explore** (fast read-only search), **Plan** (research for plan mode), **general-purpose**, **claude**.

## Invoking

- Natural language: *"use the security-reviewer subagent on my changes"* — Claude decides.
- \`@\`-mention the agent — guarantees it runs.
- \`claude --agent security-reviewer\` — run a whole session as that agent.
- *"use subagents to investigate X, Y, and Z in parallel"* — fan-out research.

## A team for one task

For "build the invoicing feature":

| Agent | Job | Tools |
| --- | --- | --- |
| **architect** | Propose structure + data model from the spec | Read, Grep, Glob |
| **implementer** | (main session) Write the code | all |
| **test-writer** | Write failing tests from the spec first | Read, Write, Bash |
| **security-reviewer** | Review the diff for vulns | Read, Grep, Glob, Bash |
| **doc-writer** | Update README + CLAUDE.md | Read, Write |

The main session orchestrates; each subagent stays focused and its noise stays out of your window.

## When NOT to delegate

- **Tight iteration** — lots of back-and-forth. The summarize-and-handoff overhead dominates.
- **Shared context** — if two phases need the same deep understanding, splitting them means re-establishing it twice.
- **Quick targeted changes** — a one-file edit doesn't need an agent.
- **Latency-sensitive** — spinning up a subagent has a cost.

Regular subagents start **fresh** — they don't see your conversation (only a fork does). If the task can't be captured in a short brief, it's not a good delegation.
`,
    exercises: [
      {
        id: 'l11-e1',
        kind: 'freeform',
        title: 'Write a subagent',
        prompt:
          'Write a complete `.claude/agents/test-writer.md` — frontmatter + system prompt — for an agent that writes failing tests first from a spec, restricted to the tools it needs.',
      },
      {
        id: 'l11-e2',
        kind: 'reflection',
        title: 'Delegate or not?',
        prompt:
          'For each, delegate to a subagent or keep in the main session? (a) "figure out every place we call the deprecated `oldLogger`"; (b) "rename this variable and update its 4 uses"; (c) "we are iterating on the exact wording of this error message with product feedback"; (d) "review the 30-file refactor diff for regressions."',
        modelAnswer:
          '(a) Delegate — verbose search, returns a list. (b) Keep — trivial, no context cost. (c) Keep — tight iteration, subagent overhead per round is pointless. (d) Delegate — large diff review in fresh, unbiased context is exactly the use case.',
      },
    ],
    quiz: [
      {
        id: 'l11-q1',
        question: 'The primary reason to use a subagent for codebase investigation is…',
        options: [
          'Subagents are smarter than the main session',
          'The reading happens in the subagent\'s context; your main context stays clean and only gets a summary',
          'It is cheaper in every case',
          'Subagents can bypass permissions',
        ],
        correctAnswer: 1,
        explanation: 'Context isolation is the point — verbose work off your main thread.',
        skills: ['subagents', 'context'],
      },
      {
        id: 'l11-q2',
        question: 'A regular (non-fork) subagent, when invoked, has access to…',
        options: [
          'Your entire conversation history',
          'Only the task brief it is given — it starts fresh',
          'Your auto memory and all open files',
          'Nothing at all',
        ],
        correctAnswer: 1,
        explanation: 'Regular subagents get a summary/brief, not the conversation. Only a fork inherits parent context.',
        skills: ['subagents'],
      },
      {
        id: 'l11-q3',
        question: 'Which is the WORST fit for a subagent?',
        options: [
          'Scanning a large module for all uses of a pattern',
          'Reviewing a big diff for security issues',
          'A task requiring many rounds of back-and-forth iteration with you',
          'Running and summarizing a long test log',
        ],
        correctAnswer: 2,
        explanation: 'Tight iteration means constant re-briefing; the overhead outweighs the isolation benefit.',
        skills: ['subagents'],
      },
      {
        id: 'l11-q4',
        question: 'Why restrict a subagent\'s `tools` list?',
        options: [
          'It runs faster with fewer tools',
          'Safety and focus — a security reviewer with only Read/Grep/Glob cannot accidentally modify code',
          'It is required',
          'To save tokens',
        ],
        correctAnswer: 1,
        explanation: 'A tight allowlist enforces the agent\'s role and limits blast radius.',
        skills: ['subagents', 'security'],
      },
    ],
    resources: [
      { label: 'Create custom subagents', url: 'https://code.claude.com/docs/en/sub-agents', official: true },
      { label: 'Run agents in parallel', url: 'https://code.claude.com/docs/en/agents', official: true },
      { label: 'Orchestrate subagents with dynamic workflows', url: 'https://code.claude.com/docs/en/workflows', official: true },
    ],
    relatedLessons: ['l9-context-management', 'l19-software-team', 'l20-autonomous-dev'],
  },

  // ======================================================================
  {
    id: 'l12-mcp',
    level: 12,
    order: 1,
    title: 'MCP: Connecting Claude Code to Your Tools and Data',
    tagline: 'One open protocol between Claude Code and databases, trackers, docs, and APIs.',
    category: 'MCP',
    difficulty: 'advanced',
    estimatedMinutes: 24,
    skills: ['mcp', 'security'],
    versionSensitive: true,
    objectives: [
      'Explain what MCP is and the client–server model',
      'Choose a transport (stdio / HTTP / SSE) and a scope (local / project / user)',
      'Add a server, handle OAuth, and use its tools/resources',
      'Reason about the security implications of connecting a server',
    ],
    prerequisites: ['l10-advanced-commands', 'l16-security'],
    body: `
## What MCP is

**Model Context Protocol** is an open standard for connecting AI tools to external systems. Instead of copy-pasting data into the session, Claude Code (the **client**) talks to an MCP **server** that exposes:

- **Tools** — actions Claude can call ("create a Jira ticket", "run this SQL")
- **Resources** — data Claude can read ("this Google Doc", "this DB schema")
- **Prompts** — server-provided prompt templates

\`\`\`
You ──▶ Claude Code ──▶ MCP client ──▶ MCP server ──▶ External system
                                                       (DB, GitHub, Notion, Sentry…)
\`\`\`

## Transports

| Transport | For | Add with |
| --- | --- | --- |
| **stdio** | Local processes (a server on your machine) | \`claude mcp add --transport stdio db -- npx -y @some/db-mcp\` |
| **HTTP** | Remote servers (recommended for hosted) | \`claude mcp add --transport http notion https://mcp.notion.com/mcp\` |
| **SSE** | Legacy remote (deprecated) | \`claude mcp add --transport sse ...\` |

Use \`--\` to separate Claude's flags from the server command's args.

## Scopes

| Scope | Stored in | Visible to | Use |
| --- | --- | --- | --- |
| **local** (default) | \`~/.claude.json\` per-project | Just you | Personal experiments |
| **project** | \`.mcp.json\` at repo root | Team (via git) | Shared team tools |
| **user** | global | Just you, all projects | Cross-project utilities |

Project-scoped servers from \`.mcp.json\` **require approval on first use** — because a repo you cloned could define them.

## \`.mcp.json\`

\`\`\`json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": { "Authorization": "Bearer \${GITHUB_PAT}" }
    }
  }
}
\`\`\`

Supports \`\${VAR}\` and \`\${VAR:-default}\` expansion — keep secrets in env vars, not committed literals.

## Auth

Remote servers usually use **OAuth**: \`claude mcp add --transport http sentry https://mcp.sentry.dev/mcp\`, then \`/mcp\` in a session to run the browser login. Or \`claude mcp login <name>\`. Check status with \`/mcp\` (✔ connected / ! needs auth / ✘ failed) or \`claude mcp list\`.

## Using it

Just ask in natural language: *"Review PR #456"*, *"Query the DB for users who used feature ENG-4521 last week"*, *"Summarize the open Sentry issues for the checkout service."* Claude picks the right MCP tool.

## Security — this is the important part

- **Prompt injection surface.** A server that fetches external content (web pages, tickets, docs) can return text that tries to manipulate Claude. **Only connect servers you trust.**
- **Data egress.** An MCP tool can send your data *out*. A database MCP with write access can modify prod. Prefer **read-only** credentials; scope tightly.
- **Trust prompts.** New servers and project-scoped servers require trust approval. Anthropic reviews *directory* connectors against listing criteria but does **not** security-audit MCP servers.
- **Reserved names** can't be used: \`workspace\`, \`claude-in-chrome\`, \`computer-use\`, and a couple more.
- **Least privilege.** Give a server the minimum access that makes it useful. A "query analytics" server should not be able to \`DROP TABLE\`.

## Troubleshooting

Server missing? \`/mcp\` for status, \`claude mcp list\` for errors, check \`.mcp.json\` syntax and env vars, watch for pasted whitespace in config values, and re-authenticate OAuth servers via \`/mcp\`.
`,
    exercises: [
      {
        id: 'l12-e1',
        kind: 'reflection',
        title: 'Design a safe DB connection',
        prompt:
          'You want Claude to answer analytics questions from your Postgres. Describe exactly how you would set this up to minimize risk: transport, scope, credentials, and what you would explicitly prevent.',
        modelAnswer:
          'stdio transport with a local DB MCP; local scope (personal). Connect with a dedicated read-only Postgres role limited to the analytics schema — no INSERT/UPDATE/DELETE/DDL. DSN in an env var, never committed. Explicitly prevent: write access, access to auth/PII tables, and connecting the same server to prod credentials. Verify by asking it to attempt an UPDATE and confirming it is refused by the database, not just by Claude.',
      },
      {
        id: 'l12-e2',
        kind: 'checklist',
        title: 'Before connecting an MCP server',
        prompt: 'Your pre-connection checklist.',
        items: [
          'Do I trust the publisher of this server?',
          'Does it fetch external/untrusted content (prompt-injection surface)?',
          'What is the minimum credential scope that still makes it useful?',
          'Read-only vs write — do I actually need write?',
          'Which scope (local/project/user) and does the team need it?',
          'Are secrets in env vars, not committed literals?',
        ],
      },
    ],
    quiz: [
      {
        id: 'l12-q1',
        question: 'In MCP terms, Claude Code is the ___ and Notion/GitHub/your DB integration is the ___.',
        options: ['server / client', 'client / server', 'host / tool', 'both are servers'],
        correctAnswer: 1,
        explanation: 'Claude Code is the MCP client; the thing exposing tools/resources is the MCP server.',
        skills: ['mcp'],
      },
      {
        id: 'l12-q2',
        question: 'A project-scoped server in a repo you just cloned…',
        options: [
          'Connects automatically and silently',
          'Requires your approval on first use, because a cloned repo could define a malicious one',
          'Is ignored entirely',
          'Only works if you are an admin',
        ],
        correctAnswer: 1,
        explanation: 'Trust approval on first use is the safeguard against server definitions committed by others.',
        skills: ['mcp', 'security'],
      },
      {
        id: 'l12-q3',
        question: 'Biggest security concern with an MCP server that reads external web content or tickets?',
        options: [
          'It is slow',
          'Returned content can contain prompt-injection text attempting to manipulate Claude',
          'It uses too many tokens',
          'It cannot be uninstalled',
        ],
        correctAnswer: 1,
        explanation: 'External content is untrusted input. Only connect servers you trust, and stay alert to injected instructions.',
        skills: ['mcp', 'security'],
      },
      {
        id: 'l12-q4',
        question: 'Best practice for database credentials given to an MCP server?',
        options: [
          'Full admin so Claude can do anything',
          'A least-privilege, typically read-only role scoped to the needed schema',
          'Share your personal login',
          'Disable authentication for convenience',
        ],
        correctAnswer: 1,
        explanation: 'Least privilege limits the blast radius if the server misbehaves or is manipulated.',
        skills: ['mcp', 'security'],
      },
      {
        id: 'l12-q5',
        question: 'Does Anthropic security-audit the MCP servers you connect?',
        options: [
          'Yes, all of them',
          'No — it reviews directory connectors against listing criteria but does not security-audit or manage MCP servers; trust is your responsibility',
          'Only paid ones',
          'Only on Enterprise plans',
        ],
        correctAnswer: 1,
        explanation: 'You are responsible for vetting servers. Write your own or use ones from providers you trust.',
        skills: ['mcp', 'security'],
      },
    ],
    resources: [
      { label: 'Connect Claude Code to tools via MCP', url: 'https://code.claude.com/docs/en/mcp', official: true },
      { label: 'MCP quickstart', url: 'https://code.claude.com/docs/en/mcp-quickstart', official: true },
      { label: 'Security — MCP security', url: 'https://code.claude.com/docs/en/security', official: true },
    ],
    relatedLessons: ['l16-security', 'l13-hooks', 'l19-software-team'],
  },

  // ======================================================================
  {
    id: 'l13-hooks',
    level: 13,
    order: 1,
    title: 'Hooks: Make It Happen Every Time, No Exceptions',
    tagline: 'CLAUDE.md is advice. A hook is a guarantee — it runs whatever Claude decides.',
    category: 'Hooks',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    skills: ['hooks', 'security', 'testing'],
    versionSensitive: true,
    objectives: [
      'Explain how hooks differ from CLAUDE.md instructions',
      'Name the key lifecycle events and when they fire',
      'Configure a PreToolUse hook that blocks a dangerous command',
      'Configure a PostToolUse hook that formats/lints after edits',
    ],
    prerequisites: ['l8-claude-md', 'l16-security'],
    body: `
## Advice vs guarantee

A CLAUDE.md line ("run the formatter after editing") is context Claude *usually* follows. A **hook** is a command Claude Code executes automatically at a lifecycle event — deterministically, regardless of what Claude decides. Use hooks for the things that must happen **every time with zero exceptions**: formatting, a lint gate, a test gate, blocking writes to a protected path, audit logging.

## Lifecycle events (the ones you'll use most)

| Cadence | Events |
| --- | --- |
| Per session | \`SessionStart\`, \`SessionEnd\`, \`Setup\` |
| Per turn | \`UserPromptSubmit\`, \`Stop\`, \`StopFailure\` |
| Per tool call | \`PreToolUse\`, \`PostToolUse\`, \`PostToolUseFailure\`, \`PermissionRequest\` |

Many more exist (\`PreCompact\`, \`SubagentStop\`, \`FileChanged\`, \`InstructionsLoaded\`…). **\`PreToolUse\`** (gate before a tool runs) and **\`PostToolUse\`** (react after) are the workhorses.

## Configuration shape

In \`.claude/settings.json\` (project) or \`~/.claude/settings.json\` (user):

\`\`\`json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "\${CLAUDE_PROJECT_DIR}/.claude/hooks/format.sh", "timeout": 30 }
        ]
      }
    ]
  }
}
\`\`\`

The \`matcher\` filters by tool name (\`Bash\`, \`Edit|Write\`, \`mcp__.*\`). Handler types: **command** (shell, gets JSON on stdin), **http** (POST to a URL), **mcp_tool**, **prompt** (single-turn LLM check), **agent** (spawn a subagent to verify).

## Exit codes

- **0** — success; Claude Code reads any JSON you print on stdout.
- **2** — **blocking error**: the action is prevented.
- other — non-blocking error; action proceeds.

## Example: block destructive commands

\`\`\`json
{ "hooks": { "PreToolUse": [ {
  "matcher": "Bash",
  "hooks": [ { "type": "command", "if": "Bash(rm *)",
    "command": "\${CLAUDE_PROJECT_DIR}/.claude/hooks/block-rm.sh" } ]
} ] } }
\`\`\`

\`\`\`bash
#!/bin/bash
CMD=$(jq -r '.tool_input.command')
if echo "$CMD" | grep -qE 'rm +-rf|rm +-fr'; then
  jq -n '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",
    permissionDecisionReason:"rm -rf blocked by project hook"}}'
else
  exit 0
fi
\`\`\`

## Example: format + lint after every edit

\`PostToolUse\` on \`Edit|Write\` → run \`prettier --write\` on the changed file, then \`eslint\`. If lint fails, exit 2 with a message so Claude sees it and fixes it in the same turn.

## Example: test gate before the turn ends

A \`Stop\` hook runs \`npm test\`. Exit 2 while tests fail → the turn can't end → Claude keeps working. Claude Code overrides after ~8 consecutive blocks so you don't get stuck forever.

## Security notes

- Frontmatter hooks in **project** skills/subagents require **workspace trust** before they run — a cloned repo can't silently execute code.
- Admins can enforce \`allowManagedHooksOnly\`.
- HTTP hooks are gated by URL and env-var allowlists.
- Claude can *write* hooks for you: *"write a hook that blocks writes to \`db/migrations/\`."* Review what it generates — a hook runs with your shell's privileges.
`,
    exercises: [
      {
        id: 'l13-e1',
        kind: 'reflection',
        title: 'Hook or CLAUDE.md?',
        prompt:
          'Classify each as hook or CLAUDE.md line: (a) "prefer named exports"; (b) "never commit without running the test suite"; (c) "our API base URL in dev is http://localhost:4000"; (d) "block any edit to files under infra/terraform/ unless I approve"; (e) "run gofmt on save".',
        modelAnswer:
          '(a) CLAUDE.md — a stylistic preference, advisory is fine. (b) Hook (Stop or PreToolUse on git commit) — "never" + safety implies a guarantee. (c) CLAUDE.md (or CLAUDE.local.md) — just a fact. (d) Hook (PreToolUse, matcher Edit|Write, path check, deny) — hard protection. (e) Hook (PostToolUse on Edit|Write) — must happen every time.',
      },
      {
        id: 'l13-e2',
        kind: 'freeform',
        title: 'Spec a PostToolUse hook',
        prompt:
          'Write the settings.json snippet and describe the script for: after any Edit or Write to a *.py file, run `ruff format` then `ruff check`; if check fails, block the turn so Claude fixes it.',
      },
    ],
    quiz: [
      {
        id: 'l13-q1',
        question: 'The fundamental difference between a hook and a CLAUDE.md instruction:',
        options: [
          'Hooks are written in YAML',
          'Hooks execute deterministically at lifecycle events regardless of what Claude decides; CLAUDE.md is advisory context',
          'CLAUDE.md is faster',
          'Hooks only work in CI',
        ],
        correctAnswer: 1,
        explanation: 'Use hooks for zero-exception guarantees; use CLAUDE.md for guidance.',
        skills: ['hooks', 'claude-md'],
      },
      {
        id: 'l13-q2',
        question: 'A PreToolUse command hook exits with code 2. What happens?',
        options: [
          'Nothing — 2 is a warning',
          'The tool action is blocked / prevented',
          'The session ends',
          'The action runs but is logged',
        ],
        correctAnswer: 1,
        explanation: 'Exit 2 is the blocking signal. Exit 0 = proceed (with optional JSON), other = non-blocking error.',
        skills: ['hooks'],
      },
      {
        id: 'l13-q3',
        question: 'Which pair of events are the "workhorses" for automation like formatting and command-blocking?',
        options: ['SessionStart / SessionEnd', 'PreToolUse / PostToolUse', 'PreCompact / PostCompact', 'UserPromptSubmit / Stop'],
        correctAnswer: 1,
        explanation: 'Gate before a tool runs (PreToolUse), react after it runs (PostToolUse).',
        skills: ['hooks'],
      },
      {
        id: 'l13-q4',
        question: 'You cloned a repo whose `.claude/settings.json` defines hooks. Do they run immediately?',
        options: [
          'Yes, silently',
          'Project-defined hooks that run code are gated by workspace trust — you must trust the folder first',
          'Never',
          'Only if you are online',
        ],
        correctAnswer: 1,
        explanation: 'Workspace trust prevents a cloned repo from executing arbitrary code on first open.',
        skills: ['hooks', 'security'],
      },
    ],
    resources: [
      { label: 'Automate actions with hooks (guide)', url: 'https://code.claude.com/docs/en/hooks-guide', official: true },
      { label: 'Hooks reference', url: 'https://code.claude.com/docs/en/hooks', official: true },
    ],
    relatedLessons: ['l8-claude-md', 'l4-verification', 'l16-security'],
  },

  // ======================================================================
  {
    id: 'l14-skills',
    level: 14,
    order: 1,
    title: 'Skills: Package a Workflow Once, Reuse It Forever',
    tagline: 'A SKILL.md turns "the way we do X" into a command Claude loads only when it is needed.',
    category: 'Skills',
    difficulty: 'advanced',
    estimatedMinutes: 18,
    skills: ['skills', 'teamwork', 'context'],
    versionSensitive: true,
    objectives: [
      'Explain what a skill is and how it differs from CLAUDE.md and subagents',
      'Write a SKILL.md with useful frontmatter',
      'Build a workflow skill that takes arguments',
      'Decide skill vs rule vs hook vs subagent',
    ],
    prerequisites: ['l8-claude-md', 'l11-subagents'],
    body: `
## What a skill is

A **skill** is a folder with a \`SKILL.md\` that packages domain knowledge or a repeatable workflow. Unlike CLAUDE.md (loaded every session) a skill loads **on demand** — when you invoke it with \`/skill-name\` or when Claude decides it's relevant to your prompt. That means you can have deep, detailed guidance available without it costing context on every session.

\`\`\`
.claude/skills/
  api-conventions/
    SKILL.md          # knowledge skill — applied when relevant
  fix-issue/
    SKILL.md          # workflow skill — invoked as /fix-issue
    scripts/          # supporting files live alongside
\`\`\`

## SKILL.md

\`\`\`markdown
---
name: fix-issue
description: Analyze and fix a GitHub issue end to end
disable-model-invocation: true
argument-hint: <issue-number>
allowed-tools: Bash Read Edit Grep Glob
---
Fix GitHub issue #$ARGUMENTS:
1. \`gh issue view $ARGUMENTS\` to read it
2. Search the codebase for the relevant files
3. Write a failing test that reproduces the problem
4. Implement the fix; run tests and lint
5. Commit with a descriptive message and open a PR
\`\`\`

Key frontmatter: \`description\` (when to use), \`disable-model-invocation: true\` (you invoke only — good for side-effecting workflows), \`user-invocable: false\` (Claude only), \`allowed-tools\` (pre-approve), \`context: fork\` (run in a subagent), \`paths\` (restrict to file patterns), \`argument-hint\`.

Invoke: \`/fix-issue 1234\`. \`$ARGUMENTS\` interpolates. Dynamic context: \`!\\\`git diff HEAD\\\`\` runs the command and injects its output.

## Where skills come from (priority order)

Enterprise → personal (\`~/.claude/skills/\`) → project (\`.claude/skills/\`) → plugin → bundled (built-in ones like \`/code-review\`, \`/security-review\`, \`/debug\`).

## Skill vs rule vs hook vs subagent

| You want… | Use |
| --- | --- |
| Always-on facts/conventions | CLAUDE.md or a rule |
| Detailed procedure needed only sometimes | **Skill** |
| A guarantee that fires on an event | Hook |
| Isolated work in a separate context window | Subagent (or a skill with \`context: fork\`) |

## The exercise: requirement → plan skill

Build \`.claude/skills/req-to-plan/SKILL.md\` that takes a product requirement and produces an implementation plan:

1. Restate the requirement and list open questions.
2. Identify affected files/modules (search the codebase).
3. Propose 2 approaches with trade-offs; recommend one.
4. Break the recommendation into verifiable steps, each with its check.
5. List risks and out-of-scope items.
6. Write the result to \`PLAN-<slug>.md\`.

Now every requirement gets the same rigorous treatment with one command — and the team shares it via git.
`,
    exercises: [
      {
        id: 'l14-e1',
        kind: 'freeform',
        title: 'Build the req-to-plan skill',
        prompt:
          'Write the full SKILL.md for req-to-plan described in the lesson. Choose sensible frontmatter (should the model be able to auto-invoke it? which tools?). Make $ARGUMENTS the requirement text.',
      },
      {
        id: 'l14-e2',
        kind: 'reflection',
        title: 'Why on-demand beats always-on here',
        prompt:
          'You have a detailed 60-line guide for "adding a new database migration safely." Explain why this should be a skill rather than a section of CLAUDE.md.',
        modelAnswer:
          'CLAUDE.md loads every session and competes for attention with every other rule; 60 lines about migrations would dilute everything else on the 95% of sessions that never touch migrations. As a skill it costs nothing until invoked (or until Claude sees a migration task), and it can be as detailed as needed without a context budget concern.',
      },
    ],
    quiz: [
      {
        id: 'l14-q1',
        question: 'The core advantage of a skill over putting the same content in CLAUDE.md:',
        options: [
          'Skills are version controlled',
          'Skills load on demand (when invoked or judged relevant), so detailed guidance costs no context on unrelated sessions',
          'Skills can be longer',
          'Skills run faster',
        ],
        correctAnswer: 1,
        explanation: 'On-demand loading is the whole point — depth without permanent context cost.',
        skills: ['skills', 'context'],
      },
      {
        id: 'l14-q2',
        question: 'When should a workflow skill set `disable-model-invocation: true`?',
        options: [
          'Always',
          'When it has side effects (commits, deploys, PRs) you want to trigger manually, not have Claude auto-run',
          'Never',
          'Only for read-only skills',
        ],
        correctAnswer: 1,
        explanation: 'Manual-only invocation prevents Claude from firing a side-effecting workflow on its own initiative.',
        skills: ['skills', 'security'],
      },
      {
        id: 'l14-q3',
        question: 'A skill with `context: fork` in its frontmatter…',
        options: [
          'Deletes the current context',
          'Runs in a subagent / isolated context that inherits the current conversation',
          'Cannot use tools',
          'Runs on every prompt',
        ],
        correctAnswer: 1,
        explanation: 'fork runs the skill in an isolated context that starts from the parent conversation — useful for verbose sub-tasks.',
        skills: ['skills', 'subagents'],
      },
      {
        id: 'l14-q4',
        question: '`/code-review`, `/security-review`, and `/debug` are examples of…',
        options: [
          'Custom skills you must write',
          'Bundled (built-in) skills that ship with Claude Code',
          'MCP servers',
          'Hooks',
        ],
        correctAnswer: 1,
        explanation: 'They are bundled skills, the lowest-priority tier — your own project/personal skills can override them.',
        skills: ['skills', 'commands'],
      },
    ],
    resources: [
      { label: 'Extend Claude with skills', url: 'https://code.claude.com/docs/en/skills', official: true },
      { label: 'Slash commands', url: 'https://code.claude.com/docs/en/slash-commands', official: true },
      { label: 'Extend Claude Code — match features to your goal', url: 'https://code.claude.com/docs/en/features-overview', official: true },
    ],
    relatedLessons: ['l8-claude-md', 'l11-subagents', 'l13-hooks'],
  },
];
