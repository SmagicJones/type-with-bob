# PLAN.md — Type with Bob: Kickoff Brief

Read `CLAUDE.md` first; it holds the rules this plan must follow. This document describes **what to build** in the first iteration and **in what order**.

## Goal

Build a working first version of a beginner-friendly touch-typing tutor: structured lessons, a visual keyboard with finger guidance, free practice, and stats with a per-key heatmap, all running client-side with progress saved in the browser.

"Done" for this iteration means a person can open the app, work through the early lessons, see how they did, close the tab, come back, and find their progress intact. The codebase is tidy, fully tested, and easy to extend.

## Scope

### In scope (this iteration)

1. **Project scaffold:** React Router v8 framework mode (SPA, `ssr: false`), TypeScript strict, Tailwind, ESLint, Prettier, Vitest + React Testing Library, Playwright, all scripts from `CLAUDE.md` working.
2. **Typing engine** (pure TypeScript): target text + keystrokes in, state out (position, per-character status, errors, timings, per-key stats).
3. **Lessons:** a staged curriculum as data. Home row → top row → bottom row → shift and capitals → numbers → common punctuation. Roughly 15–25 short lessons in total, each with a name, target keys and generated or authored practice lines.
4. **Lesson screen:** the text to type, live feedback, the visual keyboard highlighting the next key and the finger to use, live WPM and accuracy.
5. **Results screen:** WPM, accuracy, time, per-key breakdown, pass/fail against a lesson threshold, and next/retry actions.
6. **Visual keyboard:** UK QWERTY layout by default, finger colour-coding, next-key highlight. Layout defined as data.
7. **Free practice:** pick a length and a text source (word list or public-domain/original passages) and type it, with the same stats.
8. **Stats page:** history of attempts, WPM/accuracy over time, and a per-key heatmap showing slow or error-prone keys.
9. **Persistence:** progress, unlocked lessons, and attempt history saved to localStorage via the `ProgressStore` interface.
10. **Bob:** a simple original mascot (inline SVG or a small component) that reacts at a basic level (idle, happy on success, encouraging on struggle). No complex animation.
11. **Testing:** unit tests for every feature, component tests for UI, Playwright e2e for all core journeys, axe checks per route.

### Out of scope (do not build now)

- Accounts, authentication, a backend, or any network calls
- Canvas-based mini-games (planned for a later iteration)
- The adaptive "practice your weak keys" algorithm (the per-key stats collected now are its foundation; do not implement the algorithm yet)
- Sound effects and music
- Touch or on-screen keyboard support, and mobile-specific layouts beyond a basic responsive design
- Languages other than English, and keyboard layouts other than UK and US QWERTY
- Dvorak, Colemak, or other alternative layouts
- Analytics, ads, or third-party scripts

If something not listed here seems necessary, ask before adding it.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Home: continue where you left off, lesson map overview, link to practice and stats |
| `/lessons` | Lesson map showing locked, unlocked and completed lessons |
| `/lessons/:lessonId` | Lesson screen |
| `/lessons/:lessonId/results` | Results for the most recent attempt (or redirect if none) |
| `/practice` | Free practice setup and session |
| `/stats` | History and per-key heatmap |
| `*` | Friendly 404 |

Use `clientLoader`/`clientAction` as appropriate in SPA mode. Provide an error boundary at the root and per-route where useful.

## Engine specification (starting point)

Keep this pure and deterministic. Suggested shape; refine as tests drive the design:

```ts
type CharStatus = 'pending' | 'correct' | 'incorrect' | 'corrected'

type EngineState = {
  target: string
  position: number
  chars: CharStatus[]           // status per target character
  keystrokes: Keystroke[]       // every keystroke recorded, including wrong ones
  startedAt: number | null      // timestamp supplied by caller
  finishedAt: number | null
}

type Keystroke = { key: string; expected: string; correct: boolean; at: number }

createEngine(target: string): EngineState
applyKey(state: EngineState, key: string, at: number): EngineState
getSummary(state: EngineState, now: number): { wpm: number; accuracy: number; elapsedMs: number; errors: number }
getKeyStats(state: EngineState): Record<string, { attempts: number; errors: number; avgLatencyMs: number }>
```

Decisions to make explicit in code and tests:

- **Wrong key behaviour:** the cursor does not advance on an error; the character is marked incorrect until the correct key is typed (stop-on-error, the classic tutor feel). Record every wrong keystroke for accuracy.
- **Backspace:** ignored in lesson mode (stop-on-error already handles correction). Document it in a comment.
- **WPM:** (correct characters ÷ 5) ÷ minutes elapsed. Guard against zero elapsed time.
- **Accuracy:** correct keystrokes ÷ total keystrokes, as a percentage, counting every wrong attempt.
- **Timer starts on the first keystroke**, not when the lesson loads.
- **Latency per key:** time since the previous keystroke, attributed to the key being typed; the first keystroke has no latency.
- Typing past the end is a no-op.

## Build order

Work in phases. **Each phase ends with `npm run check` green and a commit.** Do not start a phase until the previous one passes.

### Phase 0: Scaffold

- Create the project with the official React Router scaffold, then configure SPA mode, strict TS, Tailwind, ESLint, Prettier, Vitest + RTL (jsdom), Playwright, coverage thresholds, `.nvmrc`, and every script in `CLAUDE.md`.
- Add a trivial home route with one component test and one Playwright smoke test to prove the whole pipeline works end to end.
- Add a minimal CI workflow (GitHub Actions) running `npm run check` and `npm run test:e2e`.
- Write `README.md`.

### Phase 1: Typing engine

- Implement the engine with tests first. Cover every decision listed above plus the edge cases from `CLAUDE.md`.
- No UI in this phase.

### Phase 2: Keyboard layouts and visual keyboard

- UK and US QWERTY layout data including finger assignments and shifted characters.
- `VisualKeyboard` component: renders keys, highlights the next key and a finger hint, shows shift when needed.
- Tests: layout data integrity (every printable character reachable, no key without a finger), component behaviour.

### Phase 3: Typing input and text display

- `useTypingInput` hook (native `keydown`, timestamps, modifier handling, `preventDefault` where needed) with tests.
- `TypingText` component with memoised per-character rendering, including a non-colour cue for errors.
- A temporary demo route is fine, but remove it before finishing the phase if the lesson screen supersedes it.

### Phase 4: Lessons and lesson screen

- Curriculum as data with validation tests (every lesson only uses keys it or earlier lessons have introduced; thresholds present; unique ids).
- Practice line generator (deterministic given a seed, so tests are stable).
- Lesson route: text, keyboard, live stats, completion → results.
- E2E: complete a lesson by typing it.

### Phase 5: Results, persistence and progression

- `ProgressStore` interface, localStorage and in-memory implementations, schema validation, versioned storage key.
- Results screen, pass/fail threshold, unlocking the next lesson, lesson map with locked/unlocked/complete states.
- E2E: complete a lesson, reload, confirm progress and unlocks persisted. Corrupt storage falls back gracefully (test it).

### Phase 6: Free practice

- Text sources (original word lists and a few short public-domain or original passages, source recorded for each), length options, session flow reusing the engine, keyboard and stats.
- E2E: complete a practice session.

### Phase 7: Stats and heatmap

- Aggregate per-key stats across attempts, WPM/accuracy over time (a simple chart built with plain SVG or Tailwind, with no charting dependency unless justified), and a heatmap drawn over the visual keyboard.
- Unit tests for aggregation; component tests for the heatmap; E2E for the stats page after a couple of attempts.

### Phase 8: Bob and polish

- Mascot component with three states and tests for state selection logic.
- Friendly copy, empty states, 404 page, error boundaries, responsive pass, reduced-motion handling.
- Full axe pass across all routes. Fix findings.
- Final README update and a short `docs/architecture.md` describing the engine/UI split.

## Acceptance criteria

The iteration is complete when all of these are true:

- [ ] `npm run check` passes with zero warnings, and `npm run test:e2e` passes.
- [ ] Coverage thresholds from `CLAUDE.md` are met and enforced.
- [ ] A new user can finish the first lesson using only the keyboard and see accurate WPM, accuracy and a per-key breakdown.
- [ ] Progress survives a page reload; corrupt storage does not crash the app.
- [ ] Free practice works with at least two text sources and three lengths.
- [ ] The stats page shows history and a per-key heatmap.
- [ ] No axe violations on any route.
- [ ] No references to other typing products' names or branding anywhere in the repo.
- [ ] The architecture rules in `CLAUDE.md` hold (engine is pure; features only import each other via `index.ts`; route modules are thin).

## Working agreement

- Start by reading both files, then briefly summarise your understanding and flag any ambiguity or risk **before** writing code.
- Verify React Router v8, Tailwind and Vite setup details against current official docs rather than memory.
- Report at the end of each phase: what was built, what was tested, anything you deviated on and why, and what's next.
- If you hit a decision this plan doesn't cover, choose the simplest option that satisfies `CLAUDE.md`, note it in the phase report, and carry on. Ask only for genuinely blocking questions.

## Future iterations (for context only; do not build)

1. Adaptive practice weighted towards weak keys, using the per-key stats already collected.
2. Canvas-based mini-games (falling words, races) driven by the same engine.
3. Sound, more Bob animation, achievements and streaks.
4. Additional layouts and languages.
