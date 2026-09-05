export interface DocLink {
  title: string;
  url: string;
  academyNote: string;
  section: string;
}

// "Latest Documentation" hub. We link to official docs and add an Academy note —
// we do not reproduce documentation verbatim.
export const DOC_LINKS: DocLink[] = [
  { section: 'Start here', title: 'Overview', url: 'https://code.claude.com/docs/en/overview', academyNote: 'What Claude Code is and every surface it runs on. Read alongside Level 0.' },
  { section: 'Start here', title: 'Quickstart', url: 'https://code.claude.com/docs/en/quickstart', academyNote: 'Your first real task end to end. Pairs with Level 1.' },
  { section: 'Start here', title: 'How Claude Code works', url: 'https://code.claude.com/docs/en/how-claude-code-works', academyNote: 'The agent loop, tools, and context — the mental model behind everything.' },
  { section: 'Start here', title: "What's new", url: 'https://code.claude.com/docs/en/whats-new', academyNote: 'Weekly changelog. Check this when the Academy and your session disagree.' },

  { section: 'Working effectively', title: 'Best practices', url: 'https://code.claude.com/docs/en/best-practices', academyNote: 'The single most useful page. Underpins Levels 2, 4, 9, and 20.' },
  { section: 'Working effectively', title: 'Common workflows', url: 'https://code.claude.com/docs/en/common-workflows', academyNote: 'Step-by-step recipes: new codebase, bug fix, tests, PRs.' },
  { section: 'Working effectively', title: 'Explore the context window', url: 'https://code.claude.com/docs/en/context-window', academyNote: 'Interactive walkthrough of what fills context and what each read costs. Level 9.' },
  { section: 'Working effectively', title: 'Manage sessions', url: 'https://code.claude.com/docs/en/sessions', academyNote: 'Resume, branch, rename sessions like git branches.' },
  { section: 'Working effectively', title: 'Prompt library', url: 'https://code.claude.com/docs/en/prompt-library', academyNote: 'Ready-made prompts to adapt.' },

  { section: 'Instructions & memory', title: 'How Claude remembers your project', url: 'https://code.claude.com/docs/en/memory', academyNote: 'CLAUDE.md hierarchy, rules, auto memory, imports. Level 8.' },
  { section: 'Instructions & memory', title: 'Extend Claude Code', url: 'https://code.claude.com/docs/en/features-overview', academyNote: 'Decision guide: skill vs rule vs hook vs subagent vs MCP.' },

  { section: 'Commands & config', title: 'CLI reference', url: 'https://code.claude.com/docs/en/cli-reference', academyNote: 'Every command and flag. The Command Explorer is our teaching layer over this.' },
  { section: 'Commands & config', title: 'Commands', url: 'https://code.claude.com/docs/en/commands', academyNote: 'Slash commands in detail.' },
  { section: 'Commands & config', title: 'Interactive mode', url: 'https://code.claude.com/docs/en/interactive-mode', academyNote: 'Keyboard shortcuts and in-session controls.' },
  { section: 'Commands & config', title: 'Settings', url: 'https://code.claude.com/docs/en/settings', academyNote: 'settings.json layers and precedence.' },
  { section: 'Commands & config', title: 'Permission modes', url: 'https://code.claude.com/docs/en/permission-modes', academyNote: 'default / plan / acceptEdits / auto / bypass — pick deliberately. Level 10.' },
  { section: 'Commands & config', title: 'Checkpointing', url: 'https://code.claude.com/docs/en/checkpointing', academyNote: 'Rewind and summarize. Remember: not a Git substitute.' },

  { section: 'Agents', title: 'Create custom subagents', url: 'https://code.claude.com/docs/en/sub-agents', academyNote: 'Frontmatter fields, storage, invocation. Level 11.' },
  { section: 'Agents', title: 'Run agents in parallel', url: 'https://code.claude.com/docs/en/agents', academyNote: 'Lead + workers coordinating on one task.' },
  { section: 'Agents', title: 'Dynamic workflows', url: 'https://code.claude.com/docs/en/workflows', academyNote: 'Orchestrating many subagents at scale.' },
  { section: 'Agents', title: 'Worktrees', url: 'https://code.claude.com/docs/en/worktrees', academyNote: 'Isolated parallel checkouts. Levels 5 and 17.' },
  { section: 'Agents', title: 'Agent teams', url: 'https://code.claude.com/docs/en/agent-teams', academyNote: 'Experimental multi-session coordination. Level 19.' },

  { section: 'MCP', title: 'Connect Claude Code to tools via MCP', url: 'https://code.claude.com/docs/en/mcp', academyNote: 'Transports, scopes, .mcp.json, auth, security. Level 12.' },
  { section: 'MCP', title: 'MCP quickstart', url: 'https://code.claude.com/docs/en/mcp-quickstart', academyNote: 'Connect your first server end to end.' },

  { section: 'Automation', title: 'Automate actions with hooks (guide)', url: 'https://code.claude.com/docs/en/hooks-guide', academyNote: 'When and why to use hooks. Level 13.' },
  { section: 'Automation', title: 'Hooks reference', url: 'https://code.claude.com/docs/en/hooks', academyNote: 'Every event, handler type, and field.' },
  { section: 'Automation', title: 'Keep Claude working toward a goal', url: 'https://code.claude.com/docs/en/goal', academyNote: '/goal condition evaluation. Level 20.' },
  { section: 'Automation', title: 'Run Claude Code programmatically', url: 'https://code.claude.com/docs/en/headless', academyNote: 'claude -p, output formats, CI integration.' },
  { section: 'Automation', title: 'Run prompts on a schedule', url: 'https://code.claude.com/docs/en/scheduled-tasks', academyNote: '/loop and scheduled tasks.' },

  { section: 'Skills & plugins', title: 'Extend Claude with skills', url: 'https://code.claude.com/docs/en/skills', academyNote: 'SKILL.md, frontmatter, arguments, invocation. Level 14.' },
  { section: 'Skills & plugins', title: 'Discover and install plugins', url: 'https://code.claude.com/docs/en/discover-plugins', academyNote: 'Bundled skills/hooks/agents/MCP from the community and Anthropic.' },
  { section: 'Skills & plugins', title: 'Create plugins', url: 'https://code.claude.com/docs/en/plugins', academyNote: 'Package your setup for distribution.' },

  { section: 'Security', title: 'Security', url: 'https://code.claude.com/docs/en/security', academyNote: 'Permission architecture, prompt injection, MCP and cloud security. Level 16.' },
  { section: 'Security', title: 'Permissions', url: 'https://code.claude.com/docs/en/permissions', academyNote: 'Allow/ask/deny rules, working-directory boundary, read-only commands.' },
  { section: 'Security', title: 'Sandboxing', url: 'https://code.claude.com/docs/en/sandboxing', academyNote: 'Filesystem and network isolation for Bash.' },
  { section: 'Security', title: 'Catch security issues as Claude writes code', url: 'https://code.claude.com/docs/en/security-guidance', academyNote: 'The security-guidance plugin and /security-review.' },

  { section: 'Scale', title: 'Monorepos and large codebases', url: 'https://code.claude.com/docs/en/large-codebases', academyNote: 'Root vs per-directory CLAUDE.md, excludes, rules layout. Level 17.' },
  { section: 'Scale', title: 'Manage costs effectively', url: 'https://code.claude.com/docs/en/costs', academyNote: 'Token-usage reduction strategies.' },

  { section: 'Reference', title: 'Glossary', url: 'https://code.claude.com/docs/en/glossary', academyNote: 'Official term definitions. Our Glossary tab links back into lessons.' },
  { section: 'Reference', title: 'Environment variables', url: 'https://code.claude.com/docs/en/env-vars', academyNote: 'Every CLAUDE_CODE_* variable.' },
  { section: 'Reference', title: 'Tools reference', url: 'https://code.claude.com/docs/en/tools-reference', academyNote: 'The built-in tools and what each does.' },
  { section: 'Reference', title: 'Troubleshooting', url: 'https://code.claude.com/docs/en/troubleshooting', academyNote: 'Official troubleshooting. Our Troubleshooting Lab adds structured diagnostics.' },

  { section: 'SDK', title: 'Agent SDK overview', url: 'https://code.claude.com/docs/en/agent-sdk/overview', academyNote: 'Build your own agents on Claude Code\'s tools and loop.' },
];

export const DOC_SECTIONS = Array.from(new Set(DOC_LINKS.map((d) => d.section)));
