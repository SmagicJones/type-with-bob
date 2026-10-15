# Type with Bob

A friendly, beginner-focused touch-typing tutor that runs entirely in the browser. No accounts and no server: progress is saved in your browser's local storage.

- **Lessons:** 24 short lessons from the home row to punctuation, unlocked one at a time.
- **Visual keyboard:** UK QWERTY (default) or US QWERTY, colour-coded by finger, highlighting the next key and the Shift to hold.
- **Results:** speed, accuracy, time, mistakes and a key-by-key breakdown, with pass/fail against each lesson's target.
- **Free practice:** common words, short stories or proverbs, in three lengths.
- **Stats:** history, speed and accuracy over time, and a heatmap of tricky keys.
- **Bob:** an original keycap mascot who cheers you on.

## Requirements

- Node 22.22 or later (see `.nvmrc`; `nvm use` picks it up)

## Getting started

```sh
npm install
npx playwright install chromium   # once, for end-to-end tests
npm run dev                       # http://localhost:5173
```

## Commands

| Command                 | Purpose                                                                    |
| ----------------------- | -------------------------------------------------------------------------- |
| `npm run dev`           | Dev server                                                                 |
| `npm run build`         | Production build (static files in `build/client`)                          |
| `npm run preview`       | Serve the production build on http://localhost:4173                        |
| `npm run typecheck`     | Generate route types and type-check                                        |
| `npm run lint`          | ESLint, zero warnings allowed                                              |
| `npm run format`        | Format with Prettier (`format:check` to verify only)                       |
| `npm test`              | Unit and component tests (Vitest)                                          |
| `npm run test:watch`    | Vitest in watch mode                                                       |
| `npm run test:coverage` | Tests with coverage thresholds enforced                                    |
| `npm run test:e2e`      | Playwright end-to-end and axe accessibility tests, on the production build |
| `npm run check`         | typecheck + lint + format:check + tests with coverage + build (the gate)   |

## Where things live

```
app/
  routes.ts            route config
  root.tsx             HTML shell, app shell, root error boundary
  routes/              thin route modules: loaders/actions + composing features
  features/
    typing-engine/     pure TypeScript engine: keystrokes in, state and stats out
    typing-area/       keystroke capture hook, text display, reusable typing session
    keyboard/          layouts as data (UK, US), visual keyboard, layout picker
    lessons/           curriculum data, drill generator, progression, lesson screens
    practice/          text sources, practice text generator, practice screens
    stats/             aggregation, heatmap, charts, history and results tables
    progress/          ProgressStore interface, localStorage and in-memory stores
    mascot/            Bob and his mood rules
  components/          app shell, site header and generic UI (components/ui)
  lib/                 small shared utilities (formatting, seeded random)
  test-utils/          shared test data factories
e2e/                   Playwright specs (journeys and axe checks)
docs/architecture.md   how the engine and UI fit together
```

Each feature exposes its public API through `index.ts`; a lint rule stops imports reaching past it. The project rules are in `CLAUDE.md` and the iteration plan in `PLAN.md`.

## Adding a keyboard layout

Add a data file next to `app/features/keyboard/layouts/ukQwerty.ts` and list it in `app/features/keyboard/layouts/index.ts`. The layout tests check that every printable ASCII character can be typed and every key has a finger. No component changes are needed.

## Practice text sources

All lesson lines, the common-words list and the short stories are original. The proverbs are traditional English sayings in the public domain. Each source records its origin in `app/features/practice/sources.ts`.

## Deploying

`npm run build` produces a static single-page app in `build/client`. Configure the host to serve `index.html` for every path.
