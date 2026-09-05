# Claude Code Academy

An interactive course — not a documentation site — that takes you from "what is an AI coding
agent?" to designing autonomous, verified development workflows with Claude Code.

It combines an interactive curriculum, a Claude Code playground/simulator, guided challenges, a
prompt lab, a reference manual, a project library, and a progress tracker with adaptive
recommendations.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for production:

```bash
npm run build && npm run preview
```

No API key, no backend. All progress is stored in your browser (`localStorage`) and the
educational content works offline after the first load.

## What's inside

| Area | What it does |
| --- | --- |
| **Dashboard** | Level/rank, XP, streak, course %, adaptive "recommended next", weak areas, strengths, badges, daily challenge |
| **Learn** | 28 lessons across 21 levels (0 → 21). Each: objectives, prerequisites, markdown lesson, interactive exercises, a quiz, reflection questions, official-doc links |
| **Practice** | Hub for the applied modes below |
| **What Would You Do?** | 40 realistic judgment scenarios, every answer explained |
| **Prompt Lab** | Write real prompts; scored 0–100 on clarity, context, constraints, verification, scope, safety, with feedback |
| **Simulator** | A simulated Claude Code terminal + file tree + git diff. 3 missions (explore a repo, review a diff, manage context). No API needed |
| **Projects** | 16 project briefs (beginner → expert) with requirements, constraints, workflow, hidden tests, evaluation criteria, hints, solution strategy, reflection |
| **Challenges** | Daily (deterministic per date) + weekly + a library of applied drills |
| **Reference** | Command Explorer (what/when/beginner+advanced example/common mistake/related) and a searchable, favoritable Cheat Sheet |
| **Troubleshooting Lab** | 27 issues: symptom → causes → diagnostics → solution → prevention, by category incl. Windows/macOS/Linux |
| **Glossary** | 49 terms, each linking back into the lessons where it matters |
| **Knowledge Map** | Interactive concept graph; click a node to open its lesson |
| **Latest Documentation** | Curated links into the official docs, each with an Academy note; clearly separates OFFICIAL from Academy explanation |
| **Certification** | 10-part, 42-question exam drawing on every level; parts 9–10 are done in Claude Code itself |
| **Progress** | Full skill-mastery breakdown, all badges, bookmarks, export/import/reset |

Global search (`/` or ⌘/Ctrl-K) is typo-tolerant across lessons, commands, glossary,
troubleshooting, scenarios, challenges, projects, and the cheat sheet.

## Keeping content current

The curriculum is **data**, not code — everything lives in `src/content/*` as typed modules.
Updating for a new Claude Code release is an edit to data files. Version-dependent material is
tagged `versionSensitive` and the prose says so. The research behind the current content is the
official docs at <https://code.claude.com/docs>.

## Stack

Vite 8 · React 19 · TypeScript (strict) · Tailwind v3 · React Router 7 · Fuse.js ·
react-markdown. See `CLAUDE.md` for the architecture and conventions.
