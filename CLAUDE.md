# CLAUDE.md — Type with Bob

A friendly, beginner-focused touch-typing tutor that runs entirely in the browser. This file holds the standing rules for the codebase. Read it at the start of every session. The one-off kickoff brief is in `PLAN.md`.

## Stack

- **Framework:** React Router v8 in **framework mode**, **SPA mode** (`ssr: false`), deployed as static files
- **Language:** TypeScript, `strict` mode, no exceptions
- **Styling:** Tailwind CSS (use the current major version's official Vite plugin)
- **Unit/component tests:** Vitest + React Testing Library
- **End-to-end tests:** Playwright
- **Tooling:** ESLint, Prettier, Node 22 (pin in `.nvmrc` and `engines`)

React Router v8 is new. **Before writing routing or config code, check the current docs at https://reactrouter.com** rather than relying on memory. Known v8 facts: the package is `react-router` (never `react-router-dom`; DOM-specific APIs come from `react-router/dom`), middleware is always on, builds are ESM-only, and framework mode needs a recent Node 22, React 19.2.x and Vite 7+. Use the generated route types (`./+types/<route>`), and run `react-router typegen` as part of typecheck.

## Commands

All of these must exist in `package.json` and work:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | `react-router typegen && tsc --noEmit` |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run format` | Prettier write (`format:check` for CI) |
| `npm test` | Vitest, single run |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Vitest with coverage thresholds |
| `npm run test:e2e` | Playwright |
| `npm run check` | typecheck + lint + format:check + test + build. **This is the gate.** |

Run `npm run check` before declaring any task done. Never claim something works without running it.

## Architecture

The central rule: **the typing engine knows nothing about the UI, and the UI knows nothing about how the engine works internally.**

```
app/
  routes.ts                 # route config
  root.tsx
  routes/                   # thin route modules: wire up loaders + compose feature components
  features/
    typing-engine/          # PURE TypeScript. No React, no DOM, no timers.
    lessons/                # lesson definitions (data) + lesson-flow components
    keyboard/               # keyboard layouts (data) + visual keyboard components
    stats/                  # WPM/accuracy/per-key stats + heatmap components
    progress/               # persistence (localStorage behind an interface)
    practice/               # free-practice mode + text sources
    mascot/                 # Bob
  components/ui/            # generic reusable UI (Button, Card, ProgressBar...)
  lib/                      # small shared utilities
e2e/                        # Playwright specs
```

Rules:

1. **Feature folders are self-contained.** Each exposes a public API through `index.ts`. Do not import from another feature's internals; import from its `index.ts` only.
2. **`typing-engine` must stay pure.** No `window`, `document`, `React`, `Date.now()` or `performance.now()`. Timestamps are passed in as arguments. This keeps it deterministic and trivially testable.
3. **Route modules stay thin.** Business logic lives in features, not in `app/routes/`.
4. **Keystroke capture is a hook** (`useTypingInput` or similar) that attaches a native `keydown` listener, timestamps with `performance.now()`, ignores modifier-only keys, and prevents default for keys that scroll or trigger browser shortcuts. It calls the engine; it contains no scoring logic.
5. **The text display must not re-render the whole passage per keystroke.** Render each character as a memoised component so only the characters whose state changed update.
6. **Keyboard layouts are data, not code.** UK QWERTY is the default; US QWERTY must be addable by adding a data file, with no component changes.
7. **Persistence goes through an interface** (`ProgressStore`) with a localStorage implementation and an in-memory implementation for tests. Components never touch `localStorage` directly. Validate stored data on read (with a schema or type guards) and handle corrupt or missing data gracefully.

## TypeScript rules

- No `any`. No `@ts-ignore`. `@ts-expect-error` only with a comment explaining why.
- No non-null assertions (`!`) outside tests.
- Prefer `type` for data shapes and discriminated unions for state machines (for example, lesson status: `not-started | in-progress | complete`).
- Prefer named exports. Default exports only where React Router requires them (route modules).
- Prefer small pure functions over classes in the engine. Use classes only if there is a clear reason.

## React and styling rules

- Function components and hooks only.
- One component per file; filename matches the component name (`LessonCard.tsx`).
- Props are typed explicitly. Components accept `className` where it makes sense so they can be composed.
- Tailwind utilities in JSX. Extract a component, not a custom CSS class, when a pattern repeats. Keep any custom CSS to a minimum.
- Use semantic HTML (`button`, `nav`, `main`, headings in order). Do not use `div` with click handlers.
- Respect `prefers-reduced-motion` for all animation.

## Testing rules (non-negotiable)

**Every feature ships with tests in the same change as the code. No feature is done without them.**

1. **Unit tests are colocated:** `thing.ts` → `thing.test.ts`; `Thing.tsx` → `Thing.test.tsx`.
2. **`typing-engine`, `stats` and `progress` logic needs thorough unit coverage**, including edge cases: empty input, backspace at position zero, typing past the end, rapid keystrokes, zero elapsed time (no division by zero), corrupt stored data. Coverage thresholds are enforced in `vitest.config.ts` (start at 90% lines/functions for these three features, 80% overall) and the build fails below them.
3. **Components are tested through behaviour** with React Testing Library: query by role and label, use `userEvent`, assert what the user sees. Do not test implementation details or snapshot whole trees.
4. **Every user-facing route has at least one Playwright spec** covering its main journey. Core journeys that must always be covered: complete a lesson end to end, see results, see progress persisted after reload, use free practice.
5. **Bug fixes start with a failing test** that reproduces the bug.
6. **No flaky tests.** No arbitrary `sleep`/timeouts; use Playwright's auto-waiting and Testing Library's `findBy`/`waitFor`. Use fake timers or injected timestamps for anything time-based.
7. **Test data is built with small factory functions** in a `test-utils` folder, not copy-pasted literals.

## Accessibility

- Everything usable by keyboard. Visible focus states.
- The typing area announces state appropriately for screen readers (for example, an `aria-live` region for results and errors, not per-keystroke chatter).
- Never rely on colour alone to show correct vs incorrect; add a second cue (underline, icon, or pattern).
- Run an automated a11y check (`@axe-core/playwright`) on each route in e2e.

## Content and branding

- **Never use the names, logos, characters or likenesses of other typing products** (including Mavis Beacon and Kaz). Our mascot is Bob; keep him original.
- Practice text must be original or public domain. Record the source of any non-original text in a comment or data field.

## Workflow and tidiness

- Work in small, reviewable steps. Make a commit per logical change using Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`, `refactor:`, `docs:`).
- Do not add a dependency without a one-line justification in the commit message. Prefer the platform and existing deps over new packages.
- No dead code, commented-out code, or leftover `console.log`.
- If a rule here conflicts with what a task needs, stop and ask rather than quietly breaking the rule.
- Keep `README.md` current: how to install, run, test, and where things live.
- If you discover a new convention worth keeping, propose adding it to this file.

## Definition of done

A task is done only when:

1. The behaviour works and matches `PLAN.md`.
2. Unit tests (and e2e where a route is affected) are written and passing.
3. `npm run check` passes cleanly.
4. The change follows the architecture rules above.
5. Docs/README are updated if anything user-facing or structural changed.
