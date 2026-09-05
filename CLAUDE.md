# Claude Code Academy

Interactive course that teaches Claude Code from beginner to advanced power user.
Vite + React 19 + TypeScript + Tailwind v3 + React Router. No backend — everything is
local (localStorage) and works offline after first load.

## Commands

- `npm run dev` — dev server on http://localhost:5173
- `npm run build` — `tsc -b` then `vite build` (must pass before considering work done)
- `npm run lint` — oxlint
- `npm run preview` — serve the production build

## Architecture — keep these layers separate

- `src/content/*` — **all learning content as typed data.** Never hardcode lesson text,
  commands, questions, scenarios, etc. into components. Adding/updating curriculum = editing
  these files.
  - `types.ts` — every content model
  - `lessons/lessons-XX-YY.ts` + `lessons/index.ts` — one lesson per level (0–21)
  - `commands.ts`, `glossary.ts`, `troubleshooting.ts`, `scenarios.ts`, `cheatsheet.ts`,
    `challenges.ts`, `promptLab.ts`, `projects.ts`, `knowledgeGraph.ts`, `certification.ts`,
    `docLinks.ts`, `levels.ts`, `skills.ts`
- `src/sim/*` — the simulator: virtual filesystem missions + a command interpreter
- `src/engine/*` — learning engine: `badges.ts`, `adaptive.ts` (recommendations / weak areas),
  `promptScorer.ts` (heuristic prompt coach), `search.ts` (Fuse-based, typo-tolerant)
- `src/store/progress.tsx` — single reducer + Context, persisted to `localStorage` under `cca:*`
- `src/lib/*` — `storage.ts`, `xp.ts` (level curve), `fuzzy.ts`
- `src/components/*` — reusable UI (`ui.tsx` primitives, `Quiz`, `ExerciseCard`, `Layout`,
  `SearchModal`, `BadgeWatcher`); `Markdown.tsx` is separate so `react-markdown` stays out of
  the main bundle
- `src/pages/*` — one file per route, lazy-loaded in `App.tsx`

## Conventions

- TypeScript is strict; `verbatimModuleSyntax` is on — use `import type` for type-only imports.
  Do **not** use the UMD `React.` namespace in modules; import `type { ReactNode, Dispatch }`.
- Tailwind only; design tokens are in `tailwind.config.js` (`bg`, `ink`, `brand`, `line`,
  `ok`/`warn`/`bad`/`accent`). Dark-first. Component classes (`.btn`, `.card`, `.chip`,
  `.prose-cca`, …) live in `src/index.css`.
- All `localStorage` access goes through `src/lib/storage.ts` (wrapped in try/catch).
- Content that can drift with Claude Code versions must be marked: lessons/commands carry a
  `versionSensitive` flag, and prose should say "Verify against current Claude Code documentation."
- Official docs live at `https://code.claude.com/docs/en/…`. Link to them; never reproduce them
  verbatim — the Academy summarizes and teaches.

## Gotchas

- `progress.tsx` reducer: every action first calls `touchStreak`. XP is only awarded on first
  completion / score improvement — check the existing guards before adding an action.
- The prompt scorer is deliberately a directional coach, not a grader. Strong sample prompts in
  `promptLab.ts` should land ~75–92; tune `promptScorer.ts` if you add tasks, don't chase 100.
- Keep the main JS bundle from regressing: heavy libs (`react-markdown`) belong in lazy-loaded
  routes only.
