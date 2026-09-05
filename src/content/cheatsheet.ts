import type { CheatItem } from './types';

// Cheat sheet. Version-sensitive — confirm against `/help` and the CLI reference.
export const CHEATSHEET: CheatItem[] = [
  // Starting
  { id: 'cs-1', section: 'Starting', command: 'claude', description: 'Interactive session in the current directory' },
  { id: 'cs-2', section: 'Starting', command: 'claude "prompt"', description: 'Start with an initial prompt' },
  { id: 'cs-3', section: 'Starting', command: 'claude -p "prompt"', description: 'Non-interactive: run once, print, exit' },
  { id: 'cs-4', section: 'Starting', command: 'claude -c', description: 'Continue the most recent conversation' },
  { id: 'cs-5', section: 'Starting', command: 'claude -r "name"', description: 'Resume a session by id or name' },
  { id: 'cs-6', section: 'Starting', command: 'claude --permission-mode plan', description: 'Start read-only in plan mode' },
  { id: 'cs-7', section: 'Starting', command: '/help', description: 'Authoritative command list for your version' },
  { id: 'cs-8', section: 'Starting', command: 'claude doctor', description: 'Diagnostics without starting a session' },

  // Navigation & asking
  { id: 'cs-10', section: 'Asking Claude', command: '@path/to/file', description: 'Reference a file; Claude reads it before answering' },
  { id: 'cs-11', section: 'Asking Claude', command: '"give me a tour: stack, entry points, run & test commands"', description: 'Open a new codebase read-only' },
  { id: 'cs-12', section: 'Asking Claude', command: '"trace <feature> from entry point to persistence, file by file"', description: 'Learn conventions fast' },
  { id: 'cs-13', section: 'Asking Claude', command: '"look through the git history of X and summarize how it evolved"', description: 'Point Claude at the source that answers the question' },
  { id: 'cs-14', section: 'Asking Claude', command: 'cat error.log | claude -p "explain and suggest a fix"', description: 'Pipe data straight in' },

  // Editing
  { id: 'cs-20', section: 'Editing', command: '"in <file>, <precise change>. do not touch anything else. show the diff"', description: 'Scope a change tightly' },
  { id: 'cs-21', section: 'Editing', command: '"undo that"', description: 'Revert Claude\'s last change' },
  { id: 'cs-22', section: 'Editing', command: 'Esc', description: 'Interrupt mid-action; context preserved' },
  { id: 'cs-23', section: 'Editing', command: 'Esc Esc  /  /rewind', description: 'Restore an earlier checkpoint (conversation/code/both)' },
  { id: 'cs-24', section: 'Editing', command: 'Shift+Tab', description: 'Cycle permission modes' },

  // Git
  { id: 'cs-30', section: 'Git', command: '"create a branch feat/<name> off main"', description: 'Branch before non-trivial work' },
  { id: 'cs-31', section: 'Git', command: '"summarize what changed, grouped by purpose; flag anything not required"', description: 'Review a multi-file diff' },
  { id: 'cs-32', section: 'Git', command: '"commit with a descriptive message"', description: 'Claude writes a good message from the diff' },
  { id: 'cs-33', section: 'Git', command: '"open a PR; explain the approach and how to test it"', description: 'Needs the gh CLI' },
  { id: 'cs-34', section: 'Git', command: '"resolve the conflicts in <file>, keeping both features; show me both sides first"', description: 'Merge conflicts' },
  { id: 'cs-35', section: 'Git', command: '"revert the <x> commit but keep <y>"', description: 'Targeted revert' },

  // Testing
  { id: 'cs-40', section: 'Testing', command: '"write failing tests for <cases> first, run them, then implement until green"', description: 'TDD' },
  { id: 'cs-41', section: 'Testing', command: '"run the tests and paste the output"', description: 'Demand evidence, not assertions' },
  { id: 'cs-42', section: 'Testing', command: '"cover the edge cases: empty, one, many, null, boundary, duplicate call"', description: 'The happy path rarely breaks' },
  { id: 'cs-43', section: 'Testing', command: '/verify', description: 'Build + run to confirm against the real app' },

  // Debugging
  { id: 'cs-50', section: 'Debugging', command: '"first give me a failing test / script that reproduces this"', description: 'Reproduce before fixing' },
  { id: 'cs-51', section: 'Debugging', command: '"rank the 2–3 most likely causes given this trace, then confirm before fixing"', description: 'No guessing' },
  { id: 'cs-52', section: 'Debugging', command: '"fix the root cause, do not suppress the error or add a retry that hides it"', description: 'Root cause, not symptom' },
  { id: 'cs-53', section: 'Debugging', command: '"keep the reproduction as a regression test; run the full suite"', description: 'Lock the fix in' },
  { id: 'cs-54', section: 'Debugging', command: '/debug', description: 'Bundled debugging skill' },

  // Context
  { id: 'cs-60', section: 'Context', command: '/context', description: 'What is loaded + how full the window is' },
  { id: 'cs-61', section: 'Context', command: '/clear', description: 'Wipe context — between unrelated tasks' },
  { id: 'cs-62', section: 'Context', command: '/compact [focus]', description: 'Summarize history, keep key state' },
  { id: 'cs-63', section: 'Context', command: '/btw', description: 'Ask a side question without adding it to history' },
  { id: 'cs-64', section: 'Context', command: '"use subagents to investigate X"', description: 'Keep verbose research out of your context' },

  // Memory / instructions
  { id: 'cs-70', section: 'Instructions', command: '/init', description: 'Generate / improve a project CLAUDE.md' },
  { id: 'cs-71', section: 'Instructions', command: '/memory', description: 'List and edit CLAUDE.md files; toggle auto memory' },
  { id: 'cs-72', section: 'Instructions', command: '.claude/rules/*.md with paths: frontmatter', description: 'Instructions that load only for matching files' },

  // Agents
  { id: 'cs-80', section: 'Agents', command: '.claude/agents/<name>.md', description: 'Define a subagent (frontmatter + system prompt)' },
  { id: 'cs-81', section: 'Agents', command: '@"<name> (agent)" <task>', description: 'Guarantee a specific subagent runs' },
  { id: 'cs-82', section: 'Agents', command: 'claude --agent <name>', description: 'Run the whole session as that agent' },
  { id: 'cs-83', section: 'Agents', command: '/code-review   /security-review', description: 'Fresh-context review of your diff' },
  { id: 'cs-84', section: 'Agents', command: '/batch <instruction>', description: 'Fan a change across 5–30 subagents + PRs' },

  // MCP
  { id: 'cs-90', section: 'MCP', command: 'claude mcp add --transport http <name> <url>', description: 'Add a remote MCP server' },
  { id: 'cs-91', section: 'MCP', command: 'claude mcp add --transport stdio <name> -- <cmd>', description: 'Add a local MCP server' },
  { id: 'cs-92', section: 'MCP', command: '/mcp', description: 'Connection status + OAuth login' },
  { id: 'cs-93', section: 'MCP', command: 'claude mcp list / get <name> / remove <name>', description: 'Manage servers' },

  // Hooks / automation
  { id: 'cs-100', section: 'Hooks', command: '"hooks": { "PostToolUse": [ { "matcher": "Edit|Write", ... } ] }', description: 'settings.json — format/lint after edits' },
  { id: 'cs-101', section: 'Hooks', command: 'PreToolUse hook, exit 2', description: 'Block a dangerous tool call' },
  { id: 'cs-102', section: 'Hooks', command: 'Stop hook running the test suite', description: 'Turn cannot end until tests pass' },
  { id: 'cs-103', section: 'Automation', command: '/goal <condition>', description: 'Iterate until an evaluator confirms done' },
  { id: 'cs-104', section: 'Automation', command: '/loop <interval> <prompt>', description: 'Repeat a prompt on an interval' },
  { id: 'cs-105', section: 'Automation', command: '/schedule', description: 'Create a cloud routine on a cron schedule' },

  // Security
  { id: 'cs-110', section: 'Security', command: '/permissions', description: 'Audit and edit allow/ask/deny rules' },
  { id: 'cs-111', section: 'Security', command: '/sandbox', description: 'Configure filesystem/network isolation for Bash' },
  { id: 'cs-112', section: 'Security', command: 'Never: bypassPermissions on a real machine', description: 'It removes the only gate on destructive commands' },
  { id: 'cs-113', section: 'Security', command: 'Untrusted repo: inspect scripts/hooks/.mcp.json read-only, in a VM, before running', description: 'Supply-chain hygiene' },
  { id: 'cs-114', section: 'Security', command: 'Pasted a secret? Rotate it — the conversation is stored', description: 'Treat exposure as compromise' },
];

export const CHEAT_SECTIONS = Array.from(new Set(CHEATSHEET.map((c) => c.section)));
