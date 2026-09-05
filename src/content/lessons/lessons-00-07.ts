import type { Lesson } from '../types';

export const LESSONS_00_07: Lesson[] = [
  // ======================================================================
  {
    id: 'l0-what-is-claude-code',
    level: 0,
    order: 1,
    title: 'What Is Claude Code (and What Is an AI Coding Agent)?',
    tagline: 'An agent reads, plans, edits, and runs — a chatbot only talks.',
    category: 'Orientation',
    difficulty: 'intro',
    estimatedMinutes: 12,
    skills: ['prompting', 'navigation'],
    objectives: [
      'Explain the difference between a chatbot and an agentic coding tool',
      'Describe the agent loop: read → plan → act → observe → repeat',
      'Identify the surfaces Claude Code runs on and what stays the same across them',
      'State who is responsible for reviewing agent actions',
    ],
    prerequisites: [],
    body: `
## The one-sentence version

**Claude Code is an agentic coding tool.** It reads your codebase, edits files, runs commands, and integrates with your development tools — in your terminal, IDE, desktop app, or browser.

A chatbot answers a question and stops. An **agent** works in a loop:

1. **Read** — it opens files, searches code, runs read-only commands to gather context.
2. **Plan** — it decides what to change and in what order.
3. **Act** — it edits files, runs tests, executes shell commands (with your permission).
4. **Observe** — it reads the output: test results, errors, diffs.
5. **Repeat** — it iterates until the task looks done or it needs you.

The important shift: **you describe the outcome; Claude figures out the steps.** You are no longer typing every line — you are directing, reviewing, and verifying.

## What "has access to your codebase" really means

Claude Code runs on *your machine* (or an isolated cloud VM). It uses tools:

- **Read / Glob / Grep** — inspect files and search without changing anything.
- **Edit / Write** — modify files.
- **Bash** (or PowerShell on Windows) — run commands: tests, builds, git, package managers.
- **Web fetch, MCP tools, subagents** — reach beyond the local files.

Every action that could change your system asks for permission (in Manual mode) or is screened by a classifier (in auto mode). Read-only commands like \`ls\`, \`cat\`, and \`git status\` run without asking.

## Same engine, many surfaces

Terminal CLI, VS Code / JetBrains extensions, the desktop app, and the web all connect to the **same Claude Code engine**. Your \`CLAUDE.md\` files, settings, and MCP servers work everywhere. Pick the surface that fits the task; the mental model doesn't change.

## Who is responsible?

You are. Claude Code only has the permissions you grant, and *you* review proposed code and commands before approving them. The rest of this Academy is about building the judgment to do that well — and to know when it is safe to step away.

> **Verify against current Claude Code documentation.** Feature names and defaults evolve. When something here disagrees with the official docs, the docs win — and tell us so we can update.
`,
    exercises: [
      {
        id: 'l0-e1',
        kind: 'reflection',
        title: 'Chatbot vs agent',
        prompt:
          'You ask an assistant "why is my test failing?" Describe what a chatbot would do with that question versus what an agent like Claude Code would do. What information does the agent have that the chatbot does not?',
        modelAnswer:
          'A chatbot answers from the text you pasted — it guesses based on the snippet. An agent runs the test to see the real failure, reads the stack trace, opens the files named in it, checks recent changes with git, forms a hypothesis, and can apply and re-run a fix. It has the actual runtime behavior, the full file contents, and history — not just your description.',
      },
      {
        id: 'l0-e2',
        kind: 'order-steps',
        title: 'Put the agent loop in order',
        prompt: 'Drag these into the order the agent loop runs.',
        items: ['Act (edit / run)', 'Read / gather context', 'Observe output', 'Plan the change', 'Repeat or hand back to you'],
        correctOrder: [1, 3, 0, 2, 4],
      },
    ],
    quiz: [
      {
        id: 'l0-q1',
        question: 'What most distinguishes Claude Code from a chat assistant?',
        options: [
          'It uses a larger model',
          'It can read files, run commands, and edit code in a loop',
          'It never makes mistakes',
          'It only works in the terminal',
        ],
        correctAnswer: 1,
        explanation:
          'The defining feature is the agent loop — acting on your environment (reading, running, editing) and observing results — not model size or a single surface.',
        skills: ['prompting'],
      },
      {
        id: 'l0-q2',
        question: 'Which command would Claude Code typically run WITHOUT asking permission first (Manual mode)?',
        options: ['git push', 'rm -rf build', 'git status', 'npm install'],
        correctAnswer: 2,
        explanation: '`git status` is read-only. Anything that modifies your system or network state prompts for approval in Manual mode.',
        skills: ['security'],
      },
      {
        id: 'l0-q3',
        question: 'You run Claude Code in the terminal today and the desktop app tomorrow. What carries over?',
        options: [
          'Nothing — each surface is separate',
          'CLAUDE.md files, settings, and MCP servers — they share one engine',
          'Only your login',
          'Only the conversation history',
        ],
        correctAnswer: 1,
        explanation: 'All surfaces connect to the same engine, so project instructions, settings, and integrations are consistent across them.',
        skills: ['commands'],
      },
      {
        id: 'l0-q4',
        question: 'Who is responsible for the safety of code and commands Claude Code proposes?',
        options: ['Anthropic', 'The model', 'You, the user', 'The CI system'],
        correctAnswer: 2,
        explanation: 'Claude Code has only the permissions you grant. Reviewing proposed changes and commands before approval is your responsibility.',
        skills: ['security'],
      },
    ],
    resources: [
      { label: 'Claude Code overview', url: 'https://code.claude.com/docs/en/overview', official: true },
      { label: 'How Claude Code works', url: 'https://code.claude.com/docs/en/how-claude-code-works', official: true },
    ],
    relatedLessons: ['l0-terminal-git-basics', 'l1-first-session'],
  },

  // ======================================================================
  {
    id: 'l0-terminal-git-basics',
    level: 0,
    order: 2,
    title: 'Terminals, Files, Repositories, and Git — The Minimum',
    tagline: 'You do not need to be a terminal wizard. You do need these ten ideas.',
    category: 'Orientation',
    difficulty: 'intro',
    estimatedMinutes: 15,
    skills: ['terminal', 'git', 'navigation'],
    objectives: [
      'Navigate a filesystem with cd, ls/dir, and paths',
      'Explain what a repository, commit, branch, and diff are',
      'Describe what a development environment provides',
      'Recognize why permissions and working-directory boundaries matter',
    ],
    prerequisites: ['l0-what-is-claude-code'],
    body: `
## The terminal is just a text way to run programs

A shell (bash, zsh, PowerShell) shows a **prompt**, you type a **command**, it runs, it prints output. That's it.

| Idea | macOS / Linux | Windows PowerShell |
| --- | --- | --- |
| Where am I? | \`pwd\` | \`pwd\` |
| List files | \`ls\` | \`ls\` / \`dir\` |
| Change directory | \`cd src\` | \`cd src\` |
| Up one level | \`cd ..\` | \`cd ..\` |
| Show a file | \`cat file\` | \`cat file\` |
| Search text | \`grep\` | \`Select-String\` |

**Paths**: \`./src/api\` is relative to where you are. \`/Users/you/project\` (or \`C:\\Users\\you\\project\`) is absolute. Claude Code launches in a **working directory** and, in Manual mode, can only *write* inside that folder and its subfolders without extra permission.

## Files and directories

Your project is a tree of folders and files. Claude Code reads this tree to understand your code. A good project has a predictable shape (\`src/\`, \`tests/\`, \`package.json\` or \`pyproject.toml\`, a README).

## What a repository is

A **repository** ("repo") is a project folder that Git is tracking. Git records the history of every change so you can review, revert, and collaborate.

- **Commit** — a saved snapshot with a message. The unit of history.
- **Branch** — a movable pointer to a line of commits. \`main\` is the default; feature work happens on its own branch.
- **Diff** — the line-by-line difference between two states (your edits vs the last commit, or one branch vs another). **Reading diffs is how you review what Claude changed.**
- **Remote** — a copy hosted elsewhere (GitHub, GitLab). \`push\` sends commits up; \`pull\` brings them down.
- **Pull request (PR)** — a proposal to merge one branch into another, with review and discussion.

## Development environments

To *run* a project you need its toolchain: a language runtime (Node, Python), its dependencies (installed via npm, pip, etc.), and often environment variables (config and secrets). "It works on my machine" problems are usually environment mismatches. Claude Code can set these up, but it needs to know the commands — which is exactly what \`CLAUDE.md\` is for (Level 8).

## Why permissions exist

Claude Code can run commands. Some commands are destructive (\`rm -rf\`), some exfiltrate data (\`curl\` to an unknown host), some cost money. The permission system makes you the gate. Working-directory boundaries stop an agent from wandering into \`~/.ssh\`. None of this is bureaucracy — it is the safety model that makes agentic coding usable.
`,
    exercises: [
      {
        id: 'l0-e3',
        kind: 'checklist',
        title: 'Can you answer these about your own project?',
        prompt: 'Check the ones you can answer right now without looking anything up.',
        items: [
          'What is the absolute path to my project folder?',
          'What command runs my project locally?',
          'What command runs my tests?',
          'Which branch am I on, and what does `git status` show?',
          'What is my default branch called?',
          'Where do secrets / env vars live (and are they gitignored)?',
        ],
      },
      {
        id: 'l0-e4',
        kind: 'reflection',
        title: 'Why the working-directory boundary?',
        prompt:
          'Claude Code launched in ~/projects/shop can freely write to ~/projects/shop/src but not to ~/projects/other or ~/.aws. Explain why this default is a good idea even when you trust the task.',
        modelAnswer:
          'Trusting the task is not the same as trusting every step. A misread instruction, a bad glob, or prompt-injected text in a file could target paths you never intended. Confining writes to the project means the worst case is contained to code you were already going to review — not your credentials or unrelated projects.',
      },
    ],
    quiz: [
      {
        id: 'l0-q5',
        question: 'What is a "diff"?',
        options: [
          'A backup of your files',
          'The line-by-line difference between two states of the code',
          'A type of branch',
          'A merge conflict',
        ],
        correctAnswer: 1,
        explanation: 'A diff shows exactly which lines were added, removed, or changed. Reviewing diffs is the primary way you audit agent-generated changes.',
        skills: ['git'],
      },
      {
        id: 'l0-q6',
        question: 'A commit is best described as…',
        options: [
          'A saved, message-labeled snapshot of the repo at a point in time',
          'A request to merge code',
          'A remote copy of your project',
          'The current working directory',
        ],
        correctAnswer: 0,
        explanation: 'Commits are the atomic units of Git history. A PR is a merge proposal; a remote is a hosted copy.',
        skills: ['git'],
      },
      {
        id: 'l0-q7',
        question: '"It works on my machine but not in CI" is most often caused by…',
        options: ['A model bug', 'An environment mismatch (versions, dependencies, env vars)', 'A slow network', 'Too many branches'],
        correctAnswer: 1,
        explanation: 'Different runtime versions, missing dependencies, or absent environment variables are the usual culprits.',
        skills: ['terminal'],
      },
      {
        id: 'l0-q8',
        question: 'On Windows PowerShell, which is the closest equivalent to `grep`?',
        options: ['findstr only', 'Select-String', 'ls', 'Get-Content'],
        correctAnswer: 1,
        explanation: '`Select-String` is the idiomatic PowerShell text search. Claude Code also has its own Grep tool that works cross-platform.',
        skills: ['terminal'],
      },
    ],
    resources: [
      { label: 'Set up Claude Code (advanced setup)', url: 'https://code.claude.com/docs/en/setup', official: true },
      { label: 'Permissions', url: 'https://code.claude.com/docs/en/permissions', official: true },
    ],
    relatedLessons: ['l5-git-with-claude', 'l15-terminal-mastery'],
  },

  // ======================================================================
  {
    id: 'l1-install-auth',
    level: 1,
    order: 1,
    title: 'Install, Authenticate, and Launch',
    tagline: 'Get a working session in under five minutes — then understand what just happened.',
    category: 'Fundamentals',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    skills: ['commands'],
    versionSensitive: true,
    objectives: [
      'Install Claude Code on macOS/Linux/WSL or Windows',
      'Authenticate with a subscription or API key',
      'Launch a session in a project and recognize the interface',
      'Know how to check your setup with claude doctor / /doctor',
    ],
    prerequisites: ['l0-terminal-git-basics'],
    body: `
## Install

**Native install (recommended):**

\`\`\`bash
# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
\`\`\`

Native installs auto-update in the background. Alternatives: Homebrew (\`brew install --cask claude-code\`), WinGet (\`winget install Anthropic.ClaudeCode\`), apt/dnf/apk on Linux. The **desktop app** bundles Claude Code — no separate CLI install needed. On native Windows, installing **Git for Windows** lets Claude Code use the Bash tool; without it, it uses PowerShell.

> **Verify against current Claude Code documentation** — install URLs and package names change.

## Authenticate

Run \`claude\` in any folder. On first use you are prompted to log in:

- **Claude subscription** (Pro / Max / Team) — the common path. Browser login.
- **Anthropic Console / API key** — set \`ANTHROPIC_API_KEY\` and Claude Code asks you to approve the key instead of logging in. Usage is billed per token.

CLI equivalents: \`claude auth login\`, \`claude auth status\`, \`claude auth logout\`.

## Launch

\`\`\`bash
cd your-project
claude                       # interactive session
claude "explain this project"  # start with a prompt
claude -p "list the API endpoints"   # print result and exit (non-interactive)
claude -c                    # continue the most recent conversation
claude -r "session-name"     # resume a named session
\`\`\`

The first time you run Claude Code in a folder it asks you to **trust** it (the trust dialog). This exists because project files — including \`CLAUDE.md\` and \`.mcp.json\` — can contain instructions.

## The interface

A session shows: your prompt input, Claude's streamed responses, tool calls (with diffs and command output inline), and a status bar (permission mode, context usage, model). Key controls you'll meet soon: \`Esc\` to interrupt, \`Shift+Tab\` to cycle permission modes, \`/\` to open the command menu.

## Check your setup

\`claude doctor\` (or \`/doctor\` in a session) runs diagnostics: version, install method, auth, config problems, and — for a checked-in \`CLAUDE.md\` — suggested trims.
`,
    exercises: [
      {
        id: 'l1-e1',
        kind: 'checklist',
        title: 'Setup checklist',
        prompt: 'Work through these in a real terminal if you can.',
        items: [
          'Claude Code installed (`claude --version` prints a version)',
          'Authenticated (`claude auth status` shows logged in)',
          'Launched `claude` inside a real project directory',
          'Accepted (or consciously declined) the trust dialog',
          'Ran `/doctor` and read the output',
        ],
      },
    ],
    quiz: [
      {
        id: 'l1-q1',
        question: 'You set ANTHROPIC_API_KEY before running `claude`. What happens?',
        options: [
          'Claude Code refuses to start',
          'It skips the browser login and asks you to approve the key; usage is billed per token',
          'It ignores the key and uses your subscription',
          'It logs you out',
        ],
        correctAnswer: 1,
        explanation: 'An API key routes you to Console/API billing. Claude Code asks you to approve the detected key instead of showing the subscription login.',
        skills: ['commands'],
      },
      {
        id: 'l1-q2',
        question: 'Why does Claude Code show a "trust" prompt the first time you run it in a folder?',
        options: [
          'To upsell a subscription',
          'Because project files like CLAUDE.md and .mcp.json can contain instructions and server configs',
          'To index your code for search',
          'It is a legal requirement',
        ],
        correctAnswer: 1,
        explanation: 'Trust verification protects you from instructions or MCP server definitions committed by others into a shared repo.',
        skills: ['security'],
      },
      {
        id: 'l1-q3',
        question: 'Which command continues your most recent conversation?',
        options: ['claude --new', 'claude -c', 'claude reset', 'claude -p'],
        correctAnswer: 1,
        explanation: '`claude -c` (`--continue`) resumes the latest session. `claude -r` resumes a chosen/named one. `-p` is non-interactive print mode.',
        skills: ['commands'],
      },
    ],
    resources: [
      { label: 'Quickstart', url: 'https://code.claude.com/docs/en/quickstart', official: true },
      { label: 'CLI reference', url: 'https://code.claude.com/docs/en/cli-reference', official: true },
      { label: 'Authentication', url: 'https://code.claude.com/docs/en/authentication', official: true },
    ],
    relatedLessons: ['l1-first-session', 'l10-advanced-commands'],
  },

  // ======================================================================
  {
    id: 'l1-first-session',
    level: 1,
    order: 2,
    title: 'Your First Session: Inspect, Ask, Change, Review',
    tagline: 'The loop you will run thousands of times, in miniature.',
    category: 'Fundamentals',
    difficulty: 'beginner',
    estimatedMinutes: 16,
    skills: ['navigation', 'codebase', 'git'],
    objectives: [
      'Ask Claude to inspect and summarize a project',
      'Ask questions about the codebase and locate files',
      'Make one small, well-scoped change',
      'Review the diff and accept or reject it',
    ],
    prerequisites: ['l1-install-auth'],
    body: `
## Start read-only

Before asking for any change, understand what you have. Good opening prompts:

- *"Give me a high-level tour of this project: languages, entry points, how it's run and tested."*
- *"Where is user authentication handled? Point me to the files."*
- *"What does the \`src/queue\` module do and who calls it?"*

Claude reads files and answers. Nothing is modified. This is also the fastest way to onboard to a codebase — ask the questions you'd ask a senior engineer.

## Finding and searching

You don't run \`grep\` yourself. You ask:

- *"Find every place we read the \`STRIPE_KEY\` env var."*
- *"Which components import \`useToast\`?"*

Claude uses its Glob/Grep/Read tools and reports back with \`file:line\` references you can open.

## Make one small change

Pick something tiny and verifiable: fix a typo in a log message, add a missing null check, rename a poorly named local variable. Prompt precisely:

> In \`src/utils/format.ts\`, the \`formatPrice\` function doesn't handle \`null\`. Return \`"—"\` for null or undefined input. Don't change anything else.

## Review the diff

Claude proposes an edit and shows a diff. **Read every line.** Ask:

- Is this the change I asked for, and *only* that change?
- Does it match the surrounding style?
- Could it break a caller?

Then **accept** or **reject**. If it's close but not right, say what's wrong — *"good, but also handle empty string"* — and let it iterate. If it went sideways, reject and re-prompt more specifically, or use \`Esc\`/\`/rewind\` to roll back.

## Exit

Just close the terminal, or type \`/exit\`. The conversation is saved — \`claude -c\` picks it back up. Nothing is committed to Git unless you asked for it.

## The whole loop

**Inspect → Ask → Change (scoped) → Review diff → Accept/iterate/reject.** Every lesson after this is a variation on it.
`,
    exercises: [
      {
        id: 'l1-e2',
        kind: 'freeform',
        title: 'Run the loop for real',
        prompt:
          'In any project you have, run the full loop once: (1) ask for a tour, (2) ask one codebase question, (3) request one tiny scoped change, (4) review the diff and decide. Write two sentences on what surprised you.',
      },
      {
        id: 'l1-e3',
        kind: 'improve-prompt',
        title: 'Scope a change request',
        prompt: 'Rewrite this so Claude makes exactly one small change and nothing else.',
        starter: 'clean up the format file',
        modelAnswer:
          'In src/utils/format.ts, formatPrice throws on null/undefined. Make it return "—" for those inputs. Keep the existing behavior for all valid numbers, match the current code style, and do not touch other functions in the file. Show me the diff.',
      },
    ],
    quiz: [
      {
        id: 'l1-q4',
        question: 'What should you almost always do before asking Claude to change code in an unfamiliar project?',
        options: [
          'Commit everything first',
          'Ask read-only questions to understand structure and the relevant code',
          'Delete the tests',
          'Switch to bypassPermissions mode',
        ],
        correctAnswer: 1,
        explanation: 'Explore before you edit. Understanding the code first prevents "confidently wrong" changes that solve the wrong problem.',
        skills: ['codebase'],
      },
      {
        id: 'l1-q5',
        question: 'Claude proposes a diff that fixes your bug but also reformats 40 unrelated lines. Best response?',
        options: [
          'Accept — the formatting is probably an improvement',
          'Reject or ask it to redo with only the targeted change; unrelated churn makes review harder and PRs noisy',
          'Accept and fix the formatting later',
          'Commit it immediately',
        ],
        correctAnswer: 1,
        explanation: 'Keep diffs minimal and on-topic. Unrelated reformatting hides the real change and complicates review and revert.',
        skills: ['git', 'navigation'],
      },
      {
        id: 'l1-q6',
        question: 'You exit a session without committing. What happened to the conversation?',
        options: [
          'It is gone',
          'It is saved locally and resumable with `claude -c` or `--resume`',
          'It was pushed to GitHub',
          'It was emailed to you',
        ],
        correctAnswer: 1,
        explanation: 'Conversations persist locally and are resumable. Committing to Git is a separate, explicit step.',
        skills: ['commands'],
      },
    ],
    resources: [
      { label: 'Common workflows', url: 'https://code.claude.com/docs/en/common-workflows', official: true },
      { label: 'Manage sessions', url: 'https://code.claude.com/docs/en/sessions', official: true },
    ],
    relatedLessons: ['l2-task-formula', 'l3-codebase-understanding'],
  },

  // ======================================================================
  {
    id: 'l2-task-formula',
    level: 2,
    order: 1,
    title: 'The Claude Code Task Formula',
    tagline: 'GOAL + CONTEXT + CONSTRAINTS + EXPECTED RESULT + VERIFICATION.',
    category: 'Prompting',
    difficulty: 'beginner',
    estimatedMinutes: 18,
    skills: ['prompting'],
    objectives: [
      'Apply the five-part Task Formula to a real request',
      'Turn a vague ask into a precise, verifiable one',
      'Decide when a vague prompt is actually the right choice',
    ],
    prerequisites: ['l1-first-session'],
    body: `
## Why prompting is a skill here

Claude can infer intent but it can't read your mind. The cost of a vague prompt isn't a bad answer — it's Claude confidently building the *wrong thing* and you discovering it three files later.

## The formula

| Part | Question it answers | Example |
| --- | --- | --- |
| **Goal** | What outcome do I want? | "Add rate limiting to our public API endpoints" |
| **Context** | What should Claude look at / know? | "Middleware lives in \`src/middleware/\`. See \`auth.ts\` for the pattern. We use Redis (client in \`src/redis.ts\`)." |
| **Constraints** | What must it not do / must it respect? | "No new dependencies. Limit: 100 req/min per API key. Return HTTP 429 with a \`Retry-After\` header." |
| **Expected result** | What does 'done' look like? | "A \`rateLimit\` middleware applied to routes under \`/api/v1/\`, plus tests for under-limit, at-limit, and over-limit." |
| **Verification** | How will we *prove* it works? | "Run \`npm test src/middleware\` and paste the output. Add a test that simulates 101 requests." |

You don't need all five every time — but naming **verification** explicitly is the highest-leverage habit. It converts a session you have to babysit into one that closes its own loop.

## From vague to precise

**Level 0:** "Fix my app."
**Level 1:** "The app crashes on login."
**Level 2:** "Login fails after the session token expires — users get a white screen instead of a re-auth prompt."
**Level 3:** "Login fails after token expiry (repro: log in, wait 1h, click anything). Check \`src/auth/refresh.ts\`. Expected: silent token refresh, or redirect to \`/login\` if the refresh token is also dead. Write a failing test first, then fix, then run \`npm test auth\`."

Level 3 is a spec. Claude can execute it and check itself.

## Point to sources, not just problems

- Instead of *"why is this API weird?"* → *"read the git history of \`ExecutionFactory\` and summarize how its API evolved."*
- Instead of *"add a widget"* → *"follow the pattern in \`HotDogWidget.tsx\`; build a \`CalendarWidget\` the same way, no new libraries."*

## When vague is right

Exploratory prompts — *"what would you improve in this file?"*, *"how would you approach adding offline support?"* — are useful precisely because they're open. Use them when you're still forming the plan and can afford to course-correct. Switch to the formula once you know what you want built.
`,
    exercises: [
      {
        id: 'l2-e1',
        kind: 'improve-prompt',
        title: 'Rebuild "make it faster"',
        prompt: 'Apply all five parts of the Task Formula.',
        starter: 'the dashboard is slow, make it faster',
        modelAnswer:
          'Goal: cut the dashboard initial load from ~4s to under 1.5s. Context: the page is src/pages/Dashboard.tsx; it makes 6 sequential fetches in a useEffect (see lines 20-60); API client is src/api.ts. Constraints: no backend changes, no new deps, keep the same data on screen. Expected result: parallelize independent requests, add a loading skeleton, memoize the heavy chart. Verification: record before/after load time with the Performance panel and paste both numbers; run npm test src/pages.',
      },
      {
        id: 'l2-e2',
        kind: 'improve-prompt',
        title: 'Turn a bug report into a spec',
        prompt: 'Rewrite with symptom + repro + likely location + definition of fixed + verification.',
        starter: 'search is broken',
        modelAnswer:
          'Symptom: the search box returns no results for queries with an uppercase letter (e.g. "Invoice"), but works for "invoice". Repro: type any capitalized term in the header search. Likely location: src/search/query.ts — I think the index is lowercased but the query is not. Fixed = case-insensitive matching, existing lowercase queries still work, and a test covers "Invoice" -> same results as "invoice". Verify with npm test search.',
      },
      {
        id: 'l2-e3',
        kind: 'reflection',
        title: 'Which part do you skip most?',
        prompt:
          'Of the five parts, which do you personally leave out most often, and what has that cost you? What is a trigger you could use to remember it?',
      },
    ],
    quiz: [
      {
        id: 'l2-q1',
        question: 'Which Task Formula element most reliably turns a "babysit it" session into a "walk away" session?',
        options: ['Goal', 'Context', 'Verification', 'Constraints'],
        correctAnswer: 2,
        explanation: 'A check Claude can run (tests, build, script, screenshot compare) lets it iterate to correctness on its own instead of waiting for you to notice mistakes.',
        skills: ['prompting', 'autonomy'],
      },
      {
        id: 'l2-q2',
        question: 'A genuinely useful time to give a vague prompt is when…',
        options: [
          'You are in a hurry',
          'You are exploring an approach and want to see how Claude frames the problem before constraining it',
          'The task is security-sensitive',
          'You are running unattended in CI',
        ],
        correctAnswer: 1,
        explanation: 'Open prompts surface options and framings you might not have considered. Once you know what you want built, switch to the precise formula.',
        skills: ['prompting'],
      },
      {
        id: 'l2-q3',
        question: 'Best replacement for "why does ExecutionFactory have such a weird API?"',
        options: [
          'Just accept it',
          '"Look through ExecutionFactory\'s git history and summarize how its API came to be"',
          '"Rewrite ExecutionFactory"',
          '"Is this API weird? yes or no"',
        ],
        correctAnswer: 1,
        explanation: 'Point Claude at the source that can actually answer the question — here, history — instead of asking it to speculate.',
        skills: ['prompting', 'codebase'],
      },
      {
        id: 'l2-q4',
        question: 'You paste a screenshot of a target design and say "make the settings page look like this." What extra instruction closes the loop?',
        options: [
          '"Use TypeScript"',
          '"After implementing, take a screenshot of the result, compare it to the target, list the differences, and fix them"',
          '"Be creative"',
          '"Do it quickly"',
        ],
        correctAnswer: 1,
        explanation: 'Asking for a visual self-check against the target gives Claude a pass/fail signal it can iterate against.',
        skills: ['prompting', 'building'],
      },
    ],
    resources: [
      { label: 'Best practices — provide specific context', url: 'https://code.claude.com/docs/en/best-practices', official: true },
      { label: 'Prompt library', url: 'https://code.claude.com/docs/en/prompt-library', official: true },
    ],
    relatedLessons: ['l2-iterative-dev', 'l9-context-management'],
  },

  // ======================================================================
  {
    id: 'l2-iterative-dev',
    level: 2,
    order: 2,
    title: 'Plans, Small Steps, and Feedback Loops',
    tagline: 'Ask for a plan. Approve it. Then let Claude work — and correct early.',
    category: 'Prompting',
    difficulty: 'beginner',
    estimatedMinutes: 14,
    skills: ['prompting', 'building', 'context'],
    objectives: [
      'Use plan mode to separate research from execution',
      'Break a large task into independently verifiable steps',
      'Course-correct with Esc, "undo that", and /rewind instead of fighting a bad thread',
      'Ask Claude to explain its decisions and to investigate rather than guess',
    ],
    prerequisites: ['l2-task-formula'],
    body: `
## Explore → Plan → Implement → Commit

Letting Claude jump straight to code can produce a solution to the wrong problem. The recommended shape:

1. **Explore** — plan mode on (\`Shift+Tab\` until the status bar shows plan mode, or \`claude --permission-mode plan\`). Claude reads and answers; it can't edit. *"Read \`src/auth\` and explain how sessions and login work."*
2. **Plan** — *"I want to add Google OAuth. What changes, in what order? Write a plan."* Edit the plan directly if needed.
3. **Implement** — approve the plan (or leave plan mode) and let Claude code, checking against the plan.
4. **Commit** — *"commit with a descriptive message and open a PR."*

**Skip planning** for one-sentence diffs (typo, log line, rename). Plan when the approach is uncertain, the change spans multiple files, or the code is unfamiliar to you.

## Small, verifiable steps

"Add billing" is not a step. These are:

- "Add a \`Subscription\` model + migration; run the migration; show me the schema."
- "Add \`POST /api/checkout\` that creates a Stripe session; test the happy path."
- "Wire the frontend button to call it; screenshot the flow."

Each produces evidence before the next begins. If step 2 is wrong, you've lost minutes, not an afternoon.

## Correct early and often

- **\`Esc\`** — interrupt mid-action. Context is kept; redirect immediately.
- **"undo that"** — Claude reverts its last change.
- **\`Esc Esc\` / \`/rewind\`** — restore earlier conversation and/or code state from a checkpoint.
- **\`/clear\`** — wipe context between unrelated tasks.

Rule of thumb: **if you've corrected Claude on the same point more than twice, stop.** The thread is now polluted with failed attempts. \`/clear\` and restart with a sharper prompt that bakes in what you learned. A clean session with a better prompt beats a long one full of dead ends.

## Make it show its work

- *"Before you change anything, tell me your plan and why."*
- *"Don't guess — check how the existing code handles this and follow that."*
- *"Explain why you chose a Map here instead of an object."*

Asking for reasoning catches wrong assumptions while they're cheap to fix.
`,
    exercises: [
      {
        id: 'l2-e4',
        kind: 'order-steps',
        title: 'Order the recommended workflow',
        prompt: 'Put the four phases in order.',
        items: ['Implement against the plan', 'Explore in plan mode', 'Commit and open a PR', 'Produce and review a plan'],
        correctOrder: [1, 3, 0, 2],
      },
      {
        id: 'l2-e5',
        kind: 'reflection',
        title: 'The two-correction rule',
        prompt:
          'Think of a recent time you kept correcting an assistant in one long thread. At what point should you have run /clear and restarted? What would the better restart prompt have said?',
        modelAnswer:
          'The signal is the third correction on the same issue — by then the context holds two wrong approaches that bias the next attempt. The restart prompt should state the constraint that was violated, the approach that failed and why, and the specific outcome + verification, so the fresh session starts from your hard-won understanding.',
      },
    ],
    quiz: [
      {
        id: 'l2-q5',
        question: 'When is plan mode NOT worth the overhead?',
        options: [
          'When the change is a one-sentence diff you could describe exactly',
          'When you are unfamiliar with the code',
          'When the change spans many files',
          'When the approach is uncertain',
        ],
        correctAnswer: 0,
        explanation: 'If you could write the diff yourself in one sentence, planning is pure overhead — just ask for the change.',
        skills: ['prompting'],
      },
      {
        id: 'l2-q6',
        question: 'You have corrected Claude three times about the same naming convention and it is still wrong. Best move?',
        options: [
          'Correct it a fourth time, more firmly',
          '/clear and restart with a prompt that states the convention explicitly up front',
          'Accept the wrong names',
          'Switch models',
        ],
        correctAnswer: 1,
        explanation: 'Repeated corrections pollute context with failed attempts. A clean session with the rule stated up front outperforms the cluttered one.',
        skills: ['context', 'prompting'],
      },
      {
        id: 'l2-q7',
        question: 'Why break a big feature into steps that each end with a check?',
        options: [
          'It looks more professional',
          'Errors are caught after minutes of work instead of after the whole feature is built on a bad foundation',
          'It uses fewer tokens',
          'It avoids using Git',
        ],
        correctAnswer: 1,
        explanation: 'Verifiable checkpoints bound how much work a mistake can invalidate.',
        skills: ['building', 'autonomy'],
      },
    ],
    resources: [
      { label: 'Best practices — explore, plan, code, commit', url: 'https://code.claude.com/docs/en/best-practices', official: true },
      { label: 'Permission modes (plan mode)', url: 'https://code.claude.com/docs/en/permission-modes', official: true },
      { label: 'Checkpointing', url: 'https://code.claude.com/docs/en/checkpointing', official: true },
    ],
    relatedLessons: ['l2-task-formula', 'l4-build-loop', 'l9-context-management'],
  },

  // ======================================================================
  {
    id: 'l3-codebase-understanding',
    level: 3,
    order: 1,
    title: 'Understanding a Codebase Without Touching It',
    tagline: 'You inherited 50,000 lines. Build a map before you build anything else.',
    category: 'Codebase',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    skills: ['codebase', 'navigation', 'context'],
    objectives: [
      'Design an investigation strategy for an unfamiliar repo',
      'Trace a feature end to end (request → response, event → effect)',
      'Use subagents to explore without flooding your main context',
      'Produce a durable artifact (notes / diagram) from the investigation',
    ],
    prerequisites: ['l1-first-session', 'l2-iterative-dev'],
    body: `
## The challenge

> You have inherited a 50,000-line application. Use Claude Code to understand it **without modifying anything.**

Stay in plan mode or a read-only posture the whole time. The goal is a mental model and written notes, not a change.

## A strategy that works

**1. The 10,000-foot view.** *"What is this project, what stack, what are the entry points, how is it built, run, and tested? Answer from README, package manifests, and config — don't read the whole tree."*

**2. The seams.** Identify the boundaries: HTTP layer, domain/business logic, data access, background jobs, external integrations. *"Draw the module boundaries and how requests flow through them."*

**3. Trace one real feature end to end.** Pick something concrete — "creating an order." *"Trace 'create an order' from the HTTP route to the database write and the response. List every file and function, in order."* This one trace teaches you the conventions of the whole codebase.

**4. Find the load-bearing walls.** *"Which modules are imported most? Which files change most often in git history? Where is the gnarliest logic?"* These are where risk concentrates.

**5. Name the technical debt.** *"Where are the TODOs, the disabled tests, the \`any\` types, the duplicated logic, the functions over 100 lines?"*

## Protect your context

A naive "explain this codebase" makes Claude read hundreds of files — all of which land in *your* context window and degrade the rest of the session. Two defenses:

- **Scope every question.** "Answer from these three files" beats "figure it out."
- **Delegate to subagents.** *"Use subagents to investigate how auth, caching, and the job queue work. Have each report a one-page summary."* The reading happens in *their* context; you get the summaries.

## Leave an artifact

End every investigation by writing it down: \`NOTES.md\`, an architecture sketch, or a draft \`CLAUDE.md\`. *"Summarize everything we learned into \`docs/architecture-notes.md\`: modules, data flow, key files, known debt, open questions."* Next session — yours or a teammate's — starts from the map instead of redoing the walk.
`,
    exercises: [
      {
        id: 'l3-e1',
        kind: 'checklist',
        title: 'Investigation plan for an unfamiliar repo',
        prompt: 'These are the moves. Check the ones you would actually remember to do.',
        items: [
          'Get stack + entry points + build/run/test commands from config first',
          'Map module boundaries and request flow',
          'Trace one real feature end to end, file by file',
          'Find most-imported modules and most-churned files',
          'Catalog TODOs, skipped tests, obvious debt',
          'Use subagents so exploration does not fill my main context',
          'Write everything into a notes / architecture doc',
        ],
      },
      {
        id: 'l3-e2',
        kind: 'improve-prompt',
        title: 'Scope an exploration prompt',
        prompt: 'Rewrite so it does not trigger reading the entire repo.',
        starter: 'explain how this whole app works',
        modelAnswer:
          'Using only the README, package.json, and the files under src/server/, describe: the runtime, how the server starts, the top-level routing setup, and where request handlers live. Do not read the frontend or tests yet. Give me a numbered list and stop.',
      },
      {
        id: 'l3-e3',
        kind: 'reflection',
        title: 'Why trace just one feature?',
        prompt:
          'You could ask Claude for a summary of all 40 modules. Why is tracing a single feature end to end usually more valuable for building a real mental model?',
        modelAnswer:
          'A module list tells you names, not relationships. One end-to-end trace shows the actual conventions in use — how routing, validation, error handling, data access, and responses are wired together — which transfers to every other feature. It also gives you a concrete anchor to reason from instead of an abstract catalog.',
      },
    ],
    quiz: [
      {
        id: 'l3-q1',
        question: 'The main risk of "explain this entire codebase" as your first prompt is…',
        options: [
          'Claude will refuse',
          'It floods your context window with file contents, degrading the rest of the session',
          'It modifies files',
          'It is against the terms of service',
        ],
        correctAnswer: 1,
        explanation: 'Unscoped exploration reads hundreds of files into your context. Scope questions or delegate to subagents.',
        skills: ['context', 'codebase'],
      },
      {
        id: 'l3-q2',
        question: 'Best single technique for learning a codebase\'s conventions quickly?',
        options: [
          'Read every file alphabetically',
          'Trace one real feature from entry point to persistence and response',
          'Count the lines of code',
          'Rewrite the smallest module',
        ],
        correctAnswer: 1,
        explanation: 'One full trace reveals how the whole system wires routing, validation, logic, data access, and errors — patterns that repeat everywhere.',
        skills: ['codebase'],
      },
      {
        id: 'l3-q3',
        question: 'Why finish an investigation by writing an architecture-notes file?',
        options: [
          'It is required by Git',
          'So the next session (yours or a teammate\'s) starts from the map instead of re-exploring',
          'To increase the line count',
          'It makes the build faster',
        ],
        correctAnswer: 1,
        explanation: 'The investigation\'s value is lost if it lives only in a context window that will be cleared. Persist it.',
        skills: ['codebase', 'context'],
      },
      {
        id: 'l3-q4',
        question: 'Delegating exploration to subagents helps mainly because…',
        options: [
          'Subagents are smarter',
          'They read in their own context and return only summaries, keeping your main context clean',
          'They are free',
          'They can modify files faster',
        ],
        correctAnswer: 1,
        explanation: 'Context is the constraint. Subagents move the expensive reading off your main thread.',
        skills: ['subagents', 'context'],
      },
    ],
    resources: [
      { label: 'Common workflows — understand a new codebase', url: 'https://code.claude.com/docs/en/common-workflows', official: true },
      { label: 'Subagents', url: 'https://code.claude.com/docs/en/sub-agents', official: true },
      { label: 'Large codebases', url: 'https://code.claude.com/docs/en/large-codebases', official: true },
    ],
    relatedLessons: ['l11-subagents', 'l17-large-projects', 'l9-context-management'],
  },

  // ======================================================================
  {
    id: 'l4-build-loop',
    level: 4,
    order: 1,
    title: 'The Build Loop: Plan → Ship',
    tagline: 'One disciplined loop scales from a landing page to a production SaaS.',
    category: 'Building',
    difficulty: 'intermediate',
    estimatedMinutes: 22,
    skills: ['building', 'testing', 'git', 'architecture'],
    objectives: [
      'Run the eight-phase build loop on a small app',
      'Write a self-contained spec before implementing',
      'Insert verification at every phase, not just the end',
      'Know which phases to compress for small projects',
    ],
    prerequisites: ['l2-iterative-dev', 'l3-codebase-understanding'],
    body: `
## The loop

**PLAN → ARCHITECT → IMPLEMENT → TEST → DEBUG → REFACTOR → DOCUMENT → DEPLOY**

It's the same loop at every scale. Small projects compress phases (a todo app's "architecture" is two sentences); production projects expand them. The order rarely changes.

### 1. Plan — write a spec

For anything non-trivial, have Claude interview you first:

> I want to build [X]. Interview me in detail using the AskUserQuestion tool. Ask about implementation, UI/UX, edge cases, and trade-offs — dig into the hard parts. When we've covered everything, write a complete spec to \`SPEC.md\`.

A good spec names the files and interfaces involved, states what's **out of scope**, and ends with an **end-to-end verification step**. Then start a *fresh session* to build it — clean context, written reference.

### 2. Architect

*"Given SPEC.md, propose 2–3 architectures. For each: components, data model, key trade-offs. Recommend one and say why."* Record the decision (see Level 18).

### 3. Implement

Work in **small steps**, each ending in evidence (Level 2). Reference existing patterns: *"follow the structure of \`src/features/orders/\` for the new \`invoices\` feature."*

### 4. Test

Ideally *before* the code for tricky logic (Level 7). At minimum: *"write tests for the happy path and the three edge cases in the spec; run them."*

### 5. Debug

When something breaks, switch to the debugging method (Level 6): reproduce, gather evidence, isolate, fix the **root cause**, regression-test. Don't let Claude suppress errors to make output look green.

### 6. Refactor

Only once it works and is tested. *"The tests pass. Now refactor \`checkout.ts\` for readability without changing behavior; re-run the tests after."*

### 7. Document

*"Update the README with setup, run, and test instructions. Add a short 'how it works' section. Update CLAUDE.md if any new commands or conventions were introduced."*

### 8. Deploy

*"What's the deployment story? Walk me through it, then help me do a staging deploy and verify it's live."* Never let deploy be the first time the thing runs outside your laptop.

## The ten project types

Website → interactive frontend → CRUD → REST API → DB-backed → auth system → full-stack → mobile-friendly → AI-powered → production-style. Each adds one hard thing (state, persistence, security, integration, scale). The **loop stays the same**; the Project Library (Level 21) walks you through them.
`,
    exercises: [
      {
        id: 'l4-e1',
        kind: 'order-steps',
        title: 'Order the build loop',
        prompt: 'Arrange the eight phases.',
        items: ['Refactor', 'Plan (spec)', 'Deploy', 'Implement', 'Architect', 'Document', 'Test', 'Debug'],
        correctOrder: [1, 4, 3, 6, 7, 0, 5, 2],
      },
      {
        id: 'l4-e2',
        kind: 'freeform',
        title: 'Write a one-page spec',
        prompt:
          'Pick a tiny app (quiz app, habit tracker). Write a spec with: goal, core features, data model, what is explicitly out of scope, and an end-to-end verification step that would prove it works.',
      },
      {
        id: 'l4-e3',
        kind: 'reflection',
        title: 'Why a fresh session to implement?',
        prompt:
          'After Claude interviews you and writes SPEC.md, best practice is to start a new session to build it. Why not just continue?',
        modelAnswer:
          'The interview fills context with exploration, discarded options, and back-and-forth that no longer matters. A fresh session starts with a clean window focused entirely on implementation, with the durable spec as its reference — better adherence, fewer distractions, and the spec survives even if the session is later compacted.',
      },
    ],
    quiz: [
      {
        id: 'l4-q1',
        question: 'What are the three marks of a good spec?',
        options: [
          'It is long, formal, and uses UML',
          'It names the files/interfaces involved, states what is out of scope, and ends with an end-to-end verification step',
          'It lists every possible feature',
          'It is written entirely by Claude with no input',
        ],
        correctAnswer: 1,
        explanation: 'Precise scope and a concrete "how we prove it works" step matter far more than length or formality.',
        skills: ['building', 'architecture'],
      },
      {
        id: 'l4-q2',
        question: 'When should refactoring happen in the loop?',
        options: [
          'First, to set up clean structure',
          'After the feature works and is covered by tests, changing structure without changing behavior',
          'Never — Claude writes clean code',
          'During deployment',
        ],
        correctAnswer: 1,
        explanation: 'Refactor on a green test suite so you can prove behavior is unchanged.',
        skills: ['testing', 'building'],
      },
      {
        id: 'l4-q3',
        question: 'The ten project types (website → production SaaS) mainly differ by…',
        options: [
          'The programming language',
          'Each adding one hard concern (state, persistence, auth, integration, scale) while the build loop stays constant',
          'How much they cost',
          'The number of files',
        ],
        correctAnswer: 1,
        explanation: 'The value of the progression is layering one new challenge at a time onto an unchanging method.',
        skills: ['building'],
      },
    ],
    resources: [
      { label: 'Best practices — let Claude interview you', url: 'https://code.claude.com/docs/en/best-practices', official: true },
      { label: 'Common workflows', url: 'https://code.claude.com/docs/en/common-workflows', official: true },
    ],
    relatedLessons: ['l4-verification', 'l7-testing', 'l18-architecture'],
  },

  // ======================================================================
  {
    id: 'l4-verification',
    level: 4,
    order: 2,
    title: 'Give Claude a Way to Check Its Own Work',
    tagline: 'Without a check it can run, "looks done" is the only signal — and you are the loop.',
    category: 'Building',
    difficulty: 'intermediate',
    estimatedMinutes: 14,
    skills: ['building', 'testing', 'autonomy'],
    objectives: [
      'List the kinds of checks Claude can read as a pass/fail signal',
      'Choose how hard a check gates the stop (prompt, /goal, Stop hook, review subagent)',
      'Ask for evidence instead of assertions of success',
    ],
    prerequisites: ['l4-build-loop'],
    body: `
## The core idea

Claude stops when the work *looks* done. If there's no check it can run, "looks done" is the only signal available — and **you become the verification loop**: every mistake waits for you to catch it.

Give Claude something that returns a pass or fail it can read in the conversation, and the loop closes itself: it does the work, runs the check, reads the result, iterates until it passes.

## Checks Claude can read

- A **test suite** (\`npm test\`, \`pytest\`)
- A **build** exit code / **type check** / **linter**
- A **script that diffs output** against a fixture
- A **browser screenshot** compared to a target design
- A CLI command whose output it can inspect

## How hard should the check gate the stop?

| Mechanism | What it does | Use when |
| --- | --- | --- |
| **In one prompt** | "run the tests and iterate until they pass" | Any task, right now |
| **\`/goal\` condition** | A separate evaluator re-checks after every turn; Claude keeps going until it resolves | A multi-step task you want to run mostly unattended |
| **Stop hook** | A script runs your check and blocks the turn from ending until it passes (overridden after ~8 blocks) | A deterministic gate that must not be skipped |
| **Review subagent** | A fresh model sees only the diff + criteria and tries to refute the result | The work ran a long time unattended and an independent check matters |

Each trades setup effort for less of your attention.

## Demand evidence

Add to your prompts: *"show the test output"*, *"paste the command you ran and what it returned"*, *"screenshot the result."* Reviewing evidence is faster than re-running verification yourself — and it's the only way to trust a session you didn't watch.

## The adversarial reviewer caveat

A subagent told to "find gaps" will almost always report some, even on sound work — that's what it was asked to do. Tell it to flag **only** issues that affect correctness or the stated requirements, and treat the rest as optional. Chasing every finding leads to over-engineering.
`,
    exercises: [
      {
        id: 'l4-e4',
        kind: 'improve-prompt',
        title: 'Add verification to a feature request',
        prompt: 'Rewrite so Claude can check itself and must show evidence.',
        starter: 'add an email validation function',
        modelAnswer:
          'Write a validateEmail(input: string): boolean in src/utils/validate.ts. Test cases it must satisfy: "user@example.com" -> true, "user@.com" -> false, "userexample.com" -> false, "" -> false, "a@b.co" -> true. Write these as unit tests, run the suite, and paste the output. If any fail, fix and re-run until all pass.',
      },
      {
        id: 'l4-e5',
        kind: 'reflection',
        title: 'A task you can\'t verify',
        prompt:
          'Think of a change you recently made that had no automated check. How could you have given it one? If you genuinely couldn\'t, what does the best-practices guidance ("if you can\'t verify it, don\'t ship it") imply you should have done?',
      },
    ],
    quiz: [
      {
        id: 'l4-q4',
        question: 'Why does giving Claude a runnable check matter so much for unattended work?',
        options: [
          'It makes Claude faster',
          'It closes the iteration loop — Claude can detect and fix its own mistakes instead of waiting for you',
          'It reduces token cost',
          'It is required by the permission system',
        ],
        correctAnswer: 1,
        explanation: 'A pass/fail signal Claude can read is what lets it iterate to correctness without you in the loop.',
        skills: ['autonomy', 'building'],
      },
      {
        id: 'l4-q5',
        question: 'Which gives the strongest, most deterministic guarantee that a check ran before a turn ended?',
        options: ['Asking nicely in the prompt', 'A /goal condition', 'A Stop hook that blocks until the check passes', 'Hoping'],
        correctAnswer: 2,
        explanation: 'A Stop hook runs your script as a hard gate (Claude Code overrides it only after ~8 consecutive blocks). /goal is softer; the prompt is softest.',
        skills: ['hooks', 'autonomy'],
      },
      {
        id: 'l4-q6',
        question: 'A review subagent reports 9 "issues" on a small, correct change. Likely explanation?',
        options: [
          'The change is badly broken',
          'A reviewer asked to find gaps will surface some regardless; scope it to correctness/requirements and treat the rest as optional',
          'The subagent malfunctioned',
          'You should rewrite everything',
        ],
        correctAnswer: 1,
        explanation: 'Adversarial reviewers over-report by design. Chasing every finding causes over-engineering.',
        skills: ['subagents', 'autonomy'],
      },
    ],
    resources: [
      { label: 'Best practices — give Claude a way to verify its work', url: 'https://code.claude.com/docs/en/best-practices', official: true },
      { label: '/goal — keep Claude working toward a goal', url: 'https://code.claude.com/docs/en/goal', official: true },
      { label: 'Hooks reference (Stop)', url: 'https://code.claude.com/docs/en/hooks', official: true },
    ],
    relatedLessons: ['l7-testing', 'l13-hooks', 'l20-autonomous-dev'],
  },

  // ======================================================================
  {
    id: 'l5-git-with-claude',
    level: 5,
    order: 1,
    title: 'Git with Claude Code: Branches, Diffs, Commits, PRs',
    tagline: 'Claude changed 14 files. Your job is to decide what should be committed.',
    category: 'Git',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    skills: ['git'],
    objectives: [
      'Use feature branches to make agent work safe to experiment with',
      'Review a multi-file diff and split it into coherent commits',
      'Have Claude write commits and open PRs with the gh CLI',
      'Handle merge conflicts and reverts with Claude',
    ],
    prerequisites: ['l0-terminal-git-basics', 'l1-first-session'],
    body: `
## Branch first, always

Before a non-trivial task: *"create a branch \`feat/rate-limiting\` off main."* Now every experiment is contained. If it goes wrong, \`git checkout main\` and delete the branch — your \`main\` never saw the mess. Checkpoints (\`/rewind\`) handle in-session rollback of Claude's edits, but **checkpoints are not Git** — they don't track Bash-made changes. Branches are your real safety net.

## Reviewing a big diff

Claude reports "changed 14 files." Do **not** reflexively commit. Ask:

1. *"Summarize what changed and why, grouped by purpose."*
2. \`git diff\` — read it. For each file: is this change necessary for the task?
3. Look for: debug \`console.log\`s left in, unrelated formatting, a \`package-lock.json\` churn you didn't expect, commented-out code, a \`.env\` file (!).
4. *"Files A, B, C are the actual feature. D and E look unrelated — why did they change?"*

## Split into coherent commits

One commit = one logical change with a message that explains **why**, not just what.

> Stage and commit the migration and model as one commit ("add Subscription model"), then the API handler and its tests as a second ("add checkout endpoint"). Leave the unrelated lint fixes uncommitted for now.

## Let Claude drive Git

With the \`gh\` CLI installed, Claude handles the mechanics well:

- *"commit with a descriptive message"* — it writes a good one from the diff.
- *"open a PR; in the description explain the approach and how to test it."*
- *"this PR has review comments — address them and push."*

## Conflicts and reverts

- *"main moved ahead and we have conflicts in \`routes.ts\`. Show me both sides and propose a resolution that keeps both features."*
- *"the deploy broke. Revert the checkout commit but keep the migration."* — Claude knows \`git revert\`, \`git reset\`, \`git cherry-pick\`.

## Reviewing Claude's code specifically

Claude's diffs *look* confident and consistent — that's exactly why you must check edge cases, error handling, and whether tests actually exercise the new path. A fresh session (or subagent) reviewing the diff is less biased than the session that wrote it.
`,
    exercises: [
      {
        id: 'l5-e1',
        kind: 'checklist',
        title: 'Pre-commit review checklist',
        prompt: 'What you scan a Claude-generated diff for before committing.',
        items: [
          'Leftover debug logging / print statements',
          'Unrelated formatting or import reordering',
          'Secrets, .env files, credentials',
          'Unexpected lockfile / generated-file churn',
          'Commented-out code or dead code',
          'Tests that actually exercise the new behavior',
          'Each file\'s change is necessary for the stated task',
        ],
      },
      {
        id: 'l5-e2',
        kind: 'freeform',
        title: 'The 14-file scenario',
        prompt:
          'Claude changed 14 files for a "add pagination to the users list" task. Write the exact sequence of prompts you would use to review, group, and commit this safely.',
        modelAnswer:
          '1) "Summarize the 14 changed files grouped by purpose, and flag any not strictly required for pagination." 2) "Show me git diff for the files you flagged as unrelated." 3) "Commit the pagination logic + its tests as one commit; the shared Pagination component as a second." 4) "Revert the changes to the 3 unrelated files unless you can justify them." 5) "Open a PR describing the approach and how to test paging past page 1."',
      },
    ],
    quiz: [
      {
        id: 'l5-q1',
        question: 'Why create a feature branch before a big Claude task rather than relying on checkpoints?',
        options: [
          'Checkpoints cost money',
          'Checkpoints only track Claude\'s file-edit tools, not Bash or external changes; a branch is the real containment',
          'Branches are faster',
          'You cannot use checkpoints on Windows',
        ],
        correctAnswer: 1,
        explanation: 'Checkpoints are convenient in-session undo but explicitly not a Git replacement. Branch first for real safety.',
        skills: ['git'],
      },
      {
        id: 'l5-q2',
        question: 'A good commit message primarily explains…',
        options: ['What files changed', 'Why the change was made', 'Who made it', 'How long it took'],
        correctAnswer: 1,
        explanation: 'The diff already shows what changed. The message should capture intent and reasoning for future readers.',
        skills: ['git'],
      },
      {
        id: 'l5-q3',
        question: 'Reviewing Claude\'s diff in a fresh session or subagent is better because…',
        options: [
          'It is faster',
          'A context that did not write the code is less biased toward defending it and evaluates the result on its own terms',
          'It uses a better model',
          'It avoids merge conflicts',
        ],
        correctAnswer: 1,
        explanation: 'Fresh context = genuine second opinion. The writing session tends to rationalize its own choices.',
        skills: ['git', 'subagents'],
      },
      {
        id: 'l5-q4',
        question: 'You spot a `.env` file in the proposed diff. Correct reaction?',
        options: [
          'Commit it — configs belong in the repo',
          'Stop, remove it from the change, ensure it is gitignored, and check it was never committed historically',
          'Rename it to .env.backup and commit',
          'Ignore it',
        ],
        correctAnswer: 1,
        explanation: '.env files hold secrets and must not be committed. Catching this in review is exactly why you read diffs.',
        skills: ['git', 'security'],
      },
    ],
    resources: [
      { label: 'Common workflows — Git, commits, PRs', url: 'https://code.claude.com/docs/en/common-workflows', official: true },
      { label: 'Checkpointing', url: 'https://code.claude.com/docs/en/checkpointing', official: true },
    ],
    relatedLessons: ['l5-worktrees', 'l16-security', 'l20-autonomous-dev'],
  },

  // ======================================================================
  {
    id: 'l5-worktrees',
    level: 5,
    order: 2,
    title: 'Parallel Work with Git Worktrees',
    tagline: 'Two branches, two Claude sessions, one repo, zero collisions.',
    category: 'Git',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    skills: ['git', 'large-projects', 'context'],
    objectives: [
      'Explain what a worktree is and why it helps parallel agent work',
      'Run two independent Claude sessions without file collisions',
      'Recognize when parallelism adds coordination cost instead of speed',
    ],
    prerequisites: ['l5-git-with-claude'],
    body: `
## The problem

You want Claude working on two things at once — say a refactor and a bug fix. Run two sessions in the same directory and their edits collide, tests interleave, and \`git status\` becomes chaos.

## Worktrees

\`git worktree\` checks out **multiple branches of one repository into separate directories** that share the same \`.git\` history.

\`\`\`bash
git worktree add ../shop-bugfix   fix/login-timeout
git worktree add ../shop-refactor  refactor/checkout
\`\`\`

Now run \`claude\` in each folder. Each session has its own files, its own branch, its own context — but they push to the same remote. When done: \`git worktree remove ../shop-bugfix\`.

Claude Code has first-class support: subagents can use \`isolation: worktree\`, the desktop app puts each parallel session in its own worktree, and \`/batch\` fans a migration across 5–30 subagents each in their own worktree opening their own PR.

## When parallelism pays

- Independent tasks that don't touch the same files.
- Large mechanical migrations (fan-out).
- A Writer session + a Reviewer session on a fresh context.

## When it doesn't

- Tasks that depend on each other's output — you'll spend more time merging and reconciling than you saved.
- Anything where you can't attend to both. Two unattended agents going wrong in parallel is worse than one.
- Small changes. The setup overhead dominates.

**Rule:** parallelize *independent* work. Serialize *dependent* work.
`,
    exercises: [
      {
        id: 'l5-e3',
        kind: 'reflection',
        title: 'Parallel or serial?',
        prompt:
          'For each pair, decide parallel or serial and why: (a) "add dark mode" + "fix a typo in the footer"; (b) "extract the auth module into a package" + "add a new login provider that imports the auth module"; (c) migrating 500 files from one test framework to another.',
        modelAnswer:
          '(a) Parallel — unrelated files. (b) Serial — the second task depends on the shape of the first; doing them in parallel guarantees a painful merge. (c) Parallel fan-out — mechanical, independent per-file work is the ideal case for /batch or a claude -p loop across worktrees.',
      },
    ],
    quiz: [
      {
        id: 'l5-q5',
        question: 'A git worktree lets you…',
        options: [
          'Have multiple branches checked out in separate directories sharing one .git history',
          'Compress the repository',
          'Undo commits',
          'Run tests faster',
        ],
        correctAnswer: 0,
        explanation: 'Separate working directories, shared history — so parallel sessions do not collide on files.',
        skills: ['git'],
      },
      {
        id: 'l5-q6',
        question: 'Which is the WORST candidate for parallel Claude sessions?',
        options: [
          'Two features in different, unrelated modules',
          'A refactor of module X and a new feature that will import the refactored module X',
          'A large per-file migration',
          'Writer session + Reviewer session',
        ],
        correctAnswer: 1,
        explanation: 'Dependent tasks in parallel create merge pain and rework. Serialize them.',
        skills: ['large-projects', 'git'],
      },
    ],
    resources: [
      { label: 'Run parallel sessions with worktrees', url: 'https://code.claude.com/docs/en/worktrees', official: true },
      { label: 'Run agents in parallel', url: 'https://code.claude.com/docs/en/agents', official: true },
    ],
    relatedLessons: ['l11-subagents', 'l17-large-projects', 'l19-software-team'],
  },

  // ======================================================================
  {
    id: 'l6-debugging-method',
    level: 6,
    order: 1,
    title: 'A Debugging Method You Can Repeat',
    tagline: 'Reproduce → evidence → hypothesis → isolate → fix the root cause → regression-test.',
    category: 'Debugging',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    skills: ['debugging', 'testing'],
    objectives: [
      'Run the six-step debugging loop with Claude',
      'Insist on root-cause fixes, not symptom suppression',
      'Use a failing test as the reproduction and the regression guard',
      'Escalate from syntax errors to concurrency bugs with the same method',
    ],
    prerequisites: ['l2-task-formula', 'l4-verification'],
    body: `
## The method

1. **Reproduce.** A bug you can't trigger on demand, you can't fix with confidence. *"Give me exact steps / a script / a failing test that reproduces this."*
2. **Gather evidence.** The full error and stack trace, relevant logs, the actual vs expected values, what changed recently (\`git log\`). Paste the *real* error, not a paraphrase.
3. **Hypothesize.** *"Given this trace, what are the 2–3 most likely causes, ranked?"* Resist the first plausible story.
4. **Isolate.** Narrow it: bisect the input, comment out half, add targeted logging, check the boundary between two modules. *"Add logging at the module boundary and tell me which side the bad value appears on."*
5. **Fix the root cause.** Not the symptom. If a value is \`undefined\` three layers deep, fix where it should have been set — don't sprinkle \`?.\` at the crash site. Tell Claude explicitly: *"address the root cause, don't suppress the error."*
6. **Regression-test.** Turn the reproduction into a permanent test. *"Add a test that fails without the fix and passes with it."* Then run the whole suite to check you didn't break something else.

## The bug difficulty ladder

| Level | Bug | What makes it hard | Method focus |
| --- | --- | --- | --- |
| 1 | Syntax error | Nothing — the tool tells you | Read the message |
| 2 | Runtime error (null, type) | Finding *where* the bad value originated | Isolate, trace backward |
| 3 | Incorrect state | No crash — output is just wrong | Compare actual vs expected at each step |
| 4 | API / integration failure | The bug is across a boundary | Inspect the actual request/response |
| 5 | Database bug | State persists between runs | Check queries, transactions, migrations, test isolation |
| 6 | Concurrency / race | Non-deterministic; won't reproduce reliably | Stress/loop it; reason about shared state and ordering |
| 7 | Production-only | Can't reproduce locally | Environment diff, real logs, feature flags, data shape |

The method is identical at every rung — only how hard you have to work at "reproduce" and "isolate" changes.

## Anti-patterns to name out loud

- **"It's probably X"** and jumping to a fix without confirming. Make Claude check.
- **Green by suppression** — wrapping in try/catch, loosening a type, adding a retry that hides the real failure.
- **Fixing the test instead of the code** when a test starts failing.
`,
    exercises: [
      {
        id: 'l6-e1',
        kind: 'order-steps',
        title: 'Order the debugging loop',
        prompt: 'Put the six steps in order.',
        items: ['Isolate / narrow', 'Reproduce reliably', 'Regression test', 'Gather evidence', 'Fix the root cause', 'Form ranked hypotheses'],
        correctOrder: [1, 3, 5, 0, 4, 2],
      },
      {
        id: 'l6-e2',
        kind: 'improve-prompt',
        title: 'A debugging prompt that forces rigor',
        prompt: 'Rewrite so Claude reproduces, finds root cause, and adds a regression test — no guessing, no suppression.',
        starter: 'the export button sometimes does nothing, fix it',
        modelAnswer:
          'The "Export CSV" button intermittently does nothing (no download, no error toast). Repro: click it repeatedly on the Reports page with a large date range. First, write a failing test or a script that reproduces the failure. Then investigate the root cause — do not add a retry or swallow errors to make it look fixed. Show me your evidence (logs/trace) and your ranked hypotheses before applying a fix. After fixing, keep the reproduction as a regression test and run the full suite.',
      },
      {
        id: 'l6-e3',
        kind: 'reflection',
        title: 'A time you fixed a symptom',
        prompt:
          'Recall a bug where the first fix just moved the problem. What was the actual root cause, and what evidence would have pointed there sooner?',
      },
    ],
    quiz: [
      {
        id: 'l6-q1',
        question: 'Why is "reproduce reliably" the first step and not "form a hypothesis"?',
        options: [
          'Hypotheses are a waste of time',
          'Without a reliable reproduction you cannot confirm a cause or verify a fix',
          'Claude cannot form hypotheses',
          'It is faster to guess',
        ],
        correctAnswer: 1,
        explanation: 'The reproduction is both your confirmation tool and your later regression test. Everything downstream depends on it.',
        skills: ['debugging'],
      },
      {
        id: 'l6-q2',
        question: 'A value is undefined three call-layers deep and crashes at the bottom. Root-cause fix?',
        options: [
          'Add optional chaining at the crash site',
          'Fix where the value should have been assigned/passed, so it is never undefined by the time it reaches the bottom',
          'Wrap the bottom function in try/catch',
          'Add a default value at the crash site only',
        ],
        correctAnswer: 1,
        explanation: 'Guarding the symptom leaves the real defect (a missing assignment/pass) in place to resurface elsewhere.',
        skills: ['debugging'],
      },
      {
        id: 'l6-q3',
        question: 'What changes as you go from a null-pointer bug to a race condition?',
        options: [
          'The debugging method changes completely',
          'The method stays the same; "reproduce" and "isolate" just take much more effort (stress loops, reasoning about ordering)',
          'You can no longer use tests',
          'You must switch languages',
        ],
        correctAnswer: 1,
        explanation: 'The six-step loop is invariant. Harder bugs just demand more work at reproduce/isolate.',
        skills: ['debugging'],
      },
      {
        id: 'l6-q4',
        question: 'A previously passing test now fails after your change. The test looks correct. You should…',
        options: [
          'Delete or weaken the test to get green',
          'Treat it as a real regression — your change broke documented behavior — and investigate',
          'Mark it as skipped',
          'Increase the timeout',
        ],
        correctAnswer: 1,
        explanation: 'A failing test on a correct assertion is the safety net working. Fixing the test to hide it defeats the purpose.',
        skills: ['debugging', 'testing'],
      },
    ],
    resources: [
      { label: 'Common workflows — fix a bug', url: 'https://code.claude.com/docs/en/common-workflows', official: true },
      { label: '/debug bundled skill', url: 'https://code.claude.com/docs/en/commands', official: true },
    ],
    relatedLessons: ['l6-hard-bugs', 'l7-testing', 'l4-verification'],
  },

  // ======================================================================
  {
    id: 'l6-hard-bugs',
    level: 6,
    order: 2,
    title: 'Hard Bugs: State, Integrations, Concurrency, Production',
    tagline: 'When "reproduce" is the whole battle.',
    category: 'Debugging',
    difficulty: 'advanced',
    estimatedMinutes: 16,
    skills: ['debugging', 'testing', 'codebase'],
    objectives: [
      'Build a minimal reproduction for a bug that only shows up in a big system',
      'Debug across an API boundary using the real request/response',
      'Approach non-deterministic and production-only bugs systematically',
    ],
    prerequisites: ['l6-debugging-method'],
    body: `
## Minimal reproductions

A bug buried in a 50k-line app is hard to reason about. Shrink it: *"Build the smallest standalone script that still triggers this, removing anything that doesn't change the outcome."* Often the act of minimizing *reveals* the cause — "oh, it only breaks when the array is empty."

## Bugs across a boundary (APIs, services)

Don't theorize about what the other side sends — **look**. *"Log the exact outbound request and the raw response for the failing call."* Then: is the request malformed? Is the response shape different from what the code assumes? Is it a 200 with an error body? A timeout? Auth expiry? The bug is almost always a mismatch between assumed and actual contract.

## Non-deterministic bugs (races, ordering)

- **Make it frequent.** *"Wrap this in a loop that runs it 1000 times and reports the failure rate."* A 1% bug at 1000x is now reproducible.
- **Reason about shared mutable state.** *"What state is shared between these two code paths, and what happens if they interleave at each await point?"*
- Look for: missing \`await\`, shared caches, non-atomic read-modify-write, order-dependent test pollution.

## Production-only bugs

Local works, prod doesn't. Systematic checklist:

1. **Environment diff** — runtime versions, env vars, feature flags, config.
2. **Data shape** — prod has nulls, huge rows, unicode, timezones your fixtures don't.
3. **Scale** — connection pool exhaustion, timeouts, memory limits that only bite under load.
4. **Real logs / traces** — get the actual production error, not a reconstruction. Feed it to Claude.
5. **Reproduce with prod-like conditions** — seed a local DB with anonymized prod data, set the same env, replay the request.

## The discipline that carries over

Every hard bug still ends the same way: **a test that reproduces it, a root-cause fix, a green full suite.** If you can't write the reproducing test, you don't yet understand the bug well enough to fix it.
`,
    exercises: [
      {
        id: 'l6-e4',
        kind: 'checklist',
        title: 'Production-only bug checklist',
        prompt: 'Your systematic pass when local is fine but prod is broken.',
        items: [
          'Diff runtime versions, env vars, feature flags, config',
          'Check for data the fixtures lack: nulls, huge values, unicode, timezones',
          'Consider scale: pools, timeouts, memory under load',
          'Get the real production log / stack trace, not a reconstruction',
          'Reproduce locally with prod-like data and env',
          'Write the reproducing test before fixing',
        ],
      },
      {
        id: 'l6-e5',
        kind: 'reflection',
        title: 'Minimizing reveals the cause',
        prompt:
          'Explain why the act of building a minimal reproduction often surfaces the root cause on its own, before you have done any real "debugging."',
        modelAnswer:
          'Minimizing is a binary search over the code and data: each piece you remove without changing the outcome is proven irrelevant, and each piece you can\'t remove is implicated. When the reproduction is small enough, the remaining moving parts are few enough to see the causal link directly.',
      },
    ],
    quiz: [
      {
        id: 'l6-q5',
        question: 'Best first move for a bug that only appears across an API call to another service?',
        options: [
          'Guess at what the other service returns and code defensively',
          'Log the exact outbound request and the raw response, then compare to what the code assumes',
          'Add a retry',
          'Increase the timeout',
        ],
        correctAnswer: 1,
        explanation: 'Cross-boundary bugs are contract mismatches. Look at the real bytes instead of theorizing.',
        skills: ['debugging'],
      },
      {
        id: 'l6-q6',
        question: 'A test suite passes when run alone but one test fails when the whole suite runs. Most likely?',
        options: [
          'A compiler bug',
          'Order-dependent state pollution — a earlier test leaves shared state (DB rows, globals, mocks) that breaks a later one',
          'The CI machine is slow',
          'The test is simply wrong',
        ],
        correctAnswer: 1,
        explanation: 'Shared, un-reset state between tests is the classic cause of "passes alone, fails together."',
        skills: ['testing', 'debugging'],
      },
      {
        id: 'l6-q7',
        question: 'You cannot write a test that reproduces a bug. What does that tell you?',
        options: [
          'The bug does not exist',
          'You do not yet understand the bug well enough to fix it reliably',
          'Tests are not useful here',
          'You should fix it in production directly',
        ],
        correctAnswer: 1,
        explanation: 'The reproducing test is the proof of understanding. No repro = keep investigating.',
        skills: ['debugging', 'testing'],
      },
    ],
    resources: [
      { label: 'Troubleshooting', url: 'https://code.claude.com/docs/en/troubleshooting', official: true },
      { label: 'Chrome — debug live web apps', url: 'https://code.claude.com/docs/en/chrome', official: true },
    ],
    relatedLessons: ['l6-debugging-method', 'l7-testing', 'l16-security'],
  },

  // ======================================================================
  {
    id: 'l7-testing',
    level: 7,
    order: 1,
    title: 'Testing: Evidence That the Fix Actually Works',
    tagline: 'Ask: "what evidence would prove this fix is correct?" Then build that evidence.',
    category: 'Testing',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    skills: ['testing', 'building', 'debugging'],
    objectives: [
      'Distinguish unit, integration, and end-to-end tests and when each earns its cost',
      'Run test-driven development with Claude (write the failing test first)',
      'Use mocks and fixtures deliberately, not reflexively',
      'Read coverage as a guide, not a goal',
    ],
    prerequisites: ['l4-verification', 'l6-debugging-method'],
    body: `
## The three levels

| Type | Tests | Fast? | Use for |
| --- | --- | --- | --- |
| **Unit** | One function/module in isolation | Very | Pure logic, edge cases, algorithms |
| **Integration** | Several units together (e.g. handler + DB) | Medium | Wiring, queries, contracts between modules |
| **End-to-end (e2e)** | The whole system as a user hits it | Slow | Critical user journeys only |

A healthy suite is mostly unit, some integration, a few e2e. Ask Claude to respect that shape: *"cover this with unit tests; add one integration test for the DB path; no e2e for this."*

## TDD with Claude

For anything with tricky logic or a bug fix, **write the test first**:

> Before implementing, write tests for \`parseDateRange\`: valid range, reversed range (should swap), open-ended range, invalid string (should throw). Run them — they should fail. Then implement until they pass.

This forces a spec, gives Claude an unambiguous target, and leaves you a regression guard. It also stops Claude from writing code and *then* writing tests that just assert whatever the code happens to do.

## Mocks and fixtures — deliberately

- **Mock** external, slow, or non-deterministic things (network, time, randomness, payment APIs).
- **Don't mock** the thing you're actually testing, or so much that the test proves nothing. "Avoid mocks" is often the right instruction for logic tests.
- **Fixtures** should look like real data — including the nasty cases (nulls, empty, huge, unicode).

## Edge cases are the point

The happy path rarely breaks. Prompt for the edges explicitly: empty, one, many; null/undefined; boundary values; concurrent access; wrong types; the operation running twice.

## Coverage

Coverage tells you what code *ran* during tests — not whether the assertions are meaningful. 100% coverage with weak assertions is worse than 70% with sharp ones. Use it to find *untested* areas, then judge whether they matter. Don't let "raise coverage to X%" become the task.

## The question to always ask

*"What evidence would prove this actually works?"* Sometimes it's a unit test. Sometimes an integration test with a real database. Sometimes a screenshot diff. Name the evidence, then have Claude produce it.
`,
    exercises: [
      {
        id: 'l7-e1',
        kind: 'improve-prompt',
        title: 'TDD a small function',
        prompt: 'Rewrite as a test-first request with explicit edge cases.',
        starter: 'write a function to slugify titles',
        modelAnswer:
          'Before implementing slugify(title: string): string, write unit tests covering: normal title -> "my-title"; leading/trailing spaces; multiple spaces collapse to one dash; punctuation removed; accented characters transliterated or stripped; empty string -> ""; already-a-slug unchanged; very long title truncated to 80 chars. Run them (they should fail), then implement until green. No mocks needed.',
      },
      {
        id: 'l7-e2',
        kind: 'reflection',
        title: 'When is an e2e test worth it?',
        prompt:
          'e2e tests are slow and flaky. Describe a feature where an e2e test is clearly worth that cost, and one where it clearly is not. What is the deciding factor?',
        modelAnswer:
          'Worth it: the checkout/payment flow — many integrated pieces, high cost of silent breakage, hard to cover any other way. Not worth it: validating a single form field\'s error message — a unit or component test covers it faster and more reliably. Deciding factor: the blast radius of the path breaking versus the cheapest test that would actually catch that break.',
      },
    ],
    quiz: [
      {
        id: 'l7-q1',
        question: 'The main reason to write the failing test before the fix is…',
        options: [
          'It is required by most frameworks',
          'It forces a precise spec, gives Claude an unambiguous target, and leaves a regression guard — and prevents tests that merely assert whatever the code does',
          'It is faster',
          'It improves coverage numbers',
        ],
        correctAnswer: 1,
        explanation: 'Test-first turns intent into an executable target and avoids circular "test asserts the implementation" tests.',
        skills: ['testing'],
      },
      {
        id: 'l7-q2',
        question: '90% line coverage but bugs keep shipping. Most likely problem?',
        options: [
          'Not enough coverage — push for 100%',
          'The tests execute the code but their assertions are weak or missing meaningful checks',
          'The language is untyped',
          'Tests run too fast',
        ],
        correctAnswer: 1,
        explanation: 'Coverage measures execution, not assertion quality. Sharpen what the tests actually verify.',
        skills: ['testing'],
      },
      {
        id: 'l7-q3',
        question: 'Which is a BAD use of mocking?',
        options: [
          'Mocking a third-party payment API in a unit test',
          'Mocking the system clock to test time-based logic',
          'Mocking the exact function under test so the test passes trivially',
          'Mocking a slow network call',
        ],
        correctAnswer: 2,
        explanation: 'Mocking the thing you are testing makes the test meaningless. Mock the dependencies around it, not it.',
        skills: ['testing'],
      },
      {
        id: 'l7-q4',
        question: 'Healthiest overall test suite shape?',
        options: [
          'Mostly e2e, a few unit',
          'Mostly unit, some integration, a few e2e on critical journeys',
          'Only integration',
          'Equal thirds always',
        ],
        correctAnswer: 1,
        explanation: 'The pyramid: many fast focused unit tests, fewer integration tests, a handful of slow e2e tests where they matter most.',
        skills: ['testing'],
      },
    ],
    resources: [
      { label: 'Common workflows — testing', url: 'https://code.claude.com/docs/en/common-workflows', official: true },
      { label: 'Best practices — provide verification criteria', url: 'https://code.claude.com/docs/en/best-practices', official: true },
    ],
    relatedLessons: ['l4-verification', 'l6-debugging-method', 'l20-autonomous-dev'],
  },
];
