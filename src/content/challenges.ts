import type { Challenge } from './types';

export const CHALLENGES: Challenge[] = [
  // ---------------- Daily pool ----------------
  {
    id: 'ch-improve-prompt', pool: 'daily', difficulty: 'beginner', skills: ['prompting'],
    title: 'Improve a weak prompt',
    scenario: 'A colleague sends Claude Code: "the app is slow, speed it up".',
    objective: 'Rewrite it so Claude can act precisely and verify its own work.',
    instructions: [
      'Identify what "slow" means concretely (which page/flow, how slow, target)',
      'Name the files/area to look at and the constraints (no new deps, no backend change, etc.)',
      'State the expected result and an explicit verification step',
    ],
    hints: ['Use the Task Formula: goal + context + constraints + expected result + verification', 'A before/after measurement is a great verification'],
    solutionStrategy:
      'A strong rewrite: "The Reports page takes ~4s to first render (Performance panel). Target under 1.5s. It runs 6 sequential fetches in a useEffect in src/pages/Reports.tsx. Parallelize independent ones, add a skeleton, memoize the chart. No backend or dependency changes. Record before/after load time and paste both; run npm test src/pages."',
    reflectionQuestions: ['Which part did the original prompt omit that would have caused the most rework?', 'How would you verify if you had not watched the session?'],
  },
  {
    id: 'ch-find-bug', pool: 'daily', difficulty: 'intermediate', skills: ['debugging'],
    title: 'Design a debugging plan',
    scenario: '"The CSV export button intermittently does nothing — no download, no error."',
    objective: 'Write the sequence of prompts that would get to a root-cause fix with a regression test.',
    instructions: ['Start with reproduction', 'Force ranked hypotheses and evidence before any fix', 'Forbid symptom suppression', 'End with a regression test and full-suite run'],
    hints: ['"Intermittent" means the reproduction step needs stress/repetition', 'A retry that "fixes" it is a red flag'],
    solutionStrategy:
      '1) "Write a script or failing test that reproduces this by clicking export repeatedly on a large date range." 2) "Show me the logs/trace and rank the 2-3 most likely causes; confirm before fixing." 3) "Fix the root cause — no retry, no swallowed errors." 4) "Keep the repro as a regression test; run the full suite."',
    reflectionQuestions: ['What class of bug is "intermittent + no error" usually?', 'How do you know the fix worked?'],
  },
  {
    id: 'ch-design-claude-md', pool: 'daily', difficulty: 'intermediate', skills: ['claude-md'],
    title: 'Draft a CLAUDE.md for a messy project',
    scenario: 'A repo with no CLAUDE.md: unusual test command, a generated folder that must not be edited, PowerShell-only devs, Conventional Commits.',
    objective: 'Write a CLAUDE.md under 25 lines that would actually change Claude\'s behavior.',
    instructions: ['Include only non-derivable facts', 'Commands Claude cannot guess', 'Real gotchas', 'Repo etiquette', 'Then cut two more lines'],
    hints: ['Ask of every line: "would removing this cause a mistake?"', 'A "never edit src/generated/" line prevents real damage'],
    solutionStrategy:
      'Sections: Commands (the real test/build/run commands), Conventions (PowerShell — no && chaining; Conventional Commits; feature branches), Gotchas (never edit src/generated/ — built from the OpenAPI spec; tests need Postgres on :5433). Nothing about "what folders contain what".',
    reflectionQuestions: ['Which lines were tempting to add but derivable?', 'What would you move to a path-scoped rule instead?'],
  },
  {
    id: 'ch-safest-workflow', pool: 'daily', difficulty: 'beginner', skills: ['security', 'git'],
    title: 'Choose the safest workflow',
    scenario: 'You need Claude to apply a risky change to authentication middleware used everywhere.',
    objective: 'Describe the workflow from start to merge that minimizes blast radius.',
    instructions: ['Pick a permission mode', 'Decide branch/worktree strategy', 'Define the verification', 'Place the human gate'],
    hints: ['Auth changes always need human review before merge', 'Plan mode first if you are unsure of the approach'],
    solutionStrategy:
      'Feature branch. Plan mode to understand every caller. Characterization tests for current auth behavior first. Implement behind the existing interface. /security-review + a fresh-context /code-review on the diff. Full suite + /verify. Human approval gate before merge; deploy behind a flag.',
    reflectionQuestions: ['Where is the risk concentrated?', 'What is the rollback plan?'],
  },
  {
    id: 'ch-review-diff', pool: 'daily', difficulty: 'intermediate', skills: ['git'],
    title: 'Review a Claude-generated diff',
    scenario: 'Claude changed 9 files for "add a users search endpoint". You see: the endpoint + tests (4 files), a shared util (1), reformatting in 3 unrelated files, and a new dependency "fuzzysearch".',
    objective: 'Decide what to commit, what to question, what to revert.',
    instructions: ['Group by purpose', 'Identify unrelated churn', 'Vet the new dependency', 'Plan the commits'],
    hints: ['Unrelated reformatting hides the real change', 'A new dependency is new code from a stranger'],
    solutionStrategy:
      'Commit the endpoint + tests + util as 1-2 coherent commits. Revert the 3 unrelated reformats. Question "fuzzysearch": is it necessary, maintained, not a typosquat, acceptable license? If a small in-repo function would do, prefer that. Then open the PR.',
    reflectionQuestions: ['Why not just accept the reformatting as a bonus improvement?', 'What would you add to CLAUDE.md to prevent the unrelated churn next time?'],
  },
  {
    id: 'ch-agent-workflow', pool: 'daily', difficulty: 'advanced', skills: ['subagents', 'teamwork'],
    title: 'Design an agent workflow',
    scenario: 'Feature: add SSO login. You want architecture, implementation, tests, security review, and docs.',
    objective: 'Assign roles to sessions/subagents and define the artifact each hands to the next.',
    instructions: ['List the roles', 'For each: mechanism (main session / subagent / fresh session) and output artifact', 'Mark where you deliberately use fresh context and why'],
    hints: ['The reviewer should see only the diff + spec', 'The architect should not be anchored on an implementation'],
    solutionStrategy:
      'PM (interview → SPEC.md) → Architect fresh (→ ADR: protocol, session model) → Developer (→ diff + tests) → test-writer subagent (adversarial auth tests) → security-reviewer subagent (token handling, redirect validation, session fixation) → code-reviewer fresh (diff vs SPEC) → DevOps fresh (callback URLs, env, rollback) → doc-writer subagent.',
    reflectionQuestions: ['Where would a single-session approach have hidden a bug?', 'Which role is easiest to skip for a smaller feature?'],
  },
  {
    id: 'ch-security-risk', pool: 'daily', difficulty: 'intermediate', skills: ['security'],
    title: 'Identify the security risk',
    scenario: 'Claude, while "improving logging", proposes: add a log line that prints the full request including the Authorization header, and add a debug endpoint /debug/env that returns process.env.',
    objective: 'Name every risk and what you would do.',
    instructions: ['Assess each proposed change', 'Decide approve / modify / reject', 'Explain the exposure'],
    hints: ['Logs get shipped to third-party aggregators', 'Anything returning env is a secret-exfiltration endpoint'],
    solutionStrategy:
      'Reject both. Logging auth headers leaks credentials into log storage (often third-party, long-retained). /debug/env exposes every secret to anyone who finds the route. Ask for redacted logging (mask tokens) and no env-dumping endpoint. If debugging config, use a gated, non-secret-returning health check.',
    reflectionQuestions: ['Why is "it is only in dev" not a sufficient defense?', 'How would a hook prevent this class of change?'],
  },
  {
    id: 'ch-plan-refactor', pool: 'daily', difficulty: 'advanced', skills: ['large-projects', 'architecture'],
    title: 'Plan a refactor without breaking prod',
    scenario: 'A 900-line "God" service class handles orders, payments, notifications, and inventory. No tests.',
    objective: 'Produce a first increment that is small, safe, reversible, and verifiable.',
    instructions: ['Characterize current behavior first', 'Pick ONE responsibility to extract', 'Keep the public interface stable', 'Define the check'],
    hints: ['Branch by abstraction', 'Contract tests at the seam you introduce'],
    solutionStrategy:
      'Write characterization tests for the notifications path (smallest, most isolated). Extract a NotificationSender behind an interface the God class calls; God class delegates, callers unchanged. Contract tests prove identical behavior. Ship. Next increment: inventory. One responsibility per PR.',
    reflectionQuestions: ['Why notifications first and not payments?', 'What signals it is safe to proceed to the next increment?'],
  },

  // ---------------- Weekly pool ----------------
  {
    id: 'ch-week-inherit', pool: 'weekly', difficulty: 'advanced', skills: ['codebase', 'context', 'subagents'],
    title: 'The 50,000-line inheritance',
    scenario: 'You have been handed a large unfamiliar application and told "own it". You may not modify anything yet.',
    objective: 'Produce a written architecture map and a prioritized risk register in one focused session budget.',
    instructions: [
      'Get stack, entry points, and build/run/test commands from config only',
      'Map module boundaries and request flow',
      'Trace ONE real feature end to end, file by file',
      'Use subagents to investigate 3 subsystems in parallel',
      'Identify most-imported modules and most-churned files from git',
      'Write docs/architecture-notes.md and docs/risk-register.md',
    ],
    hints: ['Do not let one "explain everything" prompt read the whole tree', 'The end-to-end trace teaches you the conventions'],
    solutionStrategy:
      'Scope every prompt. Delegate the reading-heavy subsystem investigations to subagents so your main context holds only the synthesis. End with two artifacts so the next session starts from the map.',
    reflectionQuestions: ['What did you learn from the single feature trace that a module list would not have told you?', 'Where is the risk concentrated, and how do you know?'],
  },
  {
    id: 'ch-week-modernize', pool: 'weekly', difficulty: 'expert', skills: ['large-projects', 'testing', 'git', 'autonomy'],
    title: 'Modernize a legacy app without breaking production',
    scenario: 'A legacy app on an outdated framework, minimal tests, active users. Migrate it incrementally.',
    objective: 'Execute two safe increments end to end, each independently deployable and reversible.',
    instructions: [
      'Build the architecture map and risk register first',
      'Choose a migration pattern (strangler fig / branch by abstraction / expand-contract)',
      'Increment 1: characterize, change one thing behind a flag, contract tests, ship',
      'Increment 2: the next thing; one increment per PR',
      'Set up CI gates: full suite, typecheck, /security-review on the diff',
    ],
    hints: ['Feature flags turn a bad increment into a toggle', 'One increment per session; /clear between them'],
    solutionStrategy:
      'Never big-bang. Each increment: capture current behavior, wrap old with new behind an interface or flag, prove equivalence with contract tests, ship, then repeat. Context discipline is what makes it sustainable.',
    reflectionQuestions: ['What would you do if increment 2 revealed increment 1 was subtly wrong?', 'How do you decide increment size?'],
  },
  {
    id: 'ch-week-team', pool: 'weekly', difficulty: 'expert', skills: ['teamwork', 'subagents', 'autonomy'],
    title: 'Ship a feature as a software team',
    scenario: 'Build a real feature (your choice) using the full role roster from Level 19.',
    objective: 'Run PM → Architect → Developer → Test → Security → Review → DevOps → Writer with artifact hand-offs.',
    instructions: [
      'Each role produces a named artifact the next consumes',
      'Start the architect and the reviewers in fresh context',
      'The reviewer sees only the diff + SPEC',
      'End with a human approval gate before merge',
    ],
    hints: ['Scale the roster to the feature — do not run all 8 for a trivial change', 'Cross-session messaging or the desktop app can help coordinate'],
    solutionStrategy: 'The hand-offs are the skill. Written artifacts keep each role\'s context clean and survive compaction. Fresh context is what makes reviews honest.',
    reflectionQuestions: ['Which role caught something the others missed?', 'Where did fresh context clearly help?'],
  },

  // ---------------- Library pool ----------------
  {
    id: 'ch-lib-mcp', pool: 'library', difficulty: 'advanced', skills: ['mcp', 'security'],
    title: 'Connect a database safely via MCP',
    scenario: 'Give Claude read access to analytics data in Postgres and prove it cannot write.',
    objective: 'Set up the server with least privilege and verify the boundary.',
    instructions: ['Choose transport and scope', 'Create a read-only DB role scoped to the analytics schema', 'Put the DSN in an env var', 'Ask Claude to attempt an UPDATE and confirm the database refuses it'],
    hints: ['The database, not Claude, should enforce read-only', 'stdio + local scope for a personal setup'],
    solutionStrategy:
      'claude mcp add --transport stdio db -- npx -y <db-mcp> --dsn "$ANALYTICS_DSN" where the role has SELECT only. Verification: the UPDATE is rejected by Postgres with a permissions error, not merely declined by Claude.',
    reflectionQuestions: ['Why is "Claude said it would not" insufficient?', 'What else would you deny access to?'],
  },
  {
    id: 'ch-lib-hook', pool: 'library', difficulty: 'advanced', skills: ['hooks', 'testing'],
    title: 'Build a test-gate Stop hook',
    scenario: 'You want turns to be unable to finish while the test suite is red.',
    objective: 'Write the settings.json entry and the script.',
    instructions: ['Stop event', 'Run the suite', 'Exit 2 with an actionable message while failing', 'Exit 0 when green'],
    hints: ['Claude Code overrides the hook after ~8 consecutive blocks', 'Make the failure output tell Claude what to fix'],
    solutionStrategy:
      '"hooks": { "Stop": [ { "hooks": [ { "type": "command", "command": ".claude/hooks/test-gate.sh" } ] } ] }. Script runs npm test; on failure prints the failing test names and exits 2; on success exits 0.',
    reflectionQuestions: ['When is a Stop hook better than just asking in the prompt?', 'What is the risk of a too-strict gate?'],
  },
  {
    id: 'ch-lib-skill', pool: 'library', difficulty: 'advanced', skills: ['skills'],
    title: 'Requirement → implementation plan skill',
    scenario: 'Every product requirement should get the same rigorous planning treatment with one command.',
    objective: 'Write .claude/skills/req-to-plan/SKILL.md.',
    instructions: [
      'Frontmatter: name, description, argument-hint, sensible tool allowlist, decide model-invocation',
      'Steps: restate + open questions → affected files → 2 approaches w/ trade-offs → recommendation → verifiable steps each with a check → risks + out-of-scope → write PLAN-<slug>.md',
    ],
    hints: ['$ARGUMENTS is the requirement text', 'This is knowledge + workflow; probably keep it user-invocable'],
    solutionStrategy: 'Encode the Level 18 architecture conversation and the Level 2 verification habit into a repeatable, shareable procedure. Output a durable file so a fresh session can execute it.',
    reflectionQuestions: ['Why write the plan to a file instead of leaving it in the session?', 'Should Claude be able to auto-invoke this? Why or why not?'],
  },
];

export const CHALLENGE_BY_ID: Record<string, Challenge> = Object.fromEntries(CHALLENGES.map((c) => [c.id, c]));
export const DAILY_CHALLENGES = CHALLENGES.filter((c) => c.pool === 'daily');
export const WEEKLY_CHALLENGES = CHALLENGES.filter((c) => c.pool === 'weekly');
