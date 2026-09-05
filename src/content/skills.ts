import type { SkillMeta } from './types';

export const SKILLS: SkillMeta[] = [
  { id: 'prompting', label: 'Prompting', blurb: 'Communicating goals, context, and constraints to an agent.' },
  { id: 'navigation', label: 'File navigation', blurb: 'Finding files, searching code, understanding structure.' },
  { id: 'codebase', label: 'Codebase understanding', blurb: 'Mapping architecture and data flow in unfamiliar projects.' },
  { id: 'building', label: 'Building apps', blurb: 'Plan → architect → implement → test → ship with Claude.' },
  { id: 'git', label: 'Git', blurb: 'Branches, diffs, commits, PRs, reviewing agent changes.' },
  { id: 'debugging', label: 'Debugging', blurb: 'Reproduce, gather evidence, isolate, fix, regression-test.' },
  { id: 'testing', label: 'Testing', blurb: 'Unit/integration/e2e, TDD, coverage, evidence of correctness.' },
  { id: 'claude-md', label: 'CLAUDE.md', blurb: 'Persistent project instructions that actually get followed.' },
  { id: 'context', label: 'Context management', blurb: 'Keeping the context window focused and productive.' },
  { id: 'commands', label: 'Commands', blurb: 'Slash commands, CLI flags, and interactive controls.' },
  { id: 'subagents', label: 'Subagents', blurb: 'Delegation, parallel investigation, specialized agents.' },
  { id: 'mcp', label: 'MCP', blurb: 'Connecting external tools and data via Model Context Protocol.' },
  { id: 'hooks', label: 'Hooks', blurb: 'Deterministic automation on lifecycle events.' },
  { id: 'skills', label: 'Skills', blurb: 'Reusable, on-demand workflows and domain knowledge.' },
  { id: 'terminal', label: 'Terminal', blurb: 'The shell skills Claude Code work actually requires.' },
  { id: 'security', label: 'Security', blurb: 'Permissions, secrets, untrusted code, prompt injection.' },
  { id: 'large-projects', label: 'Large projects', blurb: 'Worktrees, decomposition, incremental change at scale.' },
  { id: 'architecture', label: 'Architecture', blurb: 'Using Claude as a design partner and decision recorder.' },
  { id: 'teamwork', label: 'Team workflows', blurb: 'Treating Claude Code as a structured software team.' },
  { id: 'autonomy', label: 'Autonomous dev', blurb: 'Plan → execute → verify → review loops you can trust.' },
];

export const SKILL_LABEL: Record<string, string> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s.label]),
);
