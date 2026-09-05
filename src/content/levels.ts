import type { Level } from './types';

/** Level → learner "rank" shown on the dashboard. */
export const RANKS = [
  'Observer', // 0
  'Operator', // 1
  'Communicator', // 2
  'Navigator', // 3
  'Builder', // 4
  'Version Controller', // 5
  'Debugger', // 6
  'Test Engineer', // 7
  'Instruction Architect', // 8
  'Context Strategist', // 9
  'Command Adept', // 10
  'Agent Commander', // 11
  'Integration Engineer', // 12
  'Automation Engineer', // 13
  'Workflow Designer', // 14
  'Terminal Adept', // 15
  'Security Guardian', // 16
  'Systems Engineer', // 17
  'Software Architect', // 18
  'Team Lead', // 19
  'Autonomous Developer', // 20
  'Claude Code Master', // 21
];

export const LEVELS: Level[] = [
  { level: 0, title: 'What Is Claude Code?', subtitle: 'Orientation', summary: 'Agents vs chatbots, terminals, files, Git, repos, environments, and responsible use.' },
  { level: 1, title: 'Claude Code Fundamentals', subtitle: 'First sessions', summary: 'Install, authenticate, launch, inspect a project, make and review a first change.' },
  { level: 2, title: 'Effective Prompting', subtitle: 'Talking to an agent', summary: 'The Task Formula: goal + context + constraints + expected result + verification.' },
  { level: 3, title: 'Codebase Understanding', subtitle: 'Reading before writing', summary: 'Explore architecture, trace data flow, and document an unfamiliar repo safely.' },
  { level: 4, title: 'Building Applications', subtitle: 'From nothing to shipped', summary: 'The build loop: plan, architect, implement, test, debug, refactor, document, deploy.' },
  { level: 5, title: 'Git + Claude Code', subtitle: 'Safe change management', summary: 'Branches, diffs, commits, PRs, merge conflicts, and reviewing agent-generated changes.' },
  { level: 6, title: 'Debugging', subtitle: 'A repeatable method', summary: 'Reproduce → evidence → hypothesis → isolate → fix → regression test.' },
  { level: 7, title: 'Testing', subtitle: 'Evidence of correctness', summary: 'Unit/integration/e2e, TDD with Claude, coverage, mocks, fixtures, edge cases.' },
  { level: 8, title: 'CLAUDE.md', subtitle: 'Persistent instructions', summary: 'What to include, what to cut, hierarchy, rules, and team usage.' },
  { level: 9, title: 'Context Management', subtitle: 'The core constraint', summary: 'Context windows, pollution, /clear vs /compact, and when to start fresh.' },
  { level: 10, title: 'Advanced Commands', subtitle: 'The full toolbox', summary: 'Slash commands, CLI flags, permission modes, checkpoints, and interactive controls.' },
  { level: 11, title: 'Subagents & Agents', subtitle: 'Delegation', summary: 'Specialized agents, parallel investigation, and when delegation is not worth it.' },
  { level: 12, title: 'MCP', subtitle: 'External tools & data', summary: 'Servers, transports, scopes, auth, resources, and security implications.' },
  { level: 13, title: 'Hooks', subtitle: 'Deterministic automation', summary: 'Lifecycle events, formatting, tests, and blocking dangerous operations.' },
  { level: 14, title: 'Skills & Reusable Workflows', subtitle: 'Package your process', summary: 'SKILL.md, on-demand loading, argument passing, and org-wide sharing.' },
  { level: 15, title: 'Terminal Mastery', subtitle: 'The shell you need', summary: 'Navigation, pipes, redirection, env vars, processes — macOS/Linux and PowerShell.' },
  { level: 16, title: 'Security', subtitle: 'Working safely', summary: 'Permissions, secrets, untrusted repos, dependency risk, supply-chain attacks.' },
  { level: 17, title: 'Large Projects', subtitle: 'Scale without breaking prod', summary: 'Architecture mapping, decomposition, worktrees, incremental modernization.' },
  { level: 18, title: 'Architecture with Claude', subtitle: 'Design partner', summary: 'Requirements, trade-offs, alternatives, recommendation, and decision records.' },
  { level: 19, title: 'Claude Code as a Software Team', subtitle: 'Structured roles', summary: 'PM, architect, dev, tester, security, DevOps, reviewer, writer — orchestrated.' },
  { level: 20, title: 'Autonomous / Agentic Development', subtitle: 'Trust, but verify', summary: 'Plan → execute → verify → review → correct → verify again. Autonomy ≠ blind trust.' },
  { level: 21, title: 'Real-World Projects & Certification', subtitle: 'Prove it', summary: 'A graded project library and the final Claude Code certification exam.' },
];

export const LEVEL_BY_NUM: Record<number, Level> = Object.fromEntries(LEVELS.map((l) => [l.level, l]));
