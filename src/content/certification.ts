import type { CertPart } from './types';

// Final certification exam. Judgment over trivia. Draws on every level.
export const CERT_PARTS: CertPart[] = [
  {
    id: 'cert-1',
    title: 'Part 1 — Foundations (multiple choice)',
    description: 'The mental model: agents, the loop, surfaces, responsibility.',
    questions: [
      { id: 'c1q1', question: 'The defining property of an agentic coding tool is that it…', options: ['Uses the largest model', 'Reads, plans, acts on the environment, and observes results in a loop', 'Only runs in the terminal', 'Never needs permission'], correctAnswer: 1, explanation: 'The agent loop — acting and observing — is what separates it from a chat assistant.' },
      { id: 'c1q2', question: 'Across terminal, IDE, desktop, and web, what stays consistent?', options: ['Nothing', 'CLAUDE.md, settings, and MCP servers — one shared engine', 'Only your password', 'Only the model'], correctAnswer: 1, explanation: 'All surfaces connect to the same engine.' },
      { id: 'c1q3', question: 'Who is responsible for the safety of proposed code and commands?', options: ['Anthropic', 'The model', 'You', 'CI'], correctAnswer: 2, explanation: 'Claude Code has only the permissions you grant; review is your responsibility.' },
      { id: 'c1q4', question: 'In Manual mode, which runs without asking?', options: ['git commit', 'git status', 'npm install', 'curl'], correctAnswer: 1, explanation: 'A fixed set of read-only commands run without prompts.' },
    ],
  },
  {
    id: 'cert-2',
    title: 'Part 2 — Prompt engineering',
    description: 'Turning intent into something an agent can execute and verify.',
    questions: [
      { id: 'c2q1', question: 'The five parts of the Task Formula are goal, context, constraints, expected result, and…', options: ['deadline', 'verification', 'budget', 'model'], correctAnswer: 1, explanation: 'A check Claude can run closes the loop.' },
      { id: 'c2q2', question: 'The highest-leverage element to add to a prompt for unattended work is…', options: ['Politeness', 'A verification step', 'A longer description', 'The model name'], correctAnswer: 1, explanation: 'Verification converts a babysat session into a self-correcting one.' },
      { id: 'c2q3', question: 'A vague prompt is genuinely appropriate when…', options: ['You are in CI', 'You are exploring an approach and want to see Claude\'s framing before constraining it', 'The task is security-sensitive', 'Always'], correctAnswer: 1, explanation: 'Open prompts surface options; switch to precise once you know what you want.' },
      { id: 'c2q4', question: 'Better than "why is this API weird?" is…', options: ['"rewrite the API"', '"read the git history of this module and summarize how the API evolved"', '"is it weird, yes or no"', 'nothing'], correctAnswer: 1, explanation: 'Point Claude at the source that can answer instead of asking it to speculate.' },
    ],
  },
  {
    id: 'cert-3',
    title: 'Part 3 — Debugging',
    description: 'A repeatable method from syntax errors to production-only bugs.',
    questions: [
      { id: 'c3q1', question: 'First step of the debugging method?', options: ['Form a hypothesis', 'Reproduce reliably', 'Apply a fix', 'Add logging'], correctAnswer: 1, explanation: 'The reproduction is your confirmation tool and later regression test.' },
      { id: 'c3q2', question: 'A value is undefined three layers deep. Root-cause fix?', options: ['Optional chaining at the crash site', 'Fix where it should have been assigned/passed', 'try/catch at the bottom', 'Default at the crash site'], correctAnswer: 1, explanation: 'Guarding the symptom leaves the real defect to resurface.' },
      { id: 'c3q3', question: 'Tests pass alone but one fails when the whole suite runs. Most likely?', options: ['Compiler bug', 'Order-dependent shared-state pollution', 'Slow CI', 'The test is wrong'], correctAnswer: 1, explanation: 'Un-reset shared state between tests is the classic cause.' },
      { id: 'c3q4', question: 'You cannot write a test that reproduces the bug. This means…', options: ['The bug is not real', 'You do not yet understand it well enough to fix it reliably', 'Tests are useless here', 'Fix it in prod'], correctAnswer: 1, explanation: 'The reproducing test is the proof of understanding.' },
    ],
  },
  {
    id: 'cert-4',
    title: 'Part 4 — Git',
    description: 'Safe change management and reviewing agent-generated diffs.',
    questions: [
      { id: 'c4q1', question: 'Why branch before a big Claude task instead of relying on checkpoints?', options: ['Checkpoints cost money', 'Checkpoints only track edit-tool changes, not Bash; a branch is real containment', 'Branches are faster', 'Checkpoints do not work on Windows'], correctAnswer: 1, explanation: 'Checkpoints are convenient in-session undo, explicitly not a Git substitute.' },
      { id: 'c4q2', question: 'Claude changed 14 files. First move?', options: ['Commit all with a generic message', 'Get a grouped summary, read the diff, run tests, flag unrelated churn', 'Push to main', 'Delete the branch'], correctAnswer: 1, explanation: 'Review before you trust; then split into coherent commits.' },
      { id: 'c4q3', question: 'A good commit message primarily conveys…', options: ['What files changed', 'Why the change was made', 'Who made it', 'How long it took'], correctAnswer: 1, explanation: 'The diff shows what; the message should capture intent.' },
      { id: 'c4q4', question: 'You see a .env file in the proposed diff. Correct reaction?', options: ['Commit it', 'Remove it from the change, ensure it is gitignored, check history', 'Rename and commit', 'Ignore it'], correctAnswer: 1, explanation: '.env holds secrets and must never be committed.' },
    ],
  },
  {
    id: 'cert-5',
    title: 'Part 5 — Architecture',
    description: 'Using Claude as a design partner and recording decisions.',
    questions: [
      { id: 'c5q1', question: 'Point of asking Claude to argue both sides before recommending?', options: ['Waste time', 'Surface the assumptions behind each option so the recommendation is inspectable', 'Get a longer answer', 'It cannot recommend otherwise'], correctAnswer: 1, explanation: 'Explicit trade-offs plus "what would change my mind" make the reasoning auditable.' },
      { id: 'c5q2', question: 'An ADR exists primarily to…', options: ['Satisfy auditors', 'Let future readers understand why a decision was made and when to revisit it', 'Increase docs coverage', 'Assign blame'], correctAnswer: 1, explanation: 'Captured context + consequences + revisit trigger.' },
      { id: 'c5q3', question: 'Which stays firmly with the human?', options: ['Enumerating options', 'Building the trade-off table', 'Owning the consequences and making the final call', 'Drafting the ADR'], correctAnswer: 2, explanation: 'Claude informs the decision; it does not live with the outcome.' },
      { id: 'c5q4', question: 'A good spec ends with…', options: ['A cost estimate', 'An end-to-end verification step', 'A list of every feature', 'A UML diagram'], correctAnswer: 1, explanation: 'Precise scope and a "how we prove it works" step matter most.' },
    ],
  },
  {
    id: 'cert-6',
    title: 'Part 6 — Security',
    description: 'Permissions, secrets, untrusted code, prompt injection.',
    questions: [
      { id: 'c6q1', question: 'bypassPermissions mode is acceptable…', options: ['Whenever prompts annoy you', 'Only in an isolated throwaway sandbox with nothing to lose', 'On personal projects', 'In CI on main'], correctAnswer: 1, explanation: 'No prompts = no gate on destructive or exfiltrating commands.' },
      { id: 'c6q2', question: 'Safest first step with a freshly cloned unknown repo?', options: ['Run its setup script', 'Inspect scripts/hooks/.mcp.json read-only in an isolated env before running anything', 'npm install to test', 'Push to your GitHub'], correctAnswer: 1, explanation: 'Inspect before any code executes, ideally in a VM/container.' },
      { id: 'c6q3', question: 'Mid-task, Claude wants to read ~/.aws/credentials and POST it somewhere. This is…', options: ['Normal', 'A red flag — likely prompt injection; stop and investigate', 'Fine if you trust the repo', 'A bug to ignore'], correctAnswer: 1, explanation: 'An unrelated credential-exfiltration action is a classic injection payload.' },
      { id: 'c6q4', question: 'You pasted a live API key into a session then deleted the message. Sufficient?', options: ['Yes', 'No — rotate the key; the conversation is stored', 'Yes if you /clear', 'Only if it was an admin key'], correctAnswer: 1, explanation: 'Treat any exposed secret as compromised.' },
    ],
  },
  {
    id: 'cert-7',
    title: 'Part 7 — Agents & subagents',
    description: 'Delegation that protects context; when not to delegate.',
    questions: [
      { id: 'c7q1', question: 'Primary reason to use a subagent for investigation?', options: ['Subagents are smarter', 'Reading happens in their context; yours stays clean and gets a summary', 'Always cheaper', 'They bypass permissions'], correctAnswer: 1, explanation: 'Context isolation is the point.' },
      { id: 'c7q2', question: 'A regular (non-fork) subagent has access to…', options: ['Your whole conversation', 'Only the task brief — it starts fresh', 'Your auto memory and open files', 'Nothing'], correctAnswer: 1, explanation: 'Only a fork inherits parent context.' },
      { id: 'c7q3', question: 'Worst fit for a subagent?', options: ['Scanning a module for a pattern', 'Reviewing a big diff', 'A task needing many rounds of back-and-forth with you', 'Summarizing a long test log'], correctAnswer: 2, explanation: 'Tight iteration means constant re-briefing.' },
      { id: 'c7q4', question: 'A reviewer subagent reports 11 issues on a small correct change. You should…', options: ['Fix all 11', 'Triage to correctness/requirements; treat the rest as optional', 'Ignore the review', 'Rewrite everything'], correctAnswer: 1, explanation: 'Adversarial reviewers over-report by design; chasing all findings causes over-engineering.' },
    ],
  },
  {
    id: 'cert-8',
    title: 'Part 8 — MCP',
    description: 'Connecting external systems and reasoning about the risk.',
    questions: [
      { id: 'c8q1', question: 'Claude Code is the ___; your Notion/DB/GitHub integration is the ___.', options: ['server / client', 'client / server', 'host / tool', 'both servers'], correctAnswer: 1, explanation: 'Client talks to servers that expose tools/resources/prompts.' },
      { id: 'c8q2', question: 'A project-scoped server in a cloned repo…', options: ['Connects silently', 'Requires approval on first use', 'Is ignored', 'Needs admin'], correctAnswer: 1, explanation: 'Trust-on-first-use guards against server definitions committed by others.' },
      { id: 'c8q3', question: 'Best practice for DB credentials given to an MCP server?', options: ['Full admin', 'Least-privilege, typically read-only, scoped to the needed schema', 'Your personal login', 'No auth'], correctAnswer: 1, explanation: 'Least privilege limits blast radius.' },
      { id: 'c8q4', question: 'Does Anthropic security-audit the MCP servers you connect?', options: ['Yes, all', 'No — it reviews directory connectors against listing criteria but does not audit servers; trust is yours', 'Only paid ones', 'Only on Enterprise'], correctAnswer: 1, explanation: 'Vet servers yourself; write your own or use trusted providers.' },
    ],
  },
  {
    id: 'cert-9',
    title: 'Part 9 — Context, CLAUDE.md, hooks, skills',
    description: 'Keeping the window productive and the setup maintainable.',
    questions: [
      { id: 'c9q1', question: 'Why does context management underlie most best practices?', options: ['It saves money', 'Model performance degrades as the window fills — pollution directly causes mistakes', 'It is required for subagents', 'It speeds streaming'], correctAnswer: 1, explanation: 'The degradation-with-fullness fact is the root cause.' },
      { id: 'c9q2', question: '/clear vs /compact?', options: ['Identical', '/clear wipes context (unrelated task); /compact summarizes while keeping key state (long single task)', '/compact deletes files', '/clear works once'], correctAnswer: 1, explanation: 'Task switch vs running low on one task.' },
      { id: 'c9q3', question: 'The test for a CLAUDE.md line:', options: ['"Is it true?"', '"Would removing it cause Claude to make a mistake?"', '"Is it well written?"', '"Did /init add it?"'], correctAnswer: 1, explanation: 'Derivable filler dilutes the rules that matter.' },
      { id: 'c9q4', question: '"Run the formatter after every edit, no exceptions" belongs in…', options: ['CLAUDE.md', 'A PostToolUse hook', 'A code comment', 'The README'], correctAnswer: 1, explanation: 'Guarantees are hooks; advice is CLAUDE.md.' },
    ],
  },
  {
    id: 'cert-10',
    title: 'Part 10 — Autonomous development & methodology',
    description: 'The final judgment check. Trust is designed, not assumed.',
    questions: [
      { id: 'c10q1', question: '"AUTONOMY ≠ BLIND TRUST" means…', options: ['Never work unattended', 'Autonomy is earned by a loop where every step emits a verifiable signal, with human gates before irreversible actions', 'Only trust on weekends', 'Use a bigger model'], correctAnswer: 1, explanation: 'The control loop and gates create trust.' },
      { id: 'c10q2', question: 'A task with no automated correctness check, delegated unattended, means…', options: ['Maximum time saved', 'You have only deferred the review — colder and later', 'Claude verifies it somehow', 'Fine if small'], correctAnswer: 1, explanation: 'No check = you are still the verification loop.' },
      { id: 'c10q3', question: 'Which must stay behind a human gate regardless of loop quality?', options: ['Running tests', 'Editing a file', 'Deploying to production / migrating real data', 'Reading files'], correctAnswer: 2, explanation: 'Irreversible / externally visible / money- or data-affecting actions.' },
      { id: 'c10q4', question: 'Strongest setup for a mostly-unattended run?', options: ['Vague prompt + hope', 'Written plan with a verification step + /goal or Stop-hook gating + fresh-context review subagent + human gate before merge/deploy', 'bypassPermissions on main', 'Bigger model only'], correctAnswer: 1, explanation: 'Layered: machine verification, independent review, human gate.' },
      { id: 'c10q5', question: 'Best signal you have truly learned Claude Code?', options: ['Highest XP', 'The "What Would You Do?" scenarios feel obvious and you can answer the reflection questions for your own work without hesitating', 'You memorized every command', 'You finished fastest'], correctAnswer: 1, explanation: 'Fluent judgment, not recall.' },
    ],
  },
];

export const CERT_TOTAL_QUESTIONS = CERT_PARTS.reduce((n, p) => n + p.questions.length, 0);
export const CERT_PASS_THRESHOLD = 0.8;
